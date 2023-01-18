<?php
class Sector{
    /* DAO -------------------------- */
    public static function Select($name){
        require('../lib/connect.php');
        $sql = "SELECT * FROM sectors WHERE name = :name AND status NOT LIKE 'X'";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$name]);
        $row = $stmt->fetchAll();
        $pdo = null;

        return $row;
    }

    public static function SelectParam($param){
        require('../lib/connect.php');
        $sql = "SELECT * FROM sectors $param AND status NOT LIKE 'X'";
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        $row = $stmt->fetch();
        $pdo = null;

        return $row;
    }

    public static function SelectColParam($data, $param){
        require('../lib/connect.php');
        $sql = "SELECT $data FROM sectors $param AND status NOT LIKE 'X'";
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        $row = $stmt->fetch();
        $pdo = null;

        return $row;
    }

    public static function SelectAll(){
        require('../lib/connect.php');
        $sql = "SELECT * FROM sectors WHERE status NOT LIKE 'X' ORDER BY name";
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        $row = $stmt->fetchAll();
        $pdo = null;

        return $row;
    }

    public static function SelectCategories(){
        require('../lib/connect.php');
        $sql = "SELECT * FROM categories WHERE status NOT LIKE 'X' ORDER BY priority";
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        $row = $stmt->fetchAll();
        $pdo = null;

        return $row;
    }

    public static function SelectCategoryFrom($id){
        require('../lib/connect.php');
        $sql = "SELECT * FROM categories WHERE id = :id AND status NOT LIKE 'X' ORDER BY priority";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        $pdo = null;

        return $row;
    }
    /* DAO -------------------------- */

    /* CRUD -------------------------- */
    public static function Create($name, $category, $quantity){
        require('../lib/connect.php');
        $sql = "INSERT INTO sectors (name, idcategory, status) VALUES (:name, :idcategory, 'A') RETURNING id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$name, $category]);

        $row = $stmt->fetch();
        $idsector = $row['id'];

        for($i = 1; $i <= $quantity; $i++){
            $sql = "INSERT INTO parkingspots (number, idsector, status) VALUES (:number, :idsector, 'V') RETURNING id";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$i, $idsector]);
        }
        $pdo = null;

        return $row;
    }
    /* CRUD -------------------------- */
}

class Spot{
    /* DAO -------------------------- */
    public static function SelectAllFrom($id){
        require('../lib/connect.php');
        $sql = "SELECT * FROM parkingspots WHERE idsector = :id AND status NOT LIKE 'X' ORDER BY number";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$id]);
        $row = $stmt->fetchAll();
        $pdo = null;

        return $row;
    }

    public static function SelectParam($param){
        require('../lib/connect.php');
        $sql = "SELECT * FROM parkingspots $param AND status NOT LIKE 'X'";
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        $row = $stmt->fetch();
        $pdo = null;

        return $row;
    }

    public static function SelectColParam($data, $param){
        require('../lib/connect.php');
        $sql = "SELECT $data FROM parkingspots $param AND status NOT LIKE 'X'";
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        $row = $stmt->fetch();
        $pdo = null;

        return $row;
    }
    
    public static function SelectAllParam($param){
        require('../lib/connect.php');
        $sql = "SELECT * FROM parkingspots $param AND status NOT LIKE 'X' ORDER BY number";
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        $row = $stmt->fetchAll();
        $pdo = null;

        return $row;
    }
    /* DAO -------------------------- */

    /* CRUD -------------------------- */
    public static function Status($status, $id){
        require('../lib/connect.php');
        $sql = "UPDATE parkingspots SET status = :status, updated_at = now() WHERE id = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$status, $id]);
        $row = $stmt->fetch();
        $pdo = null;

        return $row;
    }
    /* CRUD -------------------------- */
}