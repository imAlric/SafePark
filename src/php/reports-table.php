<?php
header('HTTP/1.1 200 OK');
header('Access-Control-Allow-Origin: *');
session_start();
//Dependências
include("./functions/logFunctions.php");
include("./functions/userFunctions.php");

if(isset($_POST['Action']) && $_POST['Action'] == "report" && isset($_POST['FormData'])){
    $type = $_POST['FormData']['Type'];
    $action = $_POST['FormData']['Action'];
    $startdate = $_POST['FormData']['StartDate'];
    $enddate = $_POST['FormData']['EndDate'];
}

if(isset($type) && ($type == "movements")){
    $row = Log::SelectAllParam("WHERE target = 'movements' AND action = '$action' AND (created_at >= '$startdate 00:00:00' AND created_at <= '$enddate 23:59:59')");

    if($row){
        foreach($row as $value){
            $idtarget = $value['idtarget'];
            $iduser = $value['iduser'];
    
            $movement = Log::SelectFrom("movements WHERE id = $idtarget ORDER BY created_at");
            $idvehicle = $movement['idvehicle'];

            $data = Log::SelectFrom("vehicles WHERE id = $idvehicle ORDER BY plate");
            $user = User::SelectParam("WHERE users.id = $iduser");

            $r[] = [
                'id' => $movement['id'],
                'target' => $value['target'],
                'action' => $value['action'],
                'target' => substr($data['plate'], 0, 3)."-".substr($data['plate'], 3, 7),
                'user' => $user['fullname'],
                'datetime' => preg_replace("/[-]/", "/", date('d-m-Y H:i:s', strtotime($value['created_at']))),
            ];
        };
    } else {
        $r['success'] = 0;
    }
} else if(isset($type) && ($type == "customers" || $type == "staff" || $type == "companies")){
    $row = Log::SelectAllParam("WHERE target = '$type' AND action = '$action' AND (created_at >= '$startdate 00:00:00' AND created_at <= '$enddate 23:59:59')");

    if($row){
        foreach($row as $value){
            $idtarget = $value['idtarget'];
            $iduser = $value['iduser'];
    
            $data = Log::SelectFrom("$type WHERE id = $idtarget ORDER BY fullname");
            $user = User::SelectParam("WHERE users.id = $iduser");
    
            $r[] = [
                'id' => $data['id'],
                'target' => $value['target'],
                'action' => $value['action'],
                'target' => $data['fullname'],
                'user' => $user['fullname'],
                'datetime' => preg_replace("/[-]/", "/", date('d-m-Y H:i:s', strtotime($value['created_at']))),
            ];
        };
    } else {
        $r['success'] = 0;
    }
} else if(isset($type) && ($type == "vehicles")){
    $row = Log::SelectAllParam("WHERE target = '$type' AND action = '$action' AND (created_at >= '$startdate 00:00:00' AND created_at <= '$enddate 23:59:59')");

    if($row){
        foreach($row as $value){
            $idtarget = $value['idtarget'];
            $iduser = $value['iduser'];
    
            $data = Log::SelectFrom("$type WHERE id = $idtarget ORDER BY model");
            $user = User::SelectParam("WHERE users.id = $iduser");
    
            $r[] = [
                'id' => $data['id'],
                'target' => $value['target'],
                'action' => $value['action'],
                'target' => substr($data['plate'], 0, 3)."-".substr($data['plate'], 3, 7),
                'user' => $user['fullname'],
                'datetime' => preg_replace("/[-]/", "/", date('d-m-Y H:i:s', strtotime($value['created_at']))),
            ];
        };
    } else {
        $r['success'] = 0;
    }
} else if(isset($type) && ($type == "parkingspots")){
    $row = Log::SelectAllParam("WHERE target = 'sectors' AND action = '$action' AND (created_at >= '$startdate 00:00:00' AND created_at <= '$enddate 23:59:59')");

    if($row){
        foreach($row as $value){
            $idtarget = $value['idtarget'];
            $iduser = $value['iduser'];
    
            $data = Log::SelectFrom("sectors WHERE id = $idtarget ORDER BY name");
            $user = User::SelectParam("WHERE users.id = $iduser");
    
            $r[] = [
                'id' => $data['id'],
                'target' => $value['target'],
                'action' => $value['action'],
                'target' => $data['name'],
                'user' => $user['fullname'],
                'datetime' => preg_replace("/[-]/", "/", date('d-m-Y H:i:s', strtotime($value['created_at']))),
            ];
        };
    } else {
        $r['success'] = 0;
    }
} else if(isset($type) && ($type == "billing" || $type == "monthly")){
    $row = Log::SelectAllParam("WHERE target = '$type' AND action = '$action' AND (created_at >= '$startdate 00:00:00' AND created_at <= '$enddate 23:59:59')");

    if($row){
        foreach($row as $value){
            $idtarget = $value['idtarget'];
            $iduser = $value['iduser'];
    
            $data = Log::SelectFrom("$type WHERE id = $idtarget ORDER BY created_at");
            $user = User::SelectParam("WHERE users.id = $iduser");
    
            $r[] = [
                'id' => $data['id'],
                'target' => $value['target'],
                'action' => $value['action'],
                'target' => $data['totalprice'],
                'user' => $user['fullname'],
                'datetime' => preg_replace("/[-]/", "/", date('d-m-Y H:i:s', strtotime($value['created_at']))),
            ];
        };
    } else {
        $r['success'] = 0;
    }
} else {
    $r['success'] = 0;
}

echo json_encode($r);