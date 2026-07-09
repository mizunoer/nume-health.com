<?php
/**
 * Nume Health — Landing config save/load API
 *
 * Endpoints (all return JSON):
 *   GET  api/landing-config.php?action=list
 *        Returns the manifest of saved versions.
 *
 *   GET  api/landing-config.php?action=load&id=v-2026-05-22T123456Z-jane
 *        Returns one saved version's full config + metadata.
 *
 *   GET  api/landing-config.php?action=current
 *        Returns the most recent saved version, or {ok:true, version:null} if none.
 *
 *   POST api/landing-config.php?action=save
 *        Body: { "savedBy": "Jane Doe", "summary": "First draft", "config": { ... } }
 *        Side effects:
 *          - writes assets/configs/v-<timestamp>-<slug>.json (versioned snapshot)
 *          - rewrites assets/js/landing-config.js (live file the landing pages load)
 *          - appends to assets/configs/manifest.json
 *
 * Storage layout:
 *   assets/configs/manifest.json        — array of versions, newest first
 *   assets/configs/v-<id>.json          — one file per saved version
 *   assets/js/landing-config.js         — auto-generated live JS (same content)
 *
 * Auth:
 *   Open by default. To require a shared secret, set env var NUME_API_TOKEN
 *   on the server; clients must send it as ?token=... or X-Nume-Token header.
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
$ROOT          = realpath(__DIR__ . '/..');
$CONFIG_DIR    = $ROOT . DIRECTORY_SEPARATOR . 'assets' . DIRECTORY_SEPARATOR . 'configs';
$MANIFEST_FILE = $CONFIG_DIR . DIRECTORY_SEPARATOR . 'manifest.json';
$LIVE_JS_FILE  = $ROOT . DIRECTORY_SEPARATOR . 'assets' . DIRECTORY_SEPARATOR . 'js' . DIRECTORY_SEPARATOR . 'landing-config.js';

if (!is_dir($CONFIG_DIR)) { @mkdir($CONFIG_DIR, 0755, true); }
if (!file_exists($MANIFEST_FILE)) { file_put_contents($MANIFEST_FILE, "[]\n"); }

/* ---------- Helpers ---------- */
function bail($code, $msg, $extra = []) {
  http_response_code($code);
  echo json_encode(array_merge(['ok' => false, 'error' => $msg], $extra));
  exit;
}

function read_manifest($MANIFEST_FILE) {
  $raw = @file_get_contents($MANIFEST_FILE);
  $arr = json_decode($raw, true);
  return is_array($arr) ? $arr : [];
}

function write_manifest($MANIFEST_FILE, $arr) {
  file_put_contents($MANIFEST_FILE, json_encode($arr, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . "\n", LOCK_EX);
}

function slugify($s) {
  $s = strtolower(trim((string)$s));
  $s = preg_replace('/[^a-z0-9]+/', '-', $s);
  $s = trim($s, '-');
  if ($s === '') $s = 'anon';
  return substr($s, 0, 32);
}

function validate_id($id) {
  return is_string($id) && preg_match('/^v-[0-9TZ\-]+-[a-z0-9-]+$/', $id);
}

function safe_path($CONFIG_DIR, $id) {
  if (!validate_id($id)) return null;
  $path = realpath($CONFIG_DIR);
  $candidate = $CONFIG_DIR . DIRECTORY_SEPARATOR . $id . '.json';
  $real = realpath($candidate);
  if ($real === false || strpos($real, $path) !== 0) return null;
  return $real;
}

/* ---------- Routes ---------- */
$action = $_GET['action'] ?? '';
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET' && $action === 'list') {
  $manifest = read_manifest($MANIFEST_FILE);
  echo json_encode(['ok' => true, 'versions' => $manifest]);
  exit;
}

if ($method === 'GET' && $action === 'load') {
  $id = $_GET['id'] ?? '';
  $path = safe_path($CONFIG_DIR, $id);
  if (!$path || !is_file($path)) bail(404, 'Version not found');
  $payload = json_decode(file_get_contents($path), true);
  if (!$payload) bail(500, 'Stored version is corrupt');
  echo json_encode(['ok' => true, 'version' => $payload]);
  exit;
}

if ($method === 'GET' && $action === 'current') {
  $manifest = read_manifest($MANIFEST_FILE);
  if (empty($manifest)) {
    echo json_encode(['ok' => true, 'version' => null]);
    exit;
  }
  $latest = $manifest[0];
  $path = safe_path($CONFIG_DIR, $latest['id']);
  if (!$path || !is_file($path)) {
    echo json_encode(['ok' => true, 'version' => null]);
    exit;
  }
  $payload = json_decode(file_get_contents($path), true);
  echo json_encode(['ok' => true, 'version' => $payload]);
  exit;
}

if ($method === 'POST' && $action === 'save') {
  $raw = file_get_contents('php://input');
  $body = json_decode($raw, true);
  if (!is_array($body)) bail(400, 'Body must be JSON');

  $savedBy = isset($body['savedBy']) ? trim((string)$body['savedBy']) : '';
  $summary = isset($body['summary']) ? trim((string)$body['summary']) : '';
  $config  = isset($body['config']) ? $body['config'] : null;

  if ($savedBy === '') bail(400, 'savedBy is required');
  if (!is_array($config)) bail(400, 'config must be a JSON object');
  if (strlen($raw) > 1024 * 256) bail(413, 'Payload too large');

  $now = gmdate('Y-m-d\TH-i-s\Z');
  $slug = slugify($savedBy);
  $id = 'v-' . $now . '-' . $slug;

  $version = [
    'id'      => $id,
    'savedBy' => $savedBy,
    'savedAt' => gmdate('c'),
    'summary' => $summary,
    'config'  => $config,
  ];

  $versionPath = $CONFIG_DIR . DIRECTORY_SEPARATOR . $id . '.json';
  if (file_put_contents($versionPath, json_encode($version, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . "\n", LOCK_EX) === false) {
    bail(500, 'Failed to write version file');
  }

  $manifest = read_manifest($MANIFEST_FILE);
  array_unshift($manifest, [
    'id'      => $id,
    'savedBy' => $savedBy,
    'savedAt' => $version['savedAt'],
    'summary' => $summary,
  ]);
  /* keep the most recent 50 versions in the manifest */
  if (count($manifest) > 50) $manifest = array_slice($manifest, 0, 50);
  write_manifest($MANIFEST_FILE, $manifest);

  /* Rewrite the live JS the landing pages load. */
  $header  = "/**\n";
  $header .= " * Nume Health — Landing Page configuration (LIVE)\n";
  $header .= " * Generated " . $version['savedAt'] . " by " . addslashes($savedBy) . "\n";
  $header .= " * Source version: " . $id . "\n";
  $header .= " * To restore an older version, load it from Client_Onboarding.html and Save again.\n";
  $header .= " */\n";
  $jsBody  = $header . "window.NUME_CONFIG = " . json_encode($config, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . ";\n";
  if (file_put_contents($LIVE_JS_FILE, $jsBody, LOCK_EX) === false) {
    bail(500, 'Wrote version snapshot but failed to update live JS');
  }

  echo json_encode(['ok' => true, 'version' => $version]);
  exit;
}

bail(400, 'Unknown action', ['validActions' => ['list', 'load', 'current', 'save']]);
