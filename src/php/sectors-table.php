<?php
header('HTTP/1.1 200 OK');
header('Access-Control-Allow-Origin: *');
session_start();
//Dependências
include('../php/functions/sectorsFunctions.php');

if(isset($_GET['Action']) && $_GET['Action'] == 'categories'){
    $row = Sector::SelectCategories();
    if ($row) {
        foreach ($row as $value) {
            $r[] = [
                'id' => $value['id'],
                'name' => $value['name'],
                'description' => $value['description'],
            ];
        }
    } else {
        $r['success'] = 0;
    }
}

if(isset($_GET['Action']) && $_GET['Action'] == 'sectorcategory'){
    $row = Sector::SelectCategoryFrom($_GET['idcategory']);
    if ($row) {
        $r['id'] = $row['id'];
        $r['name'] = $row['name'];
        $r['description'] = $row['description'];
    } else {
        $r['success'] = 0;
    }
}

if(isset($_GET['Action']) && $_GET['Action'] == 'sectors'){
    $row = Sector::SelectAll();
    if ($row) {
        foreach ($row as $value) {
            $r[] = [
                'id' => $value['id'],
                'name' => $value['name'],
                'idcategory' => $value['idcategory'],
                'status' => $value['status'],
            ];
        }
    } else {
        $r['success'] = 0;
    }
}

if(isset($_GET['Action']) && $_GET['Action'] == 'spots'){
    $row = Spot::SelectAllFrom($_GET['idsector']);
    if ($row) {
        foreach ($row as $value) {
            $r[] = [
                'id' => $value['id'],
                'number' => $value['number'],
                'status' => $value['status'],
            ];
        }
    } else {
        $r['success'] = 0;
    }
}

if(isset($_GET['Action']) && $_GET['Action'] == 'spots-available'){
    $id = $_GET['idsector'];
    $row = Spot::SelectAllParam("WHERE idsector = $id AND status = 'V'");
    if ($row) {
        foreach ($row as $value) {
            $r[] = [
                'id' => $value['id'],
                'number' => $value['number'],
                'status' => $value['status'],
            ];
        }
    } else {
        $r['success'] = 0;
    }
}

echo json_encode($r);