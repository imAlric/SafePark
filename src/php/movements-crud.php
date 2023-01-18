<?php
header('HTTP/1.1 200 OK');
header('Access-Control-Allow-Origin: *');
session_start();
date_default_timezone_set('America/Sao_Paulo');
//Dependências
include("./functions/companyFunctions.php");
include("./functions/customerFunctions.php");
include("./functions/vehicleFunctions.php");
include("./functions/staffFunctions.php");
include("./functions/sectorsFunctions.php");
include("./functions/movementFunctions.php");
include("./functions/logFunctions.php");
include('./functions/userFunctions.php');

//Realizar check-in.
if(isset($_POST['Action']) && $_POST['Action'] == 'checkin'){
    //Variáveis
    $user = intval($_POST['UserID']);

    $plate = preg_replace("/[^A-Za-z0-9^]/","",$_POST['FormData']['Plate']);
    $model = ucfirst(mb_convert_case($_POST['FormData']['Model'], MB_CASE_TITLE, 'UTF-8'));
    $color = ucfirst(mb_convert_case($_POST['FormData']['Color'], MB_CASE_TITLE, 'UTF-8'));
    $type = ucfirst(mb_convert_case($_POST['FormData']['Type'], MB_CASE_TITLE, 'UTF-8'));

    $cpf = preg_replace("/[^0-9^]/","",$_POST['FormData']['CPF']);
    $customer = ucfirst(mb_convert_case($_POST['FormData']['Customer'], MB_CASE_TITLE, 'UTF-8'));
    $company = ucfirst(mb_convert_case($_POST['FormData']['Company'], MB_CASE_TITLE, 'UTF-8'));

    $date = $_POST['FormData']['Date'];
    $time = $_POST['FormData']['Time'];

    $sector = $_POST['FormData']['Sector'];
    $spot = $_POST['FormData']['Spot'];

    $valet = ($_POST['FormData']['Valet']) ? $_POST['FormData']['Valet'] : null;
    
    //Checa se o veículo é recorrente.
    $row = Vehicle::SelectParam("WHERE plate = '$plate'");
    if($row){
        $vehicle = $row['id'];
        //Checa se o veículo tem cadastro.
        $idcustomer = $row['idcustomer'];
        if(isset($idcustomer)){
            //Checa se o cliente tem convênio.
            $customer = Customer::SelectParam("WHERE id = $idcustomer");
            $idcompany = $customer['idcompany'];

            //Checa se houve pagamento da mensalidade do cliente/empresa.
            isset($idcompany) && $company = Company::SelectParam("WHERE id = $idcompany");
            $idbilling = (isset($idcustomer) && !isset($idcompany)) ? $customer['idbilling'] : $company['idbilling'];
            $row = Billing::SelectParam("WHERE id = $idbilling");
            if(date("Y-m-d H:i:s") > date($row['validity'])){
                $r['noPayment'] = 1;
                $r['success'] = 0;
            } 
            
            //Checa se o CPF (se tiver sido inserido) é o mesmo utilizado no vinculo do cliente.
            if($cpf !== ''){
                $customer['cpf'] !== $cpf && $r['notSameCustomer'] = 1;
            }
        }
        //Se o veículo estiver desativado, impede o check-in de continuar.
        $row['status'] !== 'A' && $r['inactiveVehicle'] = 1;   
        $row['status'] !== 'A' && $r['success'] = 0;   
    } else {
        //Cria um veículo caso não seja recorrente.
        $newvehicle = Vehicle::Create($plate, $model, $color, $type);
        $vehicle = $newvehicle['id'];

        Log::Create("create", "vehicles", null, $vehicle, $_POST['UserID']);
    }
    //Se o veículo não estiver inativo/excluído, começa a movimentação.
    if(!isset($r['inactiveVehicle'])){
    //Checa se já existe movimentação ativa deste veículo.
    $row = Movement::SelectParam("WHERE idvehicle = $vehicle AND status = 'A'");
        if(!$row){
            if(!isset($r['noPayment'])){
                //Realiza o Check-In.
                $row = Movement::CheckIn($spot, $vehicle, isset($idcustomer) ? $idcustomer : null, isset($idcompany) ? $idcompany : null, $date, $time, $user, $valet);
                Log::Create("checkin", "movements", null, $row['id'], $_POST['UserID']);
                Spot::Status('E', $spot);
                Log::Create("parked", "parkingspots", null, $spot, $_POST['UserID']);

                $r['success'] = 1;
            }
        } else {
            $r['movementActive'] = 1;
            $r['success'] = 0;
        }
    }
}
//Realizar check-out.
else if(isset($_POST['Action']) && $_POST['Action'] == 'checkout'){
    //Variáveis
    $id = intval($_POST['id']);

    $date = date('Y,m,d', strtotime($_POST['FormData']['Date']));
    $time = $_POST['FormData']['Time'];

    $total = floatval($_POST['FormData']['Total']);
    $amount = (isset($_POST['FormData']['Amount']) && $_POST['FormData']['Amount'] !== '') ? floatval($_POST['FormData']['Amount']) : floatval($_POST['FormData']['Total']);
    $change = (isset($_POST['FormData']['Change']) && $_POST['FormData']['Change'] !== '') ? floatval($_POST['FormData']['Change']) : null;
    $method = $_POST['FormData']['Method'];

    //Realiza o Check-Out.
    $row = Movement::CheckOut($total, $amount, $change, $method, $date, $time, $id);
    Log::Create("checkout", "movements", null, $id, $_POST['UserID']);

    $row = Movement::SelectParam("WHERE id = $id");
    $spot = $row['idparking'];
    Spot::Status('V', $spot);
    Log::Create("vacant", "parkingspots", null, $spot, $_POST['UserID']);

    $r['success'] = 1;
}
//Alterar o status de um movimento.
else if(isset($_POST['Action']) && $_POST['Action'] == 'status'){
    $id = intval($_POST['id']);
    $motive = $_POST['FormData']['Motive'] ? $_POST['FormData']['Motive'] : null;
    $description = $_POST['FormData']['Description'] ? $_POST['FormData']['Description'] : null;

    $status = ($_POST['status'] == 'A') ? 'I' : 'A';

    $row = Movement::Status($status, $id);
    Log::Create(($status == 'A' ? "activate" : "inactivate"), "movements", ($status == 'A' ? null : $motive.($description ? ' - '.$description : '')), $id, $_POST['UserID']);
    
    $r['success'] = 1;
} 
//Cancelar um movimento.
else if(isset($_POST['Action']) && $_POST['Action'] == 'cancel'){
    $id = intval($_POST['id']);

    $row = Movement::SelectParam("WHERE id = $id");

    Movement::Cancel($id);
    Log::Create("cancel", "movements", null, $id, $_POST['UserID']); 
    Spot::Status('V', $row['idparking']);

    $r['success'] = 1;
}
//Caso nenhuma das ações tenha recebido trigger.
else {
    $r['success'] = 0;
}

echo json_encode($r);