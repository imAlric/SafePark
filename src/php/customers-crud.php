<?php
header('HTTP/1.1 200 OK');
header('Access-Control-Allow-Origin: *');
session_start();
date_default_timezone_set('America/Sao_Paulo');
//Dependências.
include('./functions/vehicleFunctions.php');
include('./functions/customerFunctions.php');
include('./functions/logFunctions.php');
include('./functions/movementFunctions.php');
include('./functions/userFunctions.php');
include('./functions/genericFunctions.php');

if(isset($_POST['FormData']) && $_POST['Action'] !== 'billing'){
    $fullname = ucfirst(mb_convert_case($_POST['FormData']['Fullname'], MB_CASE_TITLE, 'UTF-8'));
    $cpf = preg_replace("/[^0-9^]/", "", $_POST['FormData']['CPF']);
    $phone = preg_replace("/[^0-9^]/", "", $_POST['FormData']['Phone']);
}

//Criar um cliente.
if (isset($_POST['Action']) && $_POST['Action'] == "create") {
    $row = Customer::SelectParam("WHERE cpf = '$cpf'");
    if ($row) {
        $r['found'] = true;
        $r['success'] = 0;
    } else {
        $row = Billing::Create(120.00, null, null, null, date('Y-m-d H:i:s'));
        $row = Customer::Create($fullname, $cpf, $phone, $row['id']);
        $id = $row['id'];
        Log::Create("create", "customers", null, $id, $_POST['UserID']);

        $r['id'] = $id;
        $r['success'] = 1;
    }
} 
//Atualizar um cliente.
else if (isset($_POST['Action']) && $_POST['Action'] == "edit") {
    $row = Customer::SelectParam("WHERE cpf = '$cpf'");
    $id = intval($_POST['FormData']['id']);
    if ($row && ($id != $row['id'])) {
        $r['found'] = true;
        $r['success'] = 0;
    } else {
        $row = Customer::Update($fullname, $cpf, $phone, $id);
        Log::Create("update", "customers", null, $id, $_POST['UserID']);
        $r['success'] = 1;
    }
}//Vincular/desvincular um cliente de uma empresa (SWITCH).
else if(isset($_POST['Action']) && $_POST['Action'] == 'link-update'){
    $idcustomer = $_POST['idcustomer'];
    $select = Customer::SelectParam("WHERE id = $idcustomer");

    if(isset($_POST['idcompany']) && $_POST['idcompany'] != null){
        $row = Customer::Unlink($idcustomer);

        Log::Create("unlink", "customers", null, $idcustomer, $_POST['UserID']);

        $r['unlink'] = 1;
        $r['cpf'] = $select['cpf'];
        $r['success'] = 1;
    } else {
        $idcurrent = $_POST['idcurrent'];

        $row = Customer::Link($idcurrent, $idcustomer);

        Log::Create("link", "customers", null, $idcustomer, $_POST['UserID']);

        $r['link'] = 1;
        $r['cpf'] = $select['cpf'];
        $r['success'] = 1;
    }
} 
//Desvincular um cliente.
else if(isset($_POST['Action']) && $_POST['Action'] == 'link-unlink'){
    $idcustomer = $_POST['idcustomer'];

    $row = Customer::Unlink($idcustomer);
    Log::Create("unlink", "customers", null, $idcustomer, $_POST['UserID']);

    $r['success'] = 1;
} 
//Atualizar o status de um cliente.
else if (isset($_POST['Action']) && $_POST['Action'] == "status") { 
    $id = $_POST['id'];

    $status = ($_POST['status'] == 'A') ? 'I' : 'A';

    $row = Customer::Status($status, $id);
    Log::Create(($status == 'A' ? "activate" : "inactivate"), "customers", null, $id, $_POST['UserID']);
    
    $r['success'] = 1;
} 
//Excluír um cliente.
else if(isset($_POST['Action']) && $_POST['Action'] == 'delete'){
    $id = intval($_POST['id']);

    Customer::Delete($id);
    Customer::Unlink($id);
    $row = Vehicle::SelectParam("WHERE idcustomer = $id");
    $row && Vehicle::Unlink($row['id']);
    Log::Create("delete", "customers", null, $id, $_POST['UserID']); 

    $r['success'] = 1;
}
//Pagar mensalidade de um cliente.
else if(isset($_POST['Action']) && $_POST['Action'] == 'billing'){
    $id = intval($_POST['id']);
    $idbilling = intval($_POST['idbilling']);

    $total = floatval($_POST['FormData']['Total']);
    $amount = (isset($_POST['FormData']['Amount']) && $_POST['FormData']['Amount'] !== '') ? floatval($_POST['FormData']['Amount']) : floatval($_POST['FormData']['Total']);
    $change = (isset($_POST['FormData']['Change']) && $_POST['FormData']['Change'] !== '') ? floatval($_POST['FormData']['Change']) : null;
    $method = $_POST['FormData']['Method'];

    Billing::Update($total, $amount, $change, $method, $idbilling);
    Billing::Finish($idbilling);
    $cycle = Time::Cycle(date('Y-m-d'), 1)." 00:00:00";
    $row = Billing::Create(120.00, null, null, null, $cycle);
    Customer::BillingSet($row['id'], $id);
    Log::Create("pending", "monthly", null, $row['id'], intval($_POST['UserID']));
    Log::Create("finished", "monthly", null, $idbilling, intval($_POST['UserID'])); 

    $r['success'] = 1;
} 
//Caso nenhuma das ações tenha recebido trigger.
else { 
    $r['success'] = 0;
}

echo json_encode($r);
