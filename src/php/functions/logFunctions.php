<?php

class Log{
    /* DAO -------------------------- */
    public static function SelectParam($param){
        require('../lib/connect.php');
        $sql = "SELECT * FROM logs $param ORDER BY created_at";
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        $row = $stmt->fetch();
        $pdo = null;

        return $row;
    }

    public static function SelectAllParam($param){
        require('../lib/connect.php');
        $sql = "SELECT * FROM logs $param ORDER BY created_at";
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        $row = $stmt->fetchAll();
        $pdo = null;

        return $row;
    }

    public static function SelectFrom($param){
        require('../lib/connect.php');
        $sql = "SELECT * FROM $param";
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        $row = $stmt->fetch();
        $pdo = null;

        return $row;
    }
    /* DAO -------------------------- */

    /* CRUD -------------------------- */
    public static function Create($action, $target, $description, $idtarget, $iduser){
        require('../lib/connect.php');
        $ip = User::GetIP();

        $sql = "INSERT INTO logs (action, target, description, idtarget, iduser, ip) VALUES (:action, :target, :description, :idtarget, :iduser, :ip) RETURNING id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$action, $target, $description, $idtarget, $iduser, $ip]);
        $row = $stmt->fetch();
        $pdo = null;

        return $row;
    }
    /* CRUD -------------------------- */
}