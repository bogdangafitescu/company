<?php

class DbConnection
{
    private $_host = "db";
    private $_username = "root";
    private $_password = "root";
    private $_database = "test_db";
    private $_con;

    public function __construct()
    {
        $this->_con = new mysqli($this->_host, $this->_username, $this->_password, $this->_database);

        if (mysqli_connect_errno()) {
            die("Eroare conexiune db: " . mysqli_connect_errno());
        }
    }

    public function getConnection()
    {
        return $this->_con;
    }

    public function __destruct()
    {
        mysqli_close($this->_con);
    }
}