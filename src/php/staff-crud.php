<?php
header('HTTP/1.1 200 OK');
header('Access-Control-Allow-Origin: *');
session_start();
//Dependências
include('./functions/staffFunctions.php');
include('./functions/logFunctions.php');
include('./functions/userFunctions.php');

if(isset($_POST['FormData'])){
    $fullname = ucfirst(mb_convert_case($_POST['FormData']['Fullname'], MB_CASE_TITLE, 'UTF-8'));
    $cpf = preg_replace("/[^0-9^]/", "", $_POST['FormData']['CPF']);
    $role = ucfirst(mb_convert_case($_POST['FormData']['Role'], MB_CASE_TITLE, 'UTF-8'));
    $email = ($role !== 'Manobrista') ? $_POST['FormData']['Email'] : null;
    $password = ($role !== 'Manobrista') ? $_POST['FormData']['Password'] : null;
}

//Criar um novo funcionário.
if (isset($_POST['Action']) && $_POST['Action'] == "create") {
    $row = Staff::SelectParam("WHERE cpf = '$cpf'");
    if ($row) {
        $r['found'] = true;
        $r['success'] = 0;
    } else {
        $row = Staff::Create($email, $password, $fullname, $cpf, $role);
        $id = $row['id'];
        Log::Create("create", "staff", null, $id, $_POST['UserID']);

        $r['success'] = 1;
    }
} 
//Atualizar um funcionário.
else if (isset($_POST['Action']) && $_POST['Action'] == "edit") {
    $row = Staff::SelectParam("WHERE cpf = '$cpf'");
    $id = $_POST['FormData']['id'];
    if ($row && ($id != $row['id'])) {
        $r['found'] = true;
        $r['success'] = 0;
    } else {
        $row = Staff::Update($email, $password, $fullname, $cpf, $role, $id);
        Log::Create("update", "staff", null, $id, $_POST['UserID']);

        $r['success'] = 1;
    }
} 
//Atualizar o status de um funcionário.
else if (isset($_POST['Action']) && $_POST['Action'] == "status") { 
    $id = $_POST['id'];

    $status = ($_POST['status'] == 'A') ? 'I' : 'A'; 

    $row = Staff::Status($status, $id);
    Log::Create(($status == 'A' ? "activate" : "inactivate"), "staff", null, $id, $_POST['UserID']);

    $r['success'] = 1; 
}
//Excluír um funcionário.
else if(isset($_POST['Action']) && $_POST['Action'] == 'delete'){
    $id = intval($_POST['id']);

    Staff::Delete($id);
    Log::Create("delete", "staff", null, $id, $_POST['UserID']); 

    $r['success'] = 1;
} 
//Caso nenhuma das ações tenha recebido trigger.
else { 
    $r['success'] = 0;
}

echo json_encode($r);
