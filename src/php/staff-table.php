<?php
header('HTTP/1.1 200 OK');
header('Access-Control-Allow-Origin: *');
session_start();
//Dependências
include('./functions/staffFunctions.php');

if(isset($_GET['Action']) && $_GET['Action'] == 'table'){
    if(isset($_GET['Status'])){
        ($_GET['Status'] === 'All') && $status = "WHERE";
        ($_GET['Status'] === 'Active') && $status = "WHERE staff.status LIKE 'A' AND";
        ($_GET['Status'] === 'Inactive') && $status = "WHERE staff.status LIKE 'I' AND";
    }

    $row = Staff::SelectAll($_GET['Limit'], $_GET['Offset'], $status);
    $count = Staff::Count($status);
    if ($row) {
        foreach ($row as $value) {
            $r[] = [
                'id' => $value['id'],
                'fullname' => $value['fullname'],
                'email' => $value['email'],
                'cpf' => $value['cpf'],
                'role' => $value['role'],
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
        ($_GET['Status'] === 'Active') && $status = "WHERE staff.status LIKE 'A' AND";
        ($_GET['Status'] === 'Inactive') && $status = "WHERE staff.status LIKE 'I' AND";
    }

    $filter = $_GET['filter'];
    !$filter && $filter = 'Fullname';

    ($filter == 'Fullname' || $filter == 'Role') && $search = trim(ucfirst(mb_convert_case($_GET['search'], MB_CASE_TITLE, 'UTF-8')));
    $filter == 'Email' && $search = trim($_GET['search']);
    $filter == 'CPF' && $search = trim(preg_replace("/[^0-9]/", '', $_GET['search']));

    $row = Staff::SelectAllParam("$status $filter LIKE '%$search%'");
    if ($row) {
        foreach ($row as $value) {
            $r[] = [
                'id' => $value['id'],
                'fullname' => $value['fullname'],
                'email' => $value['email'],
                'cpf' => $value['cpf'],
                'role' => $value['role'],
                'status' => $value['status'],
            ];
        }
    } else {
        $r['success'] = 0;
    }
}

echo json_encode($r);
