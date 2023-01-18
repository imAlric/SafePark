<?php

class Movement{
    /* DAO -------------------------- */
    public static function SelectAll($limit, $offset, $status){
        require('../lib/connect.php');
        $sql = "SELECT * FROM movements $status status NOT LIKE 'X' ORDER BY entrytime LIMIT $limit OFFSET $offset";
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        $row = $stmt->fetchAll();
        $pdo = null;

        return $row;
    }

    public static function SelectAllParam($param){
        require('../lib/connect.php');
        $sql = "SELECT * FROM movements $param AND status NOT LIKE 'X' ORDER BY entrytime";
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        $row = $stmt->fetchAll();
        $pdo = null;

        return $row;
    }

    public static function SelectParam($param){
        require('../lib/connect.php');
        $sql = "SELECT * FROM movements $param AND status NOT LIKE 'X'";
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        $row = $stmt->fetch();
        $pdo = null;

        return $row;
    }

    public static function Count($status)
    {
        require('../lib/connect.php');
        $sql = "SELECT count(*) FROM movements $status status NOT LIKE 'X'";
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        $row = $stmt->fetch();
        $pdo = null;

        return $row;
    }

    public static function ExpectedExit($idvehicle)
    {
        require('../lib/connect.php');

        $sql = "SELECT TIMESTAMP WITH TIME ZONE 'epoch'::TIME AT TIME ZONE 'GMT' + INTERVAL '1 second' * round(extract('epoch' from exittime) / 300) * 300 as exittime, count(exittime) 
        FROM movements WHERE idvehicle = :idvehicle AND status NOT LIKE 'X' 
        GROUP BY round(extract('epoch' from exittime) / 300) HAVING count(exittime) >= 3 ORDER BY MAX(entrydate) LIMIT 1";

        $stmt = $pdo->prepare($sql);
        $stmt->execute([$idvehicle]);
        $row = $stmt->fetch();
        $pdo = null;

        return $row;
    }
    /* DAO -------------------------- */

    /* CRUD -------------------------- */
    public static function CheckIn($idparking, $idvehicle, $idcustomer, $idcompany, $entrydate, $entrytime, $iduser, $idvalet){
        require('../lib/connect.php');
        $sql = "INSERT INTO movements (idparking, idvehicle, idcustomer, idcompany, entrydate, entrytime, iduser, idvalet, status) VALUES (:idparking, :idvehicle, :idcustomer, :idcompany, :entrydate, :entrytime, :iduser, :idvalet, 'A') RETURNING id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$idparking, $idvehicle, $idcustomer, $idcompany, $entrydate, $entrytime, $iduser, $idvalet]);
        $row = $stmt->fetch();
        $pdo = null;

        return $row;
    }

    public static function CheckOut($totalprice, $amount, $change, $method, $exitdate, $exittime, $id){
        require('../lib/connect.php');

        ($totalprice !== 0.00) && $row = Billing::Create($totalprice, $amount, $change, $method, null);
        $idbilling = isset($row) ? $row['id'] : null;

        $sql = "UPDATE movements SET idbilling = :idbilling, exitdate = :exitdate, exittime = :exittime, status = 'F' WHERE id = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$idbilling, $exitdate, $exittime, $id]);
        $row = $stmt->fetch();
        $pdo = null;
        Billing::Finish($idbilling);

        return $row; 
    }

    public static function Status($status, $id){
        require('../lib/connect.php');
        $sql = "UPDATE movements SET status = :status, updated_at = now() WHERE id = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$status, $id]);
        $row = $stmt->fetch();
        $pdo = null;

        return $row;
    }

    public static function Cancel($id){
        require('../lib/connect.php');
        $sql = "UPDATE movements SET status = 'X', updated_at = now() WHERE id = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        $pdo = null;

        return $row;
    }
    /* CRUD -------------------------- */
};

class Billing{
    /* DAO -------------------------- */
    public static function SelectParam($param){
        require('../lib/connect.php');
        $sql = "SELECT * FROM billing $param AND status NOT LIKE 'X'";
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        $row = $stmt->fetch();
        $pdo = null;

        return $row;
    }
    /* DAO -------------------------- */
    
    /* CRUD -------------------------- */
    public static function Create($totalprice, $amount, $change, $method, $validity){
        require('../lib/connect.php');
        $sql = "INSERT INTO billing (totalprice, amount, change, method, validity, status) VALUES (:totalprice, :amount, :change, :method, :validity, 'A') RETURNING id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$totalprice, $amount, $change, $method, $validity]);
        $row = $stmt->fetch();
        $pdo = null;

        return $row;
    }

    public static function Update($totalprice, $amount, $change, $method, $id){
        require('../lib/connect.php');
        $sql = "UPDATE billing SET totalprice = :totalprice, amount = :amount, change = :change, method = :method, updated_at = now() WHERE id = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$totalprice, $amount, $change, $method, $id]);
        $row = $stmt->fetch();
        $pdo = null;

        return $row;
    }

    public static function Finish($id){
        require('../lib/connect.php');
        $sql = "UPDATE billing SET status = 'F', updated_at = now() WHERE id = :id RETURNING id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        $pdo = null;

        return $row;
    }

    public static function Cancel($id){
        require('../lib/connect.php');
        $sql = "UPDATE billing SET status = 'X', updated_at = now() WHERE id = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        $pdo = null;

        return $row;
    }
    /* CRUD -------------------------- */
}