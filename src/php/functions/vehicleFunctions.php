<?php
class Vehicle{
    /* DAO -------------------------- */
    public static function SelectAll($limit, $offset, $status){
        require('../lib/connect.php');
        $sql = "SELECT * FROM vehicles $status status NOT LIKE 'X' ORDER BY model LIMIT $limit OFFSET $offset";
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        $row = $stmt->fetchAll();
        $pdo = null;

        return $row;
    }

    public static function SelectAllParam($param){
        require('../lib/connect.php');
        $sql = "SELECT * FROM vehicles $param AND status NOT LIKE 'X' ORDER BY model";
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        $row = $stmt->fetchAll();
        $pdo = null;

        return $row;
    }

    public static function SelectParam($param){
        require('../lib/connect.php');
        $sql = "SELECT * FROM vehicles $param AND status NOT LIKE 'X'";
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        $row = $stmt->fetch();
        $pdo = null;

        return $row;
    }

    public static function SelectColParam($data, $param){
        require('../lib/connect.php');
        $sql = "SELECT $data FROM vehicles $param AND status NOT LIKE 'X'";
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        $row = $stmt->fetch();
        $pdo = null;

        return $row;
    }

    public static function Count($status)
    {
        require('../lib/connect.php');
        $sql = "SELECT count(*) FROM vehicles $status status NOT LIKE 'X'";
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        $row = $stmt->fetch();
        $pdo = null;

        return $row;
    }
    /* DAO -------------------------- */

    /* CRUD -------------------------- */
    public static function Create($plate, $model, $color, $type){
        require('../lib/connect.php');
        $sql = "INSERT INTO vehicles (plate, model, color, type, status) VALUES (:plate, :model, :color, :type, 'A') RETURNING id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$plate, $model, $color, $type]);
        $row = $stmt->fetch();
        $pdo = null;

        return $row;
    }

    public static function Update($plate, $model, $color, $type, $id){
        require('../lib/connect.php');
        $sql = "UPDATE vehicles SET plate = :plate, model = :model, color = :color, type = :type, updated_at = now() WHERE id = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$plate, $model, $color, $type, $id]);
        $row = $stmt->fetch();
        $pdo = null;

        return $row;
    }

    public static function Status($status, $id){
        require('../lib/connect.php');
        $sql = "UPDATE vehicles SET status = :status, updated_at = now() WHERE id = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$status, $id]);
        $row = $stmt->fetch();
        $pdo = null;

        return $row;
    }

    public static function Delete($id){
        require('../lib/connect.php');
        $sql = "UPDATE vehicles SET status = 'X', updated_at = now() WHERE id = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        $pdo = null;

        return $row;
    }
    /* CRUD -------------------------- */

    /* Link -------------------------- */
    public static function Link($idcustomer, $id){
        require('../lib/connect.php');
        $sql = "UPDATE vehicles SET idcustomer = :idcustomer, updated_at = now() WHERE id = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$idcustomer, $id]);
        $row = $stmt->fetch();
        $pdo = null;

        return $row;
    }

    public static function Unlink($id){
        require('../lib/connect.php');
        $sql = "UPDATE vehicles SET idcustomer = null, updated_at = now() WHERE id = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        $pdo = null;

        return $row;
    }
    /* Link -------------------------- */
}