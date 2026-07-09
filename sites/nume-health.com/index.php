<?php
// Fallback: serve the static homepage when server defaults to index.php
header('Content-Type: text/html; charset=utf-8');
readfile(__DIR__ . '/index.html');
