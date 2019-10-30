<?php

define('DB_NAME', 'lumiacti_trs_test_database'); // DATABASE
define('DB_USER', 'lumiacti_trs'); // ROOT DEFAULT MYSQL
define('DB_PASSWORD', 'Trs@2019');  // PASSWORD
define('DB_HOST', 'localhost'); // LOCAL IF YOU USE LOCAL.

$mysqli = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);

?>