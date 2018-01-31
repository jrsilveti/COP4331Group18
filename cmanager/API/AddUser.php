<?php
	$inData = getRequestInfo();
	
	$conn = new mysqli("sql9.freesqldatabase.com", "sql9217457", "gXZbzmK3k8", "sql9217457");
	
	
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$firstName = mysqli_real_escape_string($conn,$inData[FirstName]);
		$lastName = mysqli_real_escape_string($conn,$inData[LastName]);
		$login = mysqli_real_escape_string($conn,$inData[Login]);
		$password = mysqli_real_escape_string($conn,$inData[Password]);


		$sql = "INSERT INTO Users (FirstName,LastName,Login,Password) VALUES ('" . $firstName . "','" . $lastName ."','" . $login . "','" .$password. "')";		
		
		if( $result = $conn->query($sql) != TRUE )
		{
			returnWithError( $conn->error );
		}
		$conn->close();
	}

	returnWithError("");

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