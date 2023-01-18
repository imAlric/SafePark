<?php
header('HTTP/1.1 200 OK');
header('Access-Control-Allow-Origin: *');
session_start();
//Dependências.
include('./functions/customerFunctions.php');
include('./functions/companyFunctions.php');
include('./functions/movementFunctions.php');

if(isset($_GET['Action']) && $_GET['Action'] == 'table'){
    if(isset($_GET['Status'])){
        ($_GET['Status'] === 'All') && $status = "WHERE";
        ($_GET['Status'] === 'Active') && $status = "WHERE status LIKE 'A' AND";
        ($_GET['Status'] === 'Inactive') && $status = "WHERE status LIKE 'I' AND";
        ($_GET['Status'] === 'Linked') && $status = "WHERE idcompany IS NOT NULL AND status LIKE 'A' AND";
        ($_GET['Status'] === 'Unlinked') && $status = "WHERE idcompany IS NULL AND status LIKE 'A' AND";
    }

    $row = Customer::SelectAll($_GET['Limit'], $_GET['Offset'], $status);
    $count = Customer::Count($status);
    if ($row) {
        foreach ($row as $value) {
            if($value['idcompany'] != null){
                $id = $value['idcompany'];
                $company = Company::SelectParam($param = "WHERE id = $id");
            }

            $idbilling = $value['idbilling'];
            $billing = $idbilling ? Billing::SelectParam("WHERE id = $idbilling") : null;

            $r[] = [
                'id' => $value['id'],
                'fullname' => $value['fullname'],
                'cpf' => $value['cpf'],
                'phone' => $value['phone'],
                'company' => $value['idcompany'] != null ? $company['fullname'] : null,
                'idbilling' => $value['idbilling'],
                'billingval' => $value['idbilling'] ? $billing['validity'] : null,
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
        ($_GET['Status'] === 'Linked') && $status = "WHERE idcompany IS NOT NULL AND status LIKE 'A' AND";
        ($_GET['Status'] === 'Unlinked') && $status = "WHERE idcompany IS NULL AND status LIKE 'A' AND";
    }

    $filter = $_GET['filter'];
    !$filter && $filter = 'Fullname';

    $search = trim(ucfirst(mb_convert_case($_GET['search'], MB_CASE_TITLE, 'UTF-8')));
    $filter !== 'Fullname' && $search = preg_replace("/[^0-9]/", '', $search);

    $row = Customer::SelectAllParam("$status $filter LIKE '%$search%'");
    if ($row) {
        foreach ($row as $value) {
            if($value['idcompany'] != null){
                $id = $value['idcompany'];
                $company = Company::SelectParam("WHERE id = $id");
            }
            $idbilling = $value['idbilling'];
            $billing = $idbilling ? Billing::SelectParam("WHERE id = $idbilling") : null;

            $r[] = [
                'id' => $value['id'],
                'fullname' => $value['fullname'],
                'cpf' => $value['cpf'],
                'phone' => $value['phone'],
                'company' => $value['idcompany'] != null ? $company['fullname'] : null,
                'idbilling' => $value['idbilling'],
                'billingval' => $value['idbilling'] ? $billing['validity'] : null,
                'status' => $value['status'],
                'count' => $count,
            ];
        }
    } else {
        $r['success'] = 0;
    }
}

if(isset($_GET['Action']) && $_GET['Action'] == 'link-search'){
    $cpf = preg_replace("/[^0-9]/", '', $_GET['CPF']);
    $id = intval($_GET['id']);
    $row = Customer::SelectParam("WHERE cpf = '$cpf' AND (idcompany IS NULL OR idcompany = $id)");
    if($row){
        $r = [
            'id' => $row['id'],
            'fullname' => $row['fullname'],
            'cpf' => $row['cpf'],
            'phone' => $row['phone'],
            'idcompany' => $row['idcompany'],
        ];
    } else {
        $r['success'] = 0;
    }
}

if(isset($_GET['Action'])&& $_GET['Action'] == 'link-table'){
    $id = intval($_GET['id']);
    $row = Customer::SelectAllParam("WHERE idcompany = $id");
    if($row){
        foreach ($row as $value){
            $r[] = [
                'id' => $value['id'],
                'fullname' => $value['fullname'],
                'cpf' => $value['cpf'],
                'phone' => $value['phone'],
                'idcompany' => $value['idcompany'],
            ];
        }
    } else {
        $r['success'] = 0;
    }
}

echo json_encode($r);
