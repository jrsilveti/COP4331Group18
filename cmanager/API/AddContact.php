<?php
	$inData = getRequestInfo();
	
	$conn = new mysqli("sql9.freesqldatabase.com", "sql9217457", "gXZbzmK3k8", "sql9217457");
	
	$contact = mysqli_real_escape_string($conn, $inData[Name]);
	$phoneNumber = mysqli_real_escape_string($conn, $inData[Number]);
	$userId = mysqli_real_escape_string($conn, $inData[User_ID]);	
	
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$sql = "INSERT INTO Contacts (User_ID,Name, phoneNumber) VALUES (" . $userId . ",'" . $contact ."','" . $phoneNumber . "')";

		if( $result = $conn->query($sql) != TRUE )
		{
			returnWithError( $conn->error );
		}
		$conn->close();
	}

	returnWithError("");

	function returnWithInfo( $contact, $phoneNumber, $userId )
	{
		$retValue = '{"contact":' . $contact . ',"phoneNumber":"' . $phoneNumber . '","userID":"' . $userId . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
?>