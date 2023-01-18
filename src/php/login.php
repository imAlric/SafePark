<?php
header('HTTP/1.1 200 OK');
header('Access-Control-Allow-Origin: *');
session_start();
//Dependências.
include('./functions/userFunctions.php');
include('./functions/logFunctions.php');

if (isset($_POST['email']) && isset($_POST['password'])) {
    //Variáveis.
    $email = $_POST['email'];
    $password = $_POST['password'];

    //Procura o usuário no banco.
    $row = User::Select($email);
    if ($row) {
        //Confere se a senha do usuário está correta.
        if(User::Check($password, $row['password'])){
            //Gera uma nova senha para criptografia AES.
            $AESpassword = bin2hex(openssl_random_pseudo_bytes(24));
            //Log de login.
            Log::Create("login", "users", null, $row['id'], $row['id'], User::GetIP());

            //Retorno do JSON.
            $r['id'] = $row['id'];
            $r['password'] = $AESpassword;
            $r['fullname'] = $row['fullname'];
            $r['permlevel'] = $row['permlevel'];
            $r['success'] = 1;
        } else {
            $r['success'] = 0;
        }
    } else {
        $r['success'] = 0;
    }
}

echo json_encode($r);
