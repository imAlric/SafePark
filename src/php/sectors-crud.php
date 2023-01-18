<?php
header('HTTP/1.1 200 OK');
header('Access-Control-Allow-Origin: *');
session_start();
//Dependências
include('./functions/sectorsFunctions.php');
include('./functions/logFunctions.php');
include('./functions/userFunctions.php');

if (isset($_POST['FormData'])){
    $name = $_POST['FormData']['Name'];
    $category = $_POST['FormData']['Category'];
    $quantity = intval($_POST['FormData']['Quantity']);
}

//Cria um novo setor.
if (isset($_POST['Action']) && $_POST['Action'] == "create") {
    $row = Sector::Select($name);
    if($row){
        $r['found'] = true;
        $r['success'] = 0;
    } else {
        $row = Sector::Create($name, $category, $quantity);
        $id = $row['id'];
        Log::Create("create", "sectors", null, $id, $_POST['UserID']);

        $r['success'] = 1;
    }
} 
//Caso nenhuma das ações tenha recebido trigger.
else {
    $r['success'] = 0;
}

echo json_encode($r);