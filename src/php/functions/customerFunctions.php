<?php
class Customer{
    /* DAO -------------------------- */
    public static function SelectAll($limit, $offset, $status)
    {
        require('../lib/connect.php');
        $sql = "SELECT * FROM customers $status status NOT LIKE 'X' ORDER BY fullname LIMIT $limit OFFSET $offset";
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        $row = $stmt->fetchAll();
        $pdo = null;

        return $row;
    }

    public static function SelectAllParam($param)
    {
        require('../lib/connect.php');
        $sql = "SELECT * FROM customers $param AND status NOT LIKE 'X' ORDER BY fullname";
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        $row = $stmt->fetchAll();
        $pdo = null;

        return $row;
    }

    public static function SelectParam($param)
    {
        require('../lib/connect.php');
        $sql = "SELECT * FROM customers $param AND status NOT LIKE 'X'";
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        $row = $stmt->fetch();
        $pdo = null;

        return $row;
    }

    public static function SelectColParam($data, $param){
        require('../lib/connect.php');
        $sql = "SELECT $data FROM customers $param AND status NOT LIKE 'X'";
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        $row = $stmt->fetch();
        $pdo = null;

        return $row;
    }

    public static function Count($status)
    {
        require('../lib/connect.php');
        $sql = "SELECT count(*) FROM customers $status status NOT LIKE 'X'";
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        $row = $stmt->fetch();
        $pdo = null;

        return $row;
    }
    /* DAO -------------------------- */

    /* CRUD -------------------------- */
    public static function Create($fullname, $cpf, $phone, $idbilling){
        require('../lib/connect.php');
        $sql = "INSERT INTO customers (fullname, cpf, phone, idbilling, status) VALUES (:fullname, :cpf, :phone, :idbilling, 'A') RETURNING id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$fullname, $cpf, $phone, $idbilling]);
        $row = $stmt->fetch();
        $pdo = null;

        return $row;
    }

    public static function Update($fullname, $cpf, $phone, $id){
        require('../lib/connect.php');
        $sql = "UPDATE customers SET fullname = :fullname, cpf = :cpf, phone = :phone, updated_at = now() WHERE id = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$fullname, $cpf, $phone, $id]);
        $row = $stmt->fetch();
        $pdo = null;

        return $row;
    }

    public static function Status($status, $id){
        require('../lib/connect.php');
        $sql = "UPDATE customers SET status = :status, updated_at = now() WHERE id = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$status, $id]);
        $row = $stmt->fetch();
        $pdo = null;

        return $row;
    }

    public static function Delete($id){
        require('../lib/connect.php');

        $select = Customer::SelectParam("WHERE id = $id");
        Customer::BillingSet(null, $id);
        Billing::Cancel($select['idbilling']);

        $sql = "UPDATE customers SET status = 'X', updated_at = now() WHERE id = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        $pdo = null;

        return $row;
    }
    /* CRUD -------------------------- */

    /* Link -------------------------- */
    public static function Link($idcompany, $id){
        require('../lib/connect.php');
        $sql = "UPDATE customers SET idcompany = :idcompany, updated_at = now() WHERE id = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$idcompany, $id]);
        $row = $stmt->fetch();
        $pdo = null;

        $select = Customer::SelectParam("WHERE id = $id");
        Customer::BillingSet(null, $id);
        Billing::Cancel($select['idbilling']);

        return $row;
    }

    public static function Unlink($id){
        require('../lib/connect.php');
        $sql = "UPDATE customers SET idcompany = null, updated_at = now() WHERE id = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        $pdo = null;

        $billing = Billing::Create(120.00, null, null, null, date('Y-m-d H:i:s'));
        $billing = Customer::BillingSet($billing['id'], $id);

        return $row;
    }
    /* Link -------------------------- */
    
    /* Billing -------------------------- */
    public static function BillingSet($idbilling, $id){
        require('../lib/connect.php');
        $sql = "UPDATE customers SET idbilling = :idbilling, updated_at = now() WHERE id = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$idbilling, $id]);
        $row = $stmt->fetch();
        $pdo = null;

        return $row;
    }
    /* Billing -------------------------- */
}