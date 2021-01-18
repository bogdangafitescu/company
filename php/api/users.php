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
        case 'login':
            userLogin($_POST['username'], $_POST['password'], $db);
            break;
        case 'logout':
            userLogout($_POST['sid'], $db);
            break;
        case 'get_all':
            if (authenticateUser($_POST['token'], $db)) {
                listUsers($db);
            }
            break;
        case 'save':
            if (authenticateUser($_POST['token'], $db)) {
                if (isset($_POST['uid'])) {
                    editUser($_POST['uid'], $_POST['name'], $_POST['pass'], $db);
                } else {
                    addUser($_POST['name'], $_POST['pass'], $db);
                }
            }
            break;
        case 'delete':
            if (authenticateUser($_POST['token'], $db)) {
                deleteUser($_POST['uid'], $db);
            }
            break;
    }
}


/**
 * @param string $username
 * @param string $password
 * @param mysqli $db - database connection
 *
 * User login service method
 */
function userLogin($username, $password, $db)
{
    $username = $db->real_escape_string($username);
    $password = $db->real_escape_string($password);

    $query = "SELECT id FROM utilizatori WHERE nume='$username' AND parola='$password'";
    $result = $db->query($query);

    if (mysqli_num_rows($result) > 0) {
        $response['status'] = 'loggedin';
        $response['user'] = $username;
        $response['id'] = md5(uniqid());
        updateUserSession($result->fetch_assoc()['id'], $response['id'], $db);
    } else {
        $response['status'] = 'error';
    }
    $result->free();

    echo json_encode($response);
}

/**
 * @param string $session - logged in user session id
 * @param mysqli $db - database connection
 *
 * User logout service method
 */
function userLogout($session, $db)
{
    $session = $db->real_escape_string($session);

    $query = "UPDATE utilizatori SET sesiune='' WHERE sesiune='$session'";
    $status = $db->query($query) ? 'success' : 'error';

    echo json_encode(array('status' => $status));
}

/**
 * @param mysqli $db - database connection
 *
 * Retrieves all users from database
 */
function listUsers($db)
{
    $response = [];
    $query = "SELECT id, nume, parola FROM utilizatori";
    if ($result = $db->query($query)) {
        while ($row = $result->fetch_assoc()) {
            $response[] = array('name' => $row['nume'], 'pass' => $row['parola'], 'uid' => intval($row['id']));
        }

        $result->free();
    }

    echo json_encode($response);
}

/**
 * @param int $uid - user id
 * @param string $session - logged in user session id
 * @param mysqli $db - database connection
 */
function updateUserSession($uid, $session, $db)
{
    $session = $db->real_escape_string($session);
    $query = "UPDATE utilizatori SET sesiune='$session' WHERE id=" . intval($uid);
    $db->query($query);
}

/**
 * @param string $token - logged in user session id
 * @param mysqli $db - database connection
 * @return bool
 */
function authenticateUser($token, $db)
{
    $token = $db->real_escape_string($token);
    $query = "SELECT id FROM utilizatori WHERE sesiune='$token'";
    $result = $db->query($query);

    if (mysqli_num_rows($result) > 0) {
        return true;
    }

    return false;
}

/**
 * @param string $name - username
 * @param string $pass - password
 * @param mysqli $db - database connection
 */
function addUser($name, $pass, $db)
{
    $response = [];
    $name = $db->real_escape_string($name);
    $pass = $db->real_escape_string($pass);
    $query = "INSERT INTO utilizatori(nume, parola) VALUES('$name', '$pass')";
    if ($db->query($query)) {
        $response['uid'] = $db->insert_id;
    }

    echo json_encode($response);
}

/**
 * @param int $uid - user id
 * @param string $name - username
 * @param string $pass - password
 * @param mysqli $db - database connection
 */
function editUser($uid, $name, $pass, $db)
{
    $name = $db->real_escape_string($name);
    $pass = $db->real_escape_string($pass);

    $query = "UPDATE utilizatori SET nume='$name', parola='$pass' WHERE id=" . intval($uid);
    $status = $db->query($query) ? 'success' : 'error';

    echo json_encode(array('status' => $status));
}

/**
 * @param int $uid - user id
 * @param mysqli $db - database connection
 */
function deleteUser($uid, $db)
{
    $query = "DELETE FROM utilizatori WHERE id=" . intval($uid);
    $status = $db->query($query) ? 'success' : 'error';

    echo json_encode(array('status' => $status));
}