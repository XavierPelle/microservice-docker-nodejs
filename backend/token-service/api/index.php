<?php
require_once __DIR__ . '/config/Database.php';
require_once __DIR__ . '/router/Router.php';
require_once __DIR__ . '/controller/TokenController.php';

$database = new Database();
$pdo = $database->getConnection();

$router = new Router();
$tokenController = new TokenController($pdo);

$router->addRoute('POST', '/add-token', [$tokenController, 'addToken']);
$router->addRoute('GET', '/get-token', [$tokenController, 'getTokens']);
$router->addRoute('POST', '/verify-token', [$tokenController, 'verifyToken']);

$router->handleRequest();
