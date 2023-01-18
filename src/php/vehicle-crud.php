<?php
header('HTTP/1.1 200 OK');
header('Access-Control-Allow-Origin: *');
session_start();
//Dependências
include("./functions/vehicleFunctions.php");
include('./functions/logFunctions.php');
include('./functions/userFunctions.php');

if(isset($_POST['FormData'])){
    $plate = preg_replace("/[^A-Za-z0-9^]/","",$_POST['FormData']['Plate']);
    $model = ucfirst(mb_convert_case($_POST['FormData']['Model'], MB_CASE_TITLE, 'UTF-8'));
    $color = ucfirst(mb_convert_case($_POST['FormData']['Color'], MB_CASE_TITLE, 'UTF-8'));
    $type = ucfirst(mb_convert_case($_POST['FormData']['Type'], MB_CASE_TITLE, 'UTF-8'));
}

//Criar um novo veículo.
if(isset($_POST['Action']) && $_POST['Action'] == "create"){
    $row = Vehicle::SelectParam("WHERE plate = '$plate'");
    if($row){
        $r['found'] = true; 
        $r['success'] = 0;
    } else {
        $row = Vehicle::Create($plate, $model, $color, $type);
        $id = $row['id'];
        Log::Create("create", "vehicles", null, $id, $_POST['UserID']);

        $r['id'] = $id;
        $r['success'] = 1;
    }
} 
//Atualizar um veículo.
else if(isset($_POST['Action']) && $_POST['Action'] == "edit"){
    $row = Vehicle::SelectParam("WHERE plate = '$plate'");
    $id = $_POST['FormData']['id'];
    if($row && ($id != $row['id'])){
        $r['found'] = true;
        $r['success'] = 0;
    } else {
        $row = Vehicle::Update($plate, $model, $color, $type, $id);
        Log::Create("update", "vehicles", null, $id, $_POST['UserID']);

        $r['success'] = 1;
    }
} 
//Vincular/desvincular um veículo de um cliente (SWITCH).
else if(isset($_POST['Action']) && $_POST['Action'] == 'link-update'){
    $idvehicle = $_POST['idvehicle'];
    $select = Vehicle::SelectParam("WHERE id = $idvehicle");

    if(isset($_POST['idcustomer']) && $_POST['idcustomer'] != null){
        $row = Vehicle::Unlink($idvehicle);
        Log::Create("unlink", "vehicles", null, $idvehicle, $_POST['UserID']);

        $r['unlink'] = 1;
        $r['plate'] = $select['plate'];
        $r['success'] = 1;
    } else {
        $idcurrent = $_POST['idcurrent'];
        $row = Vehicle::Link($idcurrent, $idvehicle);
        Log::Create("link", "vehicles", null, $idvehicle, $_POST['UserID']);

        $r['link'] = 1;
        $r['plate'] = $select['plate'];
        $r['success'] = 1;
    }
} 
//Desvincular um veículo.
else if(isset($_POST['Action']) && $_POST['Action'] == 'link-unlink'){
    $idvehicle = $_POST['idvehicle'];

    $select = Vehicle::SelectParam("WHERE id = $idvehicle");

    $row = Vehicle::Unlink($idvehicle);
    Log::Create("unlink", "vehicles", null, $idvehicle, $_POST['UserID']);

    $r['success'] = 1;
} 
//Atualizar o status de um veículo.
else if (isset($_POST['Action']) && $_POST['Action'] == "status") { 
    $id = $_POST['id'];

    $status = ($_POST['status'] == 'A') ? 'I' : 'A'; 

    $row = Vehicle::Status($status, $id);
    Log::Create(($status == 'A' ? "activate" : "inactivate"), "vehicles", null, $id, $_POST['UserID']);
    
    $r['success'] = 1;    
} 
//Excluír um cliente.
else if(isset($_POST['Action']) && $_POST['Action'] == 'delete'){
    $id = intval($_POST['id']);

    Vehicle::Delete($id);
    Log::Create("delete", "vehicles", null, $id, $_POST['UserID']); 

    $r['success'] = 1;
} 
//Caso nenhuma das ações tenha recebido trigger.
else { 
    $r['success'] = 0;
}

echo json_encode($r);