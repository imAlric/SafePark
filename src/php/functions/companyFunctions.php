<?php
class Company{
    /* DAO -------------------------- */
    public static function SelectAll($limit, $offset, $status)
    {
        require('../lib/connect.php');
        $sql = "SELECT * FROM companies $status status NOT LIKE 'X' ORDER BY fullname LIMIT $limit OFFSET $offset";
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        $row = $stmt->fetchAll();
        $pdo = null;

        return $row;
    }

    public static function SelectAllParam($param)
    {
        require('../lib/connect.php');
        $sql = "SELECT * FROM companies $param AND status NOT LIKE 'X' ORDER BY fullname";
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        $row = $stmt->fetchAll();
        $pdo = null;

        return $row;
    }

    public static function SelectParam($param)
    {
        require('../lib/connect.php');
        $sql = "SELECT * FROM companies $param AND status NOT LIKE 'X'";
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        $row = $stmt->fetch();
        $pdo = null;

        return $row;
    }

    public static function SelectColParam($data, $param){
        require('../lib/connect.php');
        $sql = "SELECT $data FROM companies $param AND status NOT LIKE 'X'";
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        $row = $stmt->fetch();
        $pdo = null;

        return $row;
    }

    public static function Count($status)
    {
        require('../lib/connect.php');
        $sql = "SELECT count(*) FROM companies $status status NOT LIKE 'X'";
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        $row = $stmt->fetch();
        $pdo = null;

        return $row;
    }
    /* DAO -------------------------- */

    /* CRUD -------------------------- */
    public static function Create($fullname, $cnpj, $email, $phone, $idbilling){
        require('../lib/connect.php');
        $sql = "INSERT INTO companies (fullname, cnpj, email, phone, idbilling, status) VALUES (:fullname, :cnpj, :email, :phone, :idbilling, 'A') RETURNING id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$fullname, $cnpj, $email, $phone, $idbilling]);
        $row = $stmt->fetch();
        $pdo = null;

        return $row;
    }

    public static function Update($fullname, $cnpj, $email, $phone, $id){
        require('../lib/connect.php');
        $sql = "UPDATE companies SET fullname = :fullname, cnpj = :cnpj, email = :email, phone = :phone, updated_at = now() WHERE id = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$fullname, $cnpj, $email, $phone, $id]);
        $row = $stmt->fetch();
        $pdo = null;

        return $row;
    }

    public static function Status($status, $id){
        require('../lib/connect.php');
        $sql = "UPDATE companies SET status = :status, updated_at = now() WHERE id = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$status, $id]);
        $row = $stmt->fetch();
        $pdo = null;

        return $row;
    }

    public static function Delete($id){
        require('../lib/connect.php');

        $select = Company::SelectParam("WHERE id = $id");
        Billing::Cancel($select['idbilling']);

        $sql = "UPDATE companies SET status = 'X', updated_at = now() WHERE id = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        $pdo = null;

        return $row;
    }
    /* CRUD -------------------------- */

    /* Billing -------------------------- */
    public static function BillingSet($idbilling, $id){
        require('../lib/connect.php');
        $sql = "UPDATE companies SET idbilling = :idbilling, updated_at = now() WHERE id = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$idbilling, $id]);
        $row = $stmt->fetch();
        $pdo = null;

        return $row;
    }
    /* Billing -------------------------- */
}