<?php
	
	
	$inData = getRequestInfo();
	
	$searchResults = "";
	$searchCount = 0;
	
	$conn = new mysqli("sql9.freesqldatabase.com", "sql9217457", "gXZbzmK3k8", "sql9217457");
	
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$value = mysqli_real_escape_string($conn, $inData[search]);
		$sql = "DELETE FROM Contacts WHERE NAME = '" . $value . "'" ;

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
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $searchResults )
	{
		$retValue = '{"results":[' . $searchResults . '],"error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>