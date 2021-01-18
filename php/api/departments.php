<?php
session_start();

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

require_once '../helpers/DbConnection.php';

if (!isset($_POST)) die();

$response = [];

$db_connection = new DbConnection();
$db = $db_connection->getConnection();

if (isset($_POST['action'])) {
    switch ($_POST['action']) {
        case 'get_all':
            listDepartments($db);
            break;
        case 'save':
            if (isset($_POST['did'])) {
                editDepartment($_POST['did'], $_POST['name'], $_POST['offices'], $db);
            } else {
                addDepartment($_POST['name'], $_POST['offices'], $db);
            }
            break;
        case 'delete':
            deleteDepartment($_POST['did'], $db);
            break;
    }
}


/**
 * @param mysqli $db - database connection
 *
 * Retrieves all departments from database
 */
function listDepartments($db)
{
    $response = [];
    $query = "SELECT d.id, d.nume, GROUP_CONCAT(b.id ORDER BY b.id SEPARATOR ', ') AS bids, GROUP_CONCAT(b.nume ORDER BY b.id SEPARATOR ', ') AS bnume
                FROM departamente AS d 
                LEFT JOIN birouri_departamente AS bd ON d.id=bd.did 
                LEFT JOIN birouri AS b ON b.id=bd.bid GROUP BY d.id ORDER BY d.id";
    if ($result = $db->query($query)) {
        while ($row = $result->fetch_assoc()) {
            $offices = [];
            if($row['bids'] != '') {
                $bids = explode(', ', $row['bids']);
                $bnames = explode(', ', $row['bnume']);
                foreach ($bids as $k => $v) {
                    $offices[] = array('oid' => $v, 'name' => $bnames[$k]);
                }
            }
            $response[] = array('name' => $row['nume'], 'did' => intval($row['id']), 'offices' => $offices);
        }

        $result->free();
    }

    echo json_encode($response);
}

/**
 * @param string $name - department name
 * @param mysqli $db - database connection
 */
function addDepartment($name, $offices, $db)
{
    $response = [];
    $name = $db->real_escape_string($name);
    $query = "INSERT INTO departamente(nume) VALUES('$name')";
    if ($db->query($query)) {
        $response['did'] = $db->insert_id;

        if (!empty($offices)) {
            foreach (explode(', ', $offices) as $k => $bid) {
                $query = "INSERT INTO birouri_departamente(bid, did) VALUES($bid, " . $response['did'] . ")";
                $db->query($query);
            }
        }
    }

    echo json_encode($response);
}

/**
 * @param int $did - department id
 * @param string $name - department name
 * @param mysqli $db - database connection
 */
function editDepartment($did, $name, $offices, $db)
{
    $name = $db->real_escape_string($name);
    $query = "UPDATE departamente SET nume='$name' WHERE id=" . intval($did);
    $status = $db->query($query) ? 'success' : 'error';

    if ($status == "success" && !empty($offices)) {
        $query  = "DELETE FROM birouri_departamente WHERE did=" . intval($did);
        if (!$db->query($query)) {
            $status = "error";
        }
        if ($status == "success") {
            foreach (explode(', ', $offices) as $k => $bid) {
                $query = "INSERT INTO birouri_departamente(bid, did) VALUES($bid, $did);";
                if (!$db->query($query)) {
                    $status = "error";
                }
            }
        }
    }

    echo json_encode(array('status' => $status));
}

/**
 * @param int $did - department id
 * @param mysqli $db - database connection
 */
function deleteDepartment($did, $db)
{
    $query = "DELETE FROM departamente WHERE id=" . intval($did);
    $status = $db->query($query) ? 'success' : 'error';
    if ("success" == $status) {
        $query = "DELETE FROM birouri_departamente WHERE did=" . intval($did);
        if (!$db->query($query)) {
            $status = "error";
        }
    }

    echo json_encode(array('status' => $status));
}