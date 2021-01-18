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
            listOffices($db);
            break;
        case 'save':
            if (isset($_POST['oid'])) {
                editOffice($_POST['oid'], $_POST['name'], $db);
            } else {
                addOffice($_POST['name'], $db);
            }
            break;
        case 'delete':
            deleteOffice($_POST['oid'], $db);
            break;
    }
}


/**
 * @param mysqli $db - database connection
 *
 * Retrieves all offices from database
 */
function listOffices($db)
{
    $response = [];
    $query = "SELECT id, nume FROM birouri";
    if ($result = $db->query($query)) {
        while ($row = $result->fetch_assoc()) {
            $response[] = array('name' => $row['nume'], 'oid' => intval($row['id']));
        }

        $result->free();
    }

    echo json_encode($response);
}

/**
 * @param string $name - office name
 * @param mysqli $db - database connection
 */
function addOffice($name, $db)
{
    $response = [];
    $name = $db->real_escape_string($name);
    $query = "INSERT INTO birouri(nume) VALUES('$name')";
    if ($db->query($query)) {
        $response['oid'] = $db->insert_id;
    }

    echo json_encode($response);
}

/**
 * @param int $oid - office id
 * @param string $name - office name
 * @param mysqli $db - database connection
 */
function editOffice($oid, $name, $db)
{
    $name = $db->real_escape_string($name);
    $query = "UPDATE birouri SET nume='$name' WHERE id=" . intval($oid);
    $status = $db->query($query) ? 'success' : 'error';

    echo json_encode(array('status' => $status));
}

/**
 * @param int $oid - office id
 * @param mysqli $db - database connection
 */
function deleteOffice($oid, $db)
{
    $query = "DELETE FROM birouri WHERE id=" . intval($oid);
    $status = $db->query($query) ? 'success' : 'error';

    echo json_encode(array('status' => $status));
}