<?php
class Staff{
    /* DAO -------------------------- */
    public static function SelectAll($limit, $offset, $status)
    {
        require('../lib/connect.php');
        $sql = "SELECT staff.*, users.email FROM staff LEFT JOIN users ON (staff.id = users.idstaff) $status role NOT LIKE '%Gerente%' AND role NOT LIKE '%Admin%' AND role NOT LIKE '%Supervisor%' AND staff.status NOT LIKE 'X' ORDER BY fullname LIMIT $limit OFFSET $offset";
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        $row = $stmt->fetchAll();
        $pdo = null;

        return $row;
    }

    public static function SelectParam($param)
    {
        require('../lib/connect.php');
        $sql = "SELECT * FROM staff $param AND status NOT LIKE 'X'";
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        $row = $stmt->fetch();
        $pdo = null;

        return $row;
    }

    public static function SelectColParam($data, $param)
    {
        require('../lib/connect.php');
        $sql = "SELECT $data FROM staff $param AND status NOT LIKE 'X'";
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        $row = $stmt->fetch();
        $pdo = null;

        return $row;
    }

    public static function SelectAllParam($param)
    {
        require('../lib/connect.php');
        $sql = "SELECT staff.*, users.email FROM staff LEFT JOIN users ON (staff.id = users.idstaff) $param AND staff.status NOT LIKE 'X' ORDER BY fullname";
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        $row = $stmt->fetchAll();
        $pdo = null;

        return $row;
    }

    public static function Count($status)
    {
        require('../lib/connect.php');
        $sql = "SELECT count(*) FROM staff $status status NOT LIKE 'X'";
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        $row = $stmt->fetch();
        $pdo = null;

        return $row;
    }
    /* DAO -------------------------- */

    /* CRUD -------------------------- */
    public static function Create($email, $password, $fullname, $cpf, $role){
        require('../lib/connect.php');
        $sql = "INSERT INTO staff (fullname, cpf, role, status) VALUES (:fullname, :cpf, :role, 'A') RETURNING id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$fullname, $cpf, $role]);
        $row = $stmt->fetch();

        if($role !== 'Manobrista'){
            $permlevel = 0;
            $hash = password_hash($password, PASSWORD_DEFAULT);

            $sql = "INSERT INTO users (email, password, permlevel, idstaff, status) VALUES (:email, :password, :permlevel, :idstaff, 'A') RETURNING id";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$email, $hash, $permlevel, $row['id']]);
            $row = $stmt->fetch();
        }
        $pdo = null;

        return $row;
    }

    public static function Update($email, $password, $fullname, $cpf, $role, $id){
        require('../lib/connect.php');
        $sql = "UPDATE staff SET fullname = :fullname, cpf = :cpf, role = :role, updated_at = now() WHERE id = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$fullname, $cpf, $role, $id]);
        $row = $stmt->fetch();

        if($role !== 'Manobrista'){
            $row = User::SelectParam("WHERE idstaff = $id");
        
            $hash = $password ? password_hash($password, PASSWORD_DEFAULT) : $row['password'];

            $sql = "UPDATE users SET email = :email, password = :password, updated_at = now() WHERE idstaff = :id";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$email, $hash, $id]);
            $row = $stmt->fetch();
        }
        $pdo = null;

        return $row;
    }

    public static function Status($status, $id){
        require('../lib/connect.php');
        $sql = "UPDATE staff SET status = :status, updated_at = now() WHERE id = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$status, $id]);
        $row = $stmt->fetch();
        $pdo = null;

        return $row;
    }

    public static function Delete($id){
        require('../lib/connect.php');
        $sql = "UPDATE staff SET status = 'X', updated_at = now() WHERE id = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        $pdo = null;

        return $row;
    }
    /* CRUD -------------------------- */
}