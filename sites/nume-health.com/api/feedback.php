<?php
/**
 * Nume Health — Client feedback / developer ticket API
 *
 * Endpoints (JSON in/out):
 *   GET  api/feedback.php?action=list
 *        Returns the full ticket store: { items: [...] }
 *
 *   POST api/feedback.php?action=add
 *        Body: { type, title, details, priority, page, submittedBy, images? }
 *        Creates a new item and returns it.
 *
 *   POST api/feedback.php?action=update
 *        Body: { id, status?, priority?, title?, details?, agentNotes?,
 *                images?, comment?, commentBy? }
 *        Patches the item (any subset of fields). If `comment` is set,
 *        appends to its comments array.
 *
 *   POST api/feedback.php?action=delete
 *        Body: { id }
 *        Removes the item (and its comments).
 *
 * Storage:
 *   SQLite database, kept OUTSIDE the git working tree so deploys,
 *   `git reset --hard`, and site updates can never remove ticket data
 *   (the old assets/configs/feedback.json flat file was wiped by exactly
 *   that). Path resolution order:
 *     1. NUME_DB_PATH env var (absolute path to the .db file)
 *     2. <parent of git repo root>/nume-data/nume-feedback.db
 *        (on cPanel: /home/<user>/nume-data/nume-feedback.db)
 *     3. assets/configs/nume-feedback.db (gitignored fallback)
 *   On first run, any existing assets/configs/feedback.json is imported
 *   and the file is renamed to feedback.json.migrated.
 *
 * Auth:
 *   Open by default. Set env var NUME_API_TOKEN on the server to require
 *   ?token=... (or X-Nume-Token header) on every request.
 */

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, max-age=0');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Nume-Token');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

/* ---------- Optional shared-secret auth ---------- */
$expectedToken = getenv('NUME_API_TOKEN') ?: '';
if ($expectedToken !== '') {
  $sentToken = $_GET['token'] ?? ($_SERVER['HTTP_X_NUME_TOKEN'] ?? '');
  if (!hash_equals($expectedToken, (string)$sentToken)) {
    http_response_code(401);
    echo json_encode(['ok' => false, 'error' => 'Unauthorized']);
    exit;
  }
}

/* ---------- Helpers ---------- */
function bail($code, $msg, $extra = []) {
  http_response_code($code);
  echo json_encode(array_merge(['ok' => false, 'error' => $msg], $extra));
  exit;
}

function slugify($s) {
  $s = strtolower(trim((string)$s));
  $s = preg_replace('/[^a-z0-9]+/', '-', $s);
  $s = trim($s, '-');
  if ($s === '') $s = 'anon';
  return substr($s, 0, 32);
}

function clamp($s, $max = 4000) {
  $s = (string)$s;
  if (mb_strlen($s) > $max) $s = mb_substr($s, 0, $max);
  return $s;
}

/* Allowed enum values — anything else is rejected. */
$VALID_TYPES    = ['suggestion', 'bug', 'copy-edit', 'dev-task-update', 'feature', 'question'];
$VALID_PRIORITY = ['low', 'med', 'high'];
$VALID_STATUS   = ['new', 'in-review', 'in-progress', 'done', 'wont-do'];

/* ---------- Paths ---------- */
$ROOT        = realpath(__DIR__ . '/..');
$CONFIG_DIR  = $ROOT . DIRECTORY_SEPARATOR . 'assets' . DIRECTORY_SEPARATOR . 'configs';
$LEGACY_JSON = $CONFIG_DIR . DIRECTORY_SEPARATOR . 'feedback.json';

/**
 * Pick a DB location that no git operation can reach: walk up from the site
 * root to the git repo root, then use a sibling `nume-data` directory next to
 * the repo. Falls back to assets/configs/ (gitignored) if that fails.
 */
function resolve_db_path($ROOT, $CONFIG_DIR) {
  $env = getenv('NUME_DB_PATH');
  if ($env !== false && $env !== '') return $env;

  $dir = $ROOT;
  for ($i = 0; $i < 6; $i++) {
    if (file_exists($dir . DIRECTORY_SEPARATOR . '.git')) {
      $parent = dirname($dir);
      if (is_dir($parent) && is_writable($parent)) {
        return $parent . DIRECTORY_SEPARATOR . 'nume-data' . DIRECTORY_SEPARATOR . 'nume-feedback.db';
      }
      break;
    }
    $up = dirname($dir);
    if ($up === $dir) break;
    $dir = $up;
  }
  return $CONFIG_DIR . DIRECTORY_SEPARATOR . 'nume-feedback.db';
}

/* ---------- Database ---------- */
if (!class_exists('PDO') || !in_array('sqlite', PDO::getAvailableDrivers())) {
  bail(500, 'PDO SQLite driver is not available on this server (enable pdo_sqlite).');
}

$DB_FILE = resolve_db_path($ROOT, $CONFIG_DIR);
$DB_DIR  = dirname($DB_FILE);
if (!is_dir($DB_DIR) && !@mkdir($DB_DIR, 0755, true)) {
  bail(500, 'Cannot create database directory', ['dir' => $DB_DIR]);
}

try {
  $pdo = new PDO('sqlite:' . $DB_FILE);
  $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
  $pdo->exec('PRAGMA journal_mode=WAL');
  $pdo->exec('PRAGMA busy_timeout=5000');
  $pdo->exec('PRAGMA foreign_keys=ON');

  $pdo->exec('CREATE TABLE IF NOT EXISTS items (
    id          TEXT PRIMARY KEY,
    type        TEXT NOT NULL,
    title       TEXT NOT NULL,
    details     TEXT NOT NULL DEFAULT \'\',
    priority    TEXT NOT NULL,
    page        TEXT NOT NULL DEFAULT \'\',
    images      TEXT NOT NULL DEFAULT \'\',
    submittedBy TEXT NOT NULL,
    submittedAt TEXT NOT NULL,
    status      TEXT NOT NULL DEFAULT \'new\',
    agentNotes  TEXT NOT NULL DEFAULT \'\',
    updatedAt   TEXT NOT NULL
  )');
  $pdo->exec('CREATE TABLE IF NOT EXISTS comments (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    item_id    TEXT NOT NULL REFERENCES items(id) ON DELETE CASCADE,
    author     TEXT NOT NULL,
    created_at TEXT NOT NULL,
    body       TEXT NOT NULL
  )');
  $pdo->exec('CREATE INDEX IF NOT EXISTS idx_comments_item ON comments(item_id)');
  $pdo->exec('CREATE TABLE IF NOT EXISTS meta (k TEXT PRIMARY KEY, v TEXT NOT NULL)');
} catch (Exception $e) {
  bail(500, 'Database unavailable: ' . $e->getMessage(), ['db' => $DB_FILE]);
}

/* ---------- One-time migration of the legacy JSON store ---------- */
function migrate_legacy_json($pdo, $LEGACY_JSON) {
  $done = $pdo->query("SELECT v FROM meta WHERE k = 'migrated_feedback_json'")->fetchColumn();
  if ($done !== false) return;
  if (!is_file($LEGACY_JSON)) {
    $pdo->exec("INSERT OR IGNORE INTO meta (k, v) VALUES ('migrated_feedback_json', 'no-file')");
    return;
  }

  $data = json_decode(@file_get_contents($LEGACY_JSON), true);
  $items = (is_array($data) && isset($data['items']) && is_array($data['items'])) ? $data['items'] : [];

  $pdo->beginTransaction();
  try {
    $insItem = $pdo->prepare('INSERT OR IGNORE INTO items
      (id, type, title, details, priority, page, images, submittedBy, submittedAt, status, agentNotes, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
    $insComment = $pdo->prepare('INSERT INTO comments (item_id, author, created_at, body) VALUES (?, ?, ?, ?)');

    foreach ($items as $it) {
      if (!is_array($it) || !isset($it['id'])) continue;
      $insItem->execute([
        (string)$it['id'],
        (string)($it['type'] ?? 'suggestion'),
        (string)($it['title'] ?? '(untitled)'),
        (string)($it['details'] ?? ''),
        (string)($it['priority'] ?? 'med'),
        (string)($it['page'] ?? ''),
        (string)($it['images'] ?? ''),
        (string)($it['submittedBy'] ?? 'anon'),
        (string)($it['submittedAt'] ?? gmdate('c')),
        (string)($it['status'] ?? 'new'),
        (string)($it['agentNotes'] ?? ''),
        (string)($it['updatedAt'] ?? gmdate('c')),
      ]);
      if ($insItem->rowCount() > 0 && isset($it['comments']) && is_array($it['comments'])) {
        foreach ($it['comments'] as $c) {
          if (!is_array($c)) continue;
          $insComment->execute([
            (string)$it['id'],
            (string)($c['by'] ?? 'anon'),
            (string)($c['at'] ?? gmdate('c')),
            (string)($c['text'] ?? ''),
          ]);
        }
      }
    }
    $pdo->prepare("INSERT OR IGNORE INTO meta (k, v) VALUES ('migrated_feedback_json', ?)")
        ->execute([gmdate('c') . ' items=' . count($items)]);
    $pdo->commit();
  } catch (Exception $e) {
    $pdo->rollBack();
    bail(500, 'Legacy feedback.json migration failed: ' . $e->getMessage());
  }

  /* Keep the old file as a backup, but out of the way so it can't be
     imported twice if the meta table is ever lost. */
  @rename($LEGACY_JSON, $LEGACY_JSON . '.migrated');
}

migrate_legacy_json($pdo, $LEGACY_JSON);

/* ---------- Row shaping ---------- */
function item_row_to_json($row, $comments) {
  return [
    'id'          => $row['id'],
    'type'        => $row['type'],
    'title'       => $row['title'],
    'details'     => $row['details'],
    'priority'    => $row['priority'],
    'page'        => $row['page'],
    'images'      => $row['images'],
    'submittedBy' => $row['submittedBy'],
    'submittedAt' => $row['submittedAt'],
    'status'      => $row['status'],
    'agentNotes'  => $row['agentNotes'],
    'comments'    => $comments,
    'updatedAt'   => $row['updatedAt'],
  ];
}

function comments_for($pdo, $itemId) {
  $st = $pdo->prepare('SELECT author, created_at, body FROM comments WHERE item_id = ? ORDER BY id ASC');
  $st->execute([$itemId]);
  $out = [];
  foreach ($st->fetchAll(PDO::FETCH_ASSOC) as $c) {
    $out[] = ['by' => $c['author'], 'at' => $c['created_at'], 'text' => $c['body']];
  }
  return $out;
}

function fetch_item($pdo, $id) {
  $st = $pdo->prepare('SELECT * FROM items WHERE id = ?');
  $st->execute([$id]);
  $row = $st->fetch(PDO::FETCH_ASSOC);
  if (!$row) return null;
  return item_row_to_json($row, comments_for($pdo, $id));
}

/* ---------- Routes ---------- */
$action = $_GET['action'] ?? '';
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET' && $action === 'list') {
  $rows = $pdo->query('SELECT * FROM items ORDER BY submittedAt DESC, rowid DESC')->fetchAll(PDO::FETCH_ASSOC);

  /* One query for all comments, grouped in PHP (avoids N+1). */
  $byItem = [];
  foreach ($pdo->query('SELECT item_id, author, created_at, body FROM comments ORDER BY id ASC')->fetchAll(PDO::FETCH_ASSOC) as $c) {
    $byItem[$c['item_id']][] = ['by' => $c['author'], 'at' => $c['created_at'], 'text' => $c['body']];
  }

  $items = [];
  foreach ($rows as $row) {
    $items[] = item_row_to_json($row, $byItem[$row['id']] ?? []);
  }
  echo json_encode(['ok' => true, 'items' => $items]);
  exit;
}

if ($method === 'POST' && $action === 'add') {
  $raw = file_get_contents('php://input');
  $body = json_decode($raw, true);
  if (!is_array($body)) bail(400, 'Body must be JSON');

  $type        = isset($body['type']) ? (string)$body['type'] : 'suggestion';
  $title       = isset($body['title']) ? trim((string)$body['title']) : '';
  $details     = isset($body['details']) ? clamp($body['details']) : '';
  $priority    = isset($body['priority']) ? (string)$body['priority'] : 'med';
  $page        = isset($body['page']) ? clamp($body['page'], 200) : '';
  $images      = isset($body['images']) ? clamp(trim((string)$body['images']), 500) : '';
  $submittedBy = isset($body['submittedBy']) ? trim((string)$body['submittedBy']) : '';

  if ($title === '')        bail(400, 'title is required');
  if ($submittedBy === '')  bail(400, 'submittedBy is required');
  if (!in_array($type, $VALID_TYPES))         bail(400, 'invalid type', ['valid' => $VALID_TYPES]);
  if (!in_array($priority, $VALID_PRIORITY))  bail(400, 'invalid priority', ['valid' => $VALID_PRIORITY]);
  if (mb_strlen($title) > 200) bail(400, 'title too long');

  $now  = gmdate('c');
  $stmp = gmdate('Y-m-d\TH-i-s\Z');
  $id   = 'fb-' . $stmp . '-' . slugify($submittedBy);
  /* The old JSON ids could collide on same-second submits; disambiguate. */
  $exists = $pdo->prepare('SELECT 1 FROM items WHERE id = ?');
  $exists->execute([$id]);
  if ($exists->fetchColumn()) $id .= '-' . substr(bin2hex(random_bytes(3)), 0, 6);

  $pdo->prepare('INSERT INTO items
    (id, type, title, details, priority, page, images, submittedBy, submittedAt, status, agentNotes, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, \'new\', \'\', ?)')
    ->execute([$id, $type, clamp($title, 200), $details, $priority, $page, $images, clamp($submittedBy, 80), $now, $now]);

  echo json_encode(['ok' => true, 'item' => fetch_item($pdo, $id)]);
  exit;
}

if ($method === 'POST' && $action === 'update') {
  $raw = file_get_contents('php://input');
  $body = json_decode($raw, true);
  if (!is_array($body)) bail(400, 'Body must be JSON');

  $id = isset($body['id']) ? (string)$body['id'] : '';
  if ($id === '') bail(400, 'id is required');

  $st = $pdo->prepare('SELECT * FROM items WHERE id = ?');
  $st->execute([$id]);
  $item = $st->fetch(PDO::FETCH_ASSOC);
  if (!$item) bail(404, 'item not found');

  $now = gmdate('c');
  $sets = [];
  $args = [];

  if (isset($body['status'])) {
    $s = (string)$body['status'];
    if (!in_array($s, $VALID_STATUS)) bail(400, 'invalid status', ['valid' => $VALID_STATUS]);
    $sets[] = 'status = ?'; $args[] = $s;
  }
  if (isset($body['priority'])) {
    $p = (string)$body['priority'];
    if (!in_array($p, $VALID_PRIORITY)) bail(400, 'invalid priority', ['valid' => $VALID_PRIORITY]);
    $sets[] = 'priority = ?'; $args[] = $p;
  }
  if (isset($body['agentNotes'])) {
    $sets[] = 'agentNotes = ?'; $args[] = clamp((string)$body['agentNotes'], 4000);
  }
  if (isset($body['title'])) {
    $t = trim((string)$body['title']);
    if ($t !== '') { $sets[] = 'title = ?'; $args[] = clamp($t, 200); }
  }
  if (isset($body['details'])) {
    $sets[] = 'details = ?'; $args[] = clamp((string)$body['details'], 4000);
  }
  if (isset($body['images'])) {
    $sets[] = 'images = ?'; $args[] = clamp(trim((string)$body['images']), 500);
  }

  if ($sets) {
    $sets[] = 'updatedAt = ?'; $args[] = $now;
    $args[] = $id;
    $pdo->prepare('UPDATE items SET ' . implode(', ', $sets) . ' WHERE id = ?')->execute($args);
  }

  if (isset($body['comment']) && is_string($body['comment']) && trim($body['comment']) !== '') {
    $pdo->prepare('INSERT INTO comments (item_id, author, created_at, body) VALUES (?, ?, ?, ?)')
        ->execute([$id, clamp((string)($body['commentBy'] ?? 'anon'), 80), $now, clamp((string)$body['comment'], 2000)]);
    $pdo->prepare('UPDATE items SET updatedAt = ? WHERE id = ?')->execute([$now, $id]);
  }

  echo json_encode(['ok' => true, 'item' => fetch_item($pdo, $id)]);
  exit;
}

if ($method === 'POST' && $action === 'delete') {
  $raw = file_get_contents('php://input');
  $body = json_decode($raw, true);
  if (!is_array($body)) bail(400, 'Body must be JSON');

  $id = isset($body['id']) ? (string)$body['id'] : '';
  if ($id === '') bail(400, 'id is required');

  $st = $pdo->prepare('DELETE FROM items WHERE id = ?');
  $st->execute([$id]);
  if ($st->rowCount() === 0) bail(404, 'item not found');

  echo json_encode(['ok' => true]);
  exit;
}

bail(400, 'Unknown action', ['validActions' => ['list', 'add', 'update', 'delete']]);
