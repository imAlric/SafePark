<?php
header('HTTP/1.1 200 OK');
header('Access-Control-Allow-Origin: *');
session_start();
//Dependências
include('./functions/vehicleFunctions.php');
include("../php/functions/customerFunctions.php");
include("../php/functions/companyFunctions.php");
include("../php/functions/movementFunctions.php");

if(isset($_GET['Action']) && $_GET['Action'] == 'table'){
    if(isset($_GET['Status'])){
        ($_GET['Status'] === 'All') && $status = "WHERE";
        ($_GET['Status'] === 'Active') && $status = "WHERE status LIKE 'A' AND";
        ($_GET['Status'] === 'Inactive') && $status = "WHERE status LIKE 'I' AND";
        ($_GET['Status'] === 'Linked') && $status = "WHERE idcustomer IS NOT NULL AND status LIKE 'A' AND";
        ($_GET['Status'] === 'Unlinked') && $status = "WHERE idcustomer IS NULL AND status LIKE 'A' AND";
    }

    $row = Vehicle::SelectAll($_GET['Limit'], $_GET['Offset'], $status);
    $count = Vehicle::Count($status);
    if ($row) {
        foreach ($row as $value) {
            if($value['idcustomer'] != null){
                $id = $value['idcustomer'];
                $customer = Customer::SelectParam("WHERE id = $id");
                $idcompany = $customer['idcompany'];
                $idcompany != null && $company = Company::SelectParam("WHERE id = $idcompany");
            }
            $r[] = [
                'id' => $value['id'],
                'plate' => $value['plate'],
                'model' => $value['model'],
                'color' => $value['color'],
                'type' => $value['type'],
                'customer' => $value['idcustomer'] != null ? $customer['fullname'] : null,
                'company' => (isset($customer) && $customer['idcompany'] != null) ? $company['fullname'] : null,
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
        ($_GET['Status'] === 'Linked') && $status = "WHERE idcustomer IS NOT NULL AND status LIKE 'A' AND";
        ($_GET['Status'] === 'Unlinked') && $status = "WHERE idcustomer IS NULL AND status LIKE 'A' AND";
    }

    $filter = $_GET['filter'];
    !$filter && $filter = 'Plate';

    $search = trim(ucfirst(mb_convert_case($_GET['search'], MB_CASE_TITLE, 'UTF-8')));
    $filter == 'Plate' && $search = strtoupper(preg_replace("/[^A-Za-z0-9]/", '', $search));

    $row = Vehicle::SelectAllParam("$status $filter LIKE '%$search%'");
    if ($row) {
        foreach ($row as $value) {
            if($value['idcustomer'] != null){
                $id = $value['idcustomer'];
                $customer = Customer::SelectParam("WHERE id = $id");
                $idcompany = $customer['idcompany'];
                $idcompany != null && $company = Company::SelectParam("WHERE id = $idcompany");
            }

            $idvehicle = $value['id'];
            $row = Movement::ExpectedExit($idvehicle);
            $row ? $expectedexit = $row['exittime'] : null;
            $row && $entry = Movement::SelectParam("WHERE idvehicle = $idvehicle");

            $r[] = [
                'id' => $value['id'],
                'plate' => $value['plate'],
                'model' => $value['model'],
                'color' => $value['color'],
                'type' => $value['type'],
                'customer' => $value['idcustomer'] != null ? $customer['fullname'] : null,
                'company' => (isset($customer) && $customer['idcompany'] != null) ? $company['fullname'] : null,
                'entrytime' => isset($entry) ? $entry['entrytime'] : null,
                'expectedexit' => isset($expectedexit) ? strtok($expectedexit, "+") : null,
                'status' => $value['status'],
            ];
        }
    } else {
        $r['success'] = 0;
    }
}

if(isset($_GET['Action']) && $_GET['Action'] == 'link-search'){
    $plate = strtoupper(preg_replace("/[^A-Za-z0-9]/", '', $_GET['Plate']));
    $id = intval($_GET['id']);
    $row = Vehicle::SelectParam("WHERE plate = '$plate' AND (idcustomer IS NULL OR idcustomer = $id)");
    if($row){
        $r = [
            'id' => $row['id'],
            'plate' => $row['plate'],
            'model' => $row['model'],
            'color' => $row['color'],
            'type' => $row['type'],
            'idcustomer' => $row['idcustomer'],
        ];
    } else {
        $r['success'] = 0;
    }
}

if(isset($_GET['Action'])&& $_GET['Action'] == 'link-table'){
    $id = intval($_GET['id']);
    $row = Vehicle::SelectAllParam("WHERE idcustomer = $id");
    if($row){
        foreach ($row as $value){
            $r[] = [
                'id' => $value['id'],
                'plate' => $value['plate'],
                'model' => $value['model'],
                'color' => $value['color'],
                'type' => $value['type'],
                'idcustomer' => $value['idcustomer'],
            ];
        }
    } else {
        $r['success'] = 0;
    }
}

echo json_encode($r);
