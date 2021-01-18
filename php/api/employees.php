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
            listEmployees($db);
            break;
        case 'save':
            if (isset($_POST['eid'])) {
                editEmployee($_POST, $db);
            } else {
                addEmployee($_POST, $db);
            }
            break;
        case 'delete':
            deleteEmployee($_POST['eid'], $db);
            break;
    }
}


/**
 * @param mysqli $db - database connection
 *
 * Retrieves all employees from database
 */
function listEmployees($db)
{
    $response = [];
    $query = "SELECT s.id, s.nume, s.prenume, s.email, DATE_FORMAT(s.data_nasterii, '%c/%e/%Y') as data_nasterii, s.manager, 
                d.id as did, d.nume as departament, b.id as bid, b. nume as birou 
              FROM salariati as s 
                LEFT JOIN departamente as d ON s.departament = d.id 
                LEFT JOIN  birouri as b ON s.birou = b.id";
    if ($result = $db->query($query)) {
        while ($row = $result->fetch_assoc()) {
            $response[] = array(
                'eid'         => $row['id'],
                'first_name'  => $row['nume'],
                'last_name'   => $row['prenume'],
                'email'       => $row['email'],
                'birth_date'  => $row['data_nasterii'],
                'did'         => $row['did'],
                'department'  => $row['departament'],
                'oid'         => $row['bid'],
                'office'      => $row['birou'],
                'is_manager'  => $row['manager'] == 1
            );
        }

        $result->free();
    }

    echo json_encode($response);
}

/**
 * @param array $params - employee data
 * @param mysqli $db - database connection
 */
function addEmployee($params, $db)
{
    $response = [];
    $firstname = $db->real_escape_string($params['firstname']);
    $lastname = $db->real_escape_string($params['lastname']);
    $email = $db->real_escape_string($params['email']);
    $birth_date = date("Y-m-d", strtotime($params['birth_date']));
    $department = intval($params['department']);
    $office = intval($params['office']);
    $is_manager = intval($params['is_manager']);

    $query = "INSERT INTO salariati(nume, prenume, email, data_nasterii, departament, birou, manager) 
                VALUES('$firstname', '$lastname', '$email', '$birth_date', $department, $office, $is_manager)";
    if ($db->query($query)) {
        $response['eid'] = $db->insert_id;
    }

    echo json_encode($response);
}

/**
 * @param array $params - employee data
 * @param mysqli $db - database connection
 */
function editEmployee($params, $db)
{
    $firstname = $db->real_escape_string($params['firstname']);
    $lastname = $db->real_escape_string($params['lastname']);
    $email = $db->real_escape_string($params['email']);
    $birth_date = date("Y-m-d", strtotime($params['birth_date']));
    $department = intval($params['department']);
    $office = intval($params['office']);
    $is_manager = intval($params['is_manager']);

    $query = "UPDATE salariati SET nume='$firstname', prenume='$lastname', email='$email', data_nasterii='$birth_date', 
                departament='$department', birou='$office', manager='$is_manager'
                WHERE id=" . intval($_POST['eid']);
    $status = $db->query($query) ? 'success' : 'error';

    echo json_encode(array('status' => $status));
}

/**
 * @param int $eid - employee id
 * @param mysqli $db - database connection
 */
function deleteEmployee($eid, $db)
{
    $query = "DELETE FROM salariati WHERE id=" . intval($eid);
    $status = $db->query($query) ? 'success' : 'error';

    echo json_encode(array('status' => $status));
}