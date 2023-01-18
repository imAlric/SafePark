<?php
header('HTTP/1.1 200 OK');
header('Access-Control-Allow-Origin: *');
session_start();
date_default_timezone_set('America/Sao_Paulo');
//Dependências.
include('./functions/companyFunctions.php');
include('./functions/logFunctions.php');
include('./functions/movementFunctions.php');
include('./functions/userFunctions.php');
include('./functions/genericFunctions.php');

if(isset($_POST['FormData']) && $_POST['Action'] !== 'billing'){
    $fullname = ucfirst(mb_convert_case($_POST['FormData']['Fullname'], MB_CASE_TITLE, 'UTF-8'));
    $cnpj = preg_replace("/[^0-9^]/", "", $_POST['FormData']['CNPJ']);
    $email = $_POST['FormData']['Email'];
    $phone = preg_replace("/[^0-9^]/", "", $_POST['FormData']['Phone']);
}

//Criar uma nova empresa.
if (isset($_POST['Action']) && $_POST['Action'] == "create") {
    $row = Company::SelectParam("WHERE cnpj = '$cnpj'");
    if ($row) {
        $r['found'] = true;
        $r['success'] = 0;
    } else {
        $row = Billing::Create(120.00, null, null, null, date('Y-m-d H:i:s'));
        $row = Company::Create($fullname, $cnpj, $email, $phone, $row['id']);
        $id = $row['id'];
        Log::Create("create", "companies", null, $id, $_POST['UserID']);

        $r['id'] = $id;
        $r['success'] = 1;
    }
} 
//Atualizar uma empresa.
else if (isset($_POST['Action']) && $_POST['Action'] == "edit") {
    $row = Company::SelectParam("WHERE cnpj = '$cnpj'");
    $id = $_POST['FormData']['id'];
    if ($row && ($id != $row['id'])) {
        $r['found'] = true;
        $r['success'] = 0;
    } else {
        $row = Company::Update($fullname, $cnpj, $email, $phone, $id);
        Log::Create("update", "companies", null, $id, $_POST['UserID']);

        $r['success'] = 1;
    }
} 
//Atualizar o status de uma empresa.
else if (isset($_POST['Action']) && $_POST['Action'] == "status") { 
    $id = $_POST['id'];

    $status = ($_POST['status'] == 'A') ? 'I' : 'A';

    $row = Company::Status($status, $id);
    Log::Create(($status == 'A' ? "activate" : "inactivate"), "companies", null, $id, $_POST['UserID']);
    
    $r['success'] = 1;    
}
//Excluír uma empresa.
else if(isset($_POST['Action']) && $_POST['Action'] == 'delete'){
    $id = intval($_POST['id']);

    Company::Delete($id);
    Log::Create("delete", "companies", null, $id, $_POST['UserID']); 

    $r['success'] = 1;
}
//Pagar mensalidade de uma empresa.
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
    Company::BillingSet($row['id'], $id);
    Log::Create("pending", "monthly", null, $row['id'], intval($_POST['UserID'])); 
    Log::Create("finished", "monthly", null, $idbilling, intval($_POST['UserID'])); 

    $r['success'] = 1;
} 
//Caso nenhuma das ações tenha recebido trigger.
else { 
    $r['success'] = 0;
}
echo json_encode($r);
