<?php
class Database
{
    private $host = "db_token-service";
    private $db_name = "testdb";
    private $username = "root";
    private $password = "rootpassword";
    public $conn;

    public function getConnection()
    {
        $this->conn = null;

        try {
            $this->conn = new PDO("mysql:host=" . $this->host . ";dbname=" . $this->db_name, $this->username, $this->password);
            $this->conn->exec("set names utf8");
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
            $createTableSQL = "
                CREATE TABLE IF NOT EXISTS token (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    user_id INT NOT NULL,
                    token TEXT NOT NULL,
                    expiration DATETIME NOT NULL
                )
            ";
            $this->conn->exec($createTableSQL);
        } catch(PDOException $exception) {
            echo "Connection error: " . $exception->getMessage();
        }

        return $this->conn;
    }
}
