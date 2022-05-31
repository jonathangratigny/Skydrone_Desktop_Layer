<?php

require '../vendor/autoload.php';

session_start();



use Router\Router;

define('VIEWS', dirname(__DIR__) . DIRECTORY_SEPARATOR . 'views' . DIRECTORY_SEPARATOR);
define('SCRIPT', dirname($_SERVER['SCRIPT_NAME']) . DIRECTORY_SEPARATOR);

$router = new Router($_GET['url']);
if (isset($_SESSION['user'])) {
    $router->get('/', 'App\Controllers\HomeController@index');
} else {
    $router->get('/', 'App\Controllers\HomeController@indexNoLogin');
}
$router->get('/products', 'App\Controllers\ProductController@index');
$router->get('/product/:id', 'App\Controllers\ProductController@show');
$router->get('/product/:id/orders', 'App\Controllers\ProductController@showOrders');
$router->get('/product/:id/cover', 'App\Controllers\ProductController@showCover');
$router->get('/login', 'App\Controllers\AuthController@login');

$router->post('/logout', 'App\Controllers\AuthController@logout');

$router->post('/login', 'App\Controllers\AuthController@loginAuth');



$router->run();

