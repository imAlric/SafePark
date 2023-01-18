<?php
class User{
    /* DAO -------------------------- */
    public static function Select($email)
    {
        require('../lib/connect.php');
        $sql = "SELECT users.*, staff.* FROM users INNER JOIN staff ON (users.idstaff = staff.id) WHERE email = :email AND users.status NOT LIKE 'X'";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$email]);
        $row = $stmt->fetch();
        $pdo = null;

        return $row;
    }

    public static function SelectParam($param)
    {
        require('../lib/connect.php');
        $sql = "SELECT users.*, staff.* FROM users INNER JOIN staff ON (users.idstaff = staff.id) $param AND users.status NOT LIKE 'X'";
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        $row = $stmt->fetch();
        $pdo = null;

        return $row;
    }

    public static function SelectColParam($data1, $data2, $param)
    {
        require('../lib/connect.php');
        $sql = "SELECT users.$data1, staff.$data2 FROM users INNER JOIN staff ON (users.idstaff = staff.id) $param AND users.status NOT LIKE 'X'";
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        $row = $stmt->fetch();
        $pdo = null;

        return $row;
    }
    
    public static function GetIP(){
        $ip = isset($_SERVER['HTTP_CLIENT_IP']) 
            ? $_SERVER['HTTP_CLIENT_IP'] 
            : (isset($_SERVER['HTTP_X_FORWARDED_FOR']) 
            ? $_SERVER['HTTP_X_FORWARDED_FOR'] 
            : $_SERVER['REMOTE_ADDR']);

        return $ip;
    }
    /* DAO -------------------------- */

    /* CRUD -------------------------- */
    public static function Check($password, $hash)
    {
        return password_verify($password, $hash);
    }
    /* CRUD -------------------------- */
}