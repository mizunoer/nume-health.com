<?php
/**
 * Nume Health — Client feedback / suggestion API
 *
 * Endpoints (JSON in/out):
 *   GET  api/feedback.php?action=list
 *        Returns the full feedback store: { items: [...] }
 *
 *   POST api/feedback.php?action=add
 *        Body: { type, title, details, priority, page, submittedBy }
 *        Creates a new item and returns it.
 *
 *   POST api/feedback.php?action=update
 *        Body: { id, status?, agentNotes?, comment?, commentBy? }
 *        Patches the item (any subset of fields). If `comment` is set,
 *        appends to its comments array.
 *
 *   POST api/feedback.php?action=delete
 *        Body: { id }
 *        Removes the item.
 *
 * Storage:
 *   assets/configs/feedback.json — single flat JSON file.
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

/* ---------- Paths ---------- */
$ROOT       = realpath(__DIR__ . '/..');
$CONFIG_DIR = $ROOT . DIRECTORY_SEPARATOR . 'assets' . DIRECTORY_SEPARATOR . 'configs';
$STORE_FILE = $CONFIG_DIR . DIRECTORY_SEPARATOR . 'feedback.json';

if (!is_dir($CONFIG_DIR)) { @mkdir($CONFIG_DIR, 0755, true); }
if (!file_exists($STORE_FILE)) {
  file_put_contents($STORE_FILE, json_encode(['items' => []], JSON_PRETTY_PRINT) . "\n");
}

/* ---------- Helpers ---------- */
function bail($code, $msg, $extra = []) {
  http_response_code($code);
  echo json_encode(array_merge(['ok' => false, 'error' => $msg], $extra));
  exit;
}

function read_store($path) {
  $raw = @file_get_contents($path);
  $data = json_decode($raw, true);
  if (!is_array($data) || !isset($data['items']) || !is_array($data['items'])) {
    return ['items' => []];
  }
  return $data;
}

function write_store($path, $data) {
  /* Atomic-ish write: lock, rewrite. */
  file_put_contents($path, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . "\n", LOCK_EX);
}

function slugify($s) {
  $s = strtolower(trim((string)$s));
  $s = preg_replace('/[^a-z0-9]+/', '-', $s);
  $s = trim($s, '-');
  if ($s === '') $s = 'anon';
  return substr($s, 0, 32);
}

/* Allowed enum values — anything else is rejected. */
$VALID_TYPES    = ['suggestion', 'bug', 'copy-edit', 'dev-task-update', 'feature', 'question'];
$VALID_PRIORITY = ['low', 'med', 'high'];
$VALID_STATUS   = ['new', 'in-review', 'in-progress', 'done', 'wont-do'];

function clamp($s, $max = 4000) {
  $s = (string)$s;
  if (mb_strlen($s) > $max) $s = mb_substr($s, 0, $max);
  return $s;
}

/* ---------- Routes ---------- */
$action = $_GET['action'] ?? '';
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET' && $action === 'list') {
  $store = read_store($STORE_FILE);
  echo json_encode(['ok' => true, 'items' => $store['items']]);
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
  $submittedBy = isset($body['submittedBy']) ? trim((string)$body['submittedBy']) : '';

  if ($title === '')        bail(400, 'title is required');
  if ($submittedBy === '')  bail(400, 'submittedBy is required');
  if (!in_array($type, $VALID_TYPES))         bail(400, 'invalid type', ['valid' => $VALID_TYPES]);
  if (!in_array($priority, $VALID_PRIORITY))  bail(400, 'invalid priority', ['valid' => $VALID_PRIORITY]);
  if (mb_strlen($title) > 200) bail(400, 'title too long');

  $now  = gmdate('c');
  $stmp = gmdate('Y-m-d\TH-i-s\Z');
  $id   = 'fb-' . $stmp . '-' . slugify($submittedBy);

  $item = [
    'id'          => $id,
    'type'        => $type,
    'title'       => clamp($title, 200),
    'details'     => $details,
    'priority'    => $priority,
    'page'        => $page,
    'submittedBy' => clamp($submittedBy, 80),
    'submittedAt' => $now,
    'status'      => 'new',
    'agentNotes'  => '',
    'comments'    => [],
    'updatedAt'   => $now,
  ];

  $store = read_store($STORE_FILE);
  array_unshift($store['items'], $item);
  write_store($STORE_FILE, $store);

  echo json_encode(['ok' => true, 'item' => $item]);
  exit;
}

if ($method === 'POST' && $action === 'update') {
  $raw = file_get_contents('php://input');
  $body = json_decode($raw, true);
  if (!is_array($body)) bail(400, 'Body must be JSON');

  $id = isset($body['id']) ? (string)$body['id'] : '';
  if ($id === '') bail(400, 'id is required');

  $store = read_store($STORE_FILE);
  $idx = -1;
  foreach ($store['items'] as $i => $it) {
    if (($it['id'] ?? '') === $id) { $idx = $i; break; }
  }
  if ($idx < 0) bail(404, 'item not found');

  $item = $store['items'][$idx];
  $now  = gmdate('c');

  if (isset($body['status'])) {
    $s = (string)$body['status'];
    if (!in_array($s, $VALID_STATUS)) bail(400, 'invalid status', ['valid' => $VALID_STATUS]);
    $item['status'] = $s;
  }
  if (isset($body['priority'])) {
    $p = (string)$body['priority'];
    if (!in_array($p, $VALID_PRIORITY)) bail(400, 'invalid priority', ['valid' => $VALID_PRIORITY]);
    $item['priority'] = $p;
  }
  if (isset($body['agentNotes'])) {
    $item['agentNotes'] = clamp((string)$body['agentNotes'], 4000);
  }
  if (isset($body['title'])) {
    $t = trim((string)$body['title']);
    if ($t !== '') $item['title'] = clamp($t, 200);
  }
  if (isset($body['details'])) {
    $item['details'] = clamp((string)$body['details'], 4000);
  }
  if (isset($body['comment']) && is_string($body['comment']) && trim($body['comment']) !== '') {
    if (!isset($item['comments']) || !is_array($item['comments'])) $item['comments'] = [];
    $item['comments'][] = [
      'by'   => clamp((string)($body['commentBy'] ?? 'anon'), 80),
      'at'   => $now,
      'text' => clamp((string)$body['comment'], 2000),
    ];
  }
  $item['updatedAt'] = $now;

  $store['items'][$idx] = $item;
  write_store($STORE_FILE, $store);

  echo json_encode(['ok' => true, 'item' => $item]);
  exit;
}

if ($method === 'POST' && $action === 'delete') {
  $raw = file_get_contents('php://input');
  $body = json_decode($raw, true);
  if (!is_array($body)) bail(400, 'Body must be JSON');

  $id = isset($body['id']) ? (string)$body['id'] : '';
  if ($id === '') bail(400, 'id is required');

  $store = read_store($STORE_FILE);
  $count0 = count($store['items']);
  $store['items'] = array_values(array_filter($store['items'], function ($it) use ($id) {
    return ($it['id'] ?? '') !== $id;
  }));

  if (count($store['items']) === $count0) bail(404, 'item not found');
  write_store($STORE_FILE, $store);

  echo json_encode(['ok' => true]);
  exit;
}

bail(400, 'Unknown action', ['validActions' => ['list', 'add', 'update', 'delete']]);
