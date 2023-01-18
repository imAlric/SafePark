<?php
header('HTTP/1.1 200 OK');
header('Access-Control-Allow-Origin: *');
session_start();
//Dependências
include("./functions/movementFunctions.php");
include("./functions/vehicleFunctions.php");
include("./functions/sectorsFunctions.php");
include("./functions/customerFunctions.php");
include("./functions/companyFunctions.php");
include("./functions/userFunctions.php");
include("./functions/staffFunctions.php");

if(isset($_GET['Action']) && $_GET['Action'] == 'table'){
    $startdate = $_GET['StartDate'];
    $enddate = $_GET['EndDate'];
    $wheredate = "entrydate >= '$startdate' AND entrydate <= '$enddate' AND";

    if(isset($_GET['Status'])){
        ($_GET['Status'] === 'All') && $status = "WHERE $wheredate";
        ($_GET['Status'] === 'Active') && $status = "WHERE status LIKE 'A' AND $wheredate";
        ($_GET['Status'] === 'Inactive') && $status = "WHERE status LIKE 'I' AND $wheredate";
        ($_GET['Status'] === 'Finished') && $status = "WHERE status LIKE 'F' AND $wheredate";
    }

    if(isset($_GET['UserID']) && $_GET['PermLvl'] == 0){
        $iduser = $_GET['UserID'];
        $status = $status." iduser = $iduser AND";
    }

    $row = Movement::SelectAll($_GET['Limit'], $_GET['Offset'], $status);
    $count = Movement::Count($status);
    if ($row) {
        foreach ($row as $value) {
            $idvehicle = $value['idvehicle'];
            $idparking = $value['idparking'];
            $iduser = $value['iduser'];
            $idvalet = $value['idvalet'];

            $vehicle = Vehicle::SelectColParam("plate","WHERE id = $idvehicle");

            $spot = Spot::SelectColParam("number, idsector", "WHERE id = $idparking");
            $parking = $spot['number'];
            $idsector = $spot['idsector'];

            $sector = Sector::SelectColParam("name","WHERE id = $idsector");
            $sectorname = $sector['name'];

            $user = User::SelectColParam("id","fullname","WHERE users.id = $iduser");

            isset($idvalet) && $valet = Staff::SelectColParam("fullname", "WHERE staff.id = $idvalet");

            if(!isset($value['exittime'])){
                $row = Movement::ExpectedExit($idvehicle);
                $row ? $expectedexit = $value['entrydate']." ".$row['exittime'] : null;
            }

            $r[] = [
                'id' => $value['id'],
                'idbilling' => $value['idbilling'],
                'idparking' => $value['idparking'],
                'idcustomer' => $value['idcustomer'],
                'idcompany' => $value['idcompany'],
                'spot' => $sectorname.$parking,
                'idvehicle' => $value['idvehicle'],
                'vehicle' => $vehicle['plate'],
                'entrydate' => date('Y/m/d', strtotime($value['entrydate'])),
                'exitdate' => isset($value['exitdate']) ? date('Y/m/d', strtotime($value['exitdate'])) : null,
                'entrytime' => $value['entrytime'],
                'exittime' => isset($value['exittime']) ? $value['exittime'] : null,
                'expectedexit' => isset($expectedexit) ? strtok($expectedexit, "+") : null,
                'iduser' => $value['iduser'],
                'user' => $user['fullname'],
                'valet' => isset($value['idvalet']) ? $valet['fullname'] : null,
                'idvalet' => $value['idvalet'],
                'status' => $value['status'],
                'count' => $count,
            ];
        }
    } else {
        $r['success'] = 0;
    }
}

if(isset($_GET['Action']) && $_GET['Action'] == 'search'){
    $startdate = $_GET['StartDate'];
    $enddate = $_GET['EndDate'];
    $wheredate = "entrydate >= '$startdate' AND entrydate <= '$enddate'";

    if(isset($_GET['Status'])){
        ($_GET['Status'] === 'All') && $status = "WHERE $wheredate";
        ($_GET['Status'] === 'Active') && $status = "WHERE status LIKE 'A' AND $wheredate";
        ($_GET['Status'] === 'Inactive') && $status = "WHERE status LIKE 'I' AND $wheredate";
        ($_GET['Status'] === 'Finished') && $status = "WHERE status LIKE 'F' AND $wheredate";
    }

    $filter = $_GET['filter'];
    !$filter && $filter = 'Plate';

    if($filter == 'Plate') {
        $search = strtoupper(preg_replace("/[^A-Za-z0-9]/", '', $_GET['search']));
        $row = Vehicle::SelectColParam("id", "WHERE plate LIKE '%$search%'");
        if($row){
            $id = $row['id'];
            $result = "AND idvehicle = $id";
        } else {
            $result = null;
        }
    } else if($filter == 'Customer') {
        $search = trim(ucfirst(mb_convert_case($_GET['search'], MB_CASE_TITLE, 'UTF-8')));
        $row = Customer::SelectColParam("id", "WHERE fullname LIKE '%$search%'");
        if($row){
            $id = $row['id'];
            $result = "AND idcustomer = $id";
        } else {
            $result = null;
        }
    } else if($filter == 'Company') {
        $search = trim(ucfirst(mb_convert_case($_GET['search'], MB_CASE_TITLE, 'UTF-8')));
        $row = Company::SelectColParam("id", "WHERE fullname LIKE '%$search%'");
        if($row){
            $id = $row['id'];
            $result = "AND idcompany = $id";
        } else {
            $result = null;
        }
    } else if($filter == 'Valet') {
        $search = trim(ucfirst(mb_convert_case($_GET['search'], MB_CASE_TITLE, 'UTF-8')));
        $row = Staff::SelectColParam("id", "WHERE fullname LIKE '%$search%' AND role LIKE 'Manobrista'");
        if($row){
            $id = $row['id'];
            $result = "AND idvalet = $id";
        } else {
            $result = null;
        }
    } else if($filter == 'Spot') {
        $search = $_GET['search'];
        $sector = strtoupper(preg_replace("/[^A-Za-z]/", '', $_GET['search']));
        $number = preg_replace("/[^0-9]/", '', $_GET['search']);

        $row = Sector::SelectColParam("id", "WHERE name LIKE '$sector'");
        $row && $id = $row['id'];
        $row && $spot = Spot::SelectColParam("id", "WHERE number = $number AND idsector = $id");

        if(isset($spot)){
            $id = $spot['id'];
            $result = "AND idparking = $id";
        } else {
            $result = null;
        }
    }

    $row = Movement::SelectAllParam("$status $result");
    if ($row && ($search && isset($result))) {
        foreach ($row as $value) {
            $idvehicle = $value['idvehicle'];
            $idparking = $value['idparking'];
            $iduser = $value['iduser'];
            $idvalet = $value['idvalet'];

            $vehicle = Vehicle::SelectColParam("plate","WHERE id = $idvehicle");

            $spot = Spot::SelectColParam("number, idsector", "WHERE id = $idparking");
            $parking = $spot['number'];
            $idsector = $spot['idsector'];

            $sector = Sector::SelectColParam("name","WHERE id = $idsector");
            $sectorname = $sector['name'];

            $user = User::SelectColParam("id","fullname","WHERE users.id = $iduser");

            isset($idvalet) && $valet = Staff::SelectColParam("fullname", "WHERE staff.id = $idvalet");

            if(!isset($value['exittime'])){
                $row = Movement::ExpectedExit($idvehicle);
                $row ? $expectedexit = $value['entrydate']." ".$row['exittime'] : null;
            }
            
            $r[] = [
                'id' => $value['id'],
                'idbilling' => $value['idbilling'],
                'idparking' => $value['idparking'],
                'idcustomer' => $value['idcustomer'],
                'idcompany' => $value['idcompany'],
                'spot' => $sectorname.$parking,
                'idvehicle' => $value['idvehicle'],
                'vehicle' => $vehicle['plate'],
                'entrydate' => date('Y/m/d', strtotime($value['entrydate'])),
                'exitdate' => isset($value['exitdate']) ? date('Y/m/d', strtotime($value['exitdate'])) : null,
                'entrytime' => $value['entrytime'],
                'exittime' => isset($value['exittime']) ? $value['exittime'] : null,
                'expectedexit' => isset($expectedexit) ? strtok($expectedexit, "+") : null,
                'iduser' => $value['iduser'],
                'user' => $user['fullname'],
                'valet' => isset($value['idvalet']) ? $valet['fullname'] : null,
                'idvalet' => $value['idvalet'],
                'status' => $value['status'],
            ];
        }
    } else {
        $r['success'] = 0;
    }
}

if(isset($_GET['Action']) && $_GET['Action'] == 'id-search'){
    $id = $_GET['id'];
    $row = Movement::SelectParam("WHERE id = $id");
    
    if($row){
        $idvehicle = $row['idvehicle'];
        $idparking = $row['idparking'];
        $idbilling = $row['idbilling'];
        $idcustomer = $row['idcustomer'];
        $idcompany = $row['idcompany'];

        //Dados do veículo.
        $vehicle = Vehicle::SelectParam("WHERE id = $idvehicle");

        //Dados do cliente.
        if(isset($idcustomer)){
            $customer = Customer::SelectParam("WHERE id = $idcustomer");
        }

        //Dados do convênio.
        if(isset($idcompany)){
            $company = Company::SelectParam("WHERE id = $idcompany");
        }

        //Dados de pagamento.
        if(isset($idbilling) && $row['status'] == 'F'){
            $billing = Billing::SelectParam("WHERE id = $idbilling");
        }

        //Dados da vaga e setor.
        $spot = Spot::SelectParam("WHERE id = $idparking");
        $parking = $spot['number'];
        $idsector = $spot['idsector'];

        $sector = Sector::SelectParam("WHERE id = $idsector");
        $sectorname = $sector['name'];

        $r[] = [
            'id' => $row['id'],
            //Dados de pagamento.
            'totalprice' => isset($billing) ? $billing['totalprice'] : null,
            'amount' => isset($billing) ? $billing['amount'] : null,
            'change' => isset($billing) ? $billing['change'] : null,
            'method' => isset($billing) ? $billing['method'] : null,
            //Dados do cliente.
            'customer' => isset($customer) ? $customer['fullname'] : null,
            'cpf' => isset($customer) ? $customer['cpf'] : null,
            //Dados do convênio.
            'company' => isset($company) ? $company['fullname'] : null,
            'cnpj' => isset($company) ? $company['cnpj'] : null,
            //Dados do veículo.
            'plate' => $vehicle['plate'],
            'model' => $vehicle['model'],
            'color' => $vehicle['color'],
            'type' => $vehicle['type'],
            //Setor e vaga.
            'spot' => $sectorname.$parking,
            //Status.
            'status' => $row['status'],
        ];
    }
}

echo json_encode($r);