<?php
header('HTTP/1.1 200 OK');
header('Access-Control-Allow-Origin: *');
session_start();
date_default_timezone_set('America/Sao_Paulo');
//Dependências.
include('./functions/companyFunctions.php');
include('./functions/movementFunctions.php');

if(isset($_GET['Action']) && $_GET['Action'] == 'table'){
    if(isset($_GET['Status'])){
        ($_GET['Status'] === 'All') && $status = "WHERE";
        ($_GET['Status'] === 'Active') && $status = "WHERE status LIKE 'A' AND";
        ($_GET['Status'] === 'Inactive') && $status = "WHERE status LIKE 'I' AND";
    }

    $row = Company::SelectAll($_GET['Limit'], $_GET['Offset'], $status);
    $count = Company::Count($status);
    if ($row) {
        foreach ($row as $value) {
            $idbilling = $value['idbilling'];
            $billing = Billing::SelectParam("WHERE id = $idbilling");

            $r[] = [
                'id' => $value['id'],
                'fullname' => $value['fullname'],
                'cnpj' => $value['cnpj'],
                'email' => $value['email'],
                'phone' => $value['phone'],
                'idbilling' => $value['idbilling'],
                'billingval' => $billing['validity'],
                'status' => $value['status'],
                'count' => $count,
            ];
        }
    } else {
        $r['success'] = 0;
    }
}
if(isset($_GET['Action']) && $_GET['Action'] == 'search'){
    if(isset($_GET['Status'])){
        ($_GET['Status'] === 'All') && $status = "WHERE";
        ($_GET['Status'] === 'Active') && $status = "WHERE status LIKE 'A' AND";
        ($_GET['Status'] === 'Inactive') && $status = "WHERE status LIKE 'I' AND";
    }

    $filter = $_GET['filter'];
    !$filter && $filter = 'Fullname';

    ($filter == 'Fullname' || $filter == 'Role') && $search = trim(ucfirst(mb_convert_case($_GET['search'], MB_CASE_TITLE, 'UTF-8')));
    $filter == 'Email' && $search = trim($_GET['search']);
    $filter == 'CNPJ' && $search = trim(preg_replace("/[^0-9]/", '', $_GET['search']));
    $filter == 'Phone' && $search = trim(preg_replace("/[^0-9]/", '', $_GET['search']));

    $row = Company::SelectAllParam("$status $filter LIKE '%$search%'");
    if ($row) {
        foreach ($row as $value) {
            $idbilling = $value['idbilling'];
            $billing = Billing::SelectParam("WHERE id = $idbilling");

            $r[] = [
                'id' => $value['id'],
                'fullname' => $value['fullname'],
                'cnpj' => $value['cnpj'],
                'email' => $value['email'],
                'phone' => $value['phone'],
                'idbilling' => $value['idbilling'],
                'billingval' => $billing['validity'],
                'status' => $value['status'],
            ];
        }
    } else {
        $r['success'] = 0;
    }
}

echo json_encode($r);
