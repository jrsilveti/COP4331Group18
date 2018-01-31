
var urlBase = ' http://18.219.40.125/cmanager/API';
var extension = "php";

var userId = 0;
var firstName = "";
var lastName = "";

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	var login = document.getElementById("loginName").value;
	var password = document.getElementById("loginPassword").value;
    
	document.getElementById("loginResult").innerHTML = "";
	
	var jsonPayload = '{"login" : "' + login + '", "password" : "' + md5(password) + '"}';
	var url = urlBase + '/Login.' + extension;
	
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, false);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.send(jsonPayload);
		
		var jsonObject = JSON.parse( xhr.responseText );
		
		userId = jsonObject.id;
		
		if( userId < 1 )
		{
			document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
			return;
		}
		
		firstName = jsonObject.firstName;
		lastName = jsonObject.lastName;

		document.getElementById("userName").innerHTML = firstName + " " + lastName;
		
		document.getElementById("loginName").value = "";
		document.getElementById("loginPassword").value = "";
		
		hideOrShow( "loggedInDiv", true);
		hideOrShow( "accessUIDiv", true);
        hideOrShow("loginDiv", false);

        searchContact();
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}
	
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";	

    var tableBody = document.getElementById("listContacts").getElementsByTagName('tbody')[0];
    tableBody.innerHTML = "";
    
	hideOrShow( "loggedInDiv", false);
	hideOrShow( "accessUIDiv", false);
	hideOrShow( "loginDiv", true);
}

function hideOrShow( elementId, showState )
{
	var vis = "visible";
	var dis = "block";
	if( !showState )
	{
		vis = "hidden";
		dis = "none";
	}
	
	document.getElementById( elementId ).style.visibility = vis;
	document.getElementById( elementId ).style.display = dis;
}

function addContact()
{
    var newContact = document.getElementById("contactText").value;
    var newPhone = document.getElementById("phoneNumber").value;
    if (newContact != "" && newPhone != "") {

        var newContactNumber = document.getElementById("phoneNumber").value;
        document.getElementById("contactAddResult").innerHTML = "";

        var jsonPayload = '{"Name" : "' + newContact + '", "Number" : "' + newContactNumber + '", "User_ID" : "' + userId + '"}';
        var url = urlBase + '/AddContact.' + extension;

        
        var xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
        try {
            xhr.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    alert(newContact + " has been successfully added!");
                    document.getElementById("contactText").value = "";
                    document.getElementById("phoneNumber").value = "";
                }
            };

            xhr.send(jsonPayload);
            document.getElementById("searchText").value = "";
            searchContact();
        }
        catch (err) {
            document.getElementById("contactAddResult").innerHTML = err.message;
        }

    }
    else
        alert("Stop! please enter a valid name and/or phone number.");
}

function searchContact() {
    var srch = document.getElementById("searchText").value;
    document.getElementById("contactSearchResult").innerHTML = "";

    //var contactList = document.getElementById("contactList");
    //contactList.innerHTML = "";

    var jsonPayload = '{"search" : "' + srch + '", "userId" : "' + userId + '"}';
    var url = urlBase + '/SearchContact.' + extension;

    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {

                var jsonObject = JSON.parse(xhr.responseText);

                var table = document.getElementById("listContacts");
                var tableBody = document.getElementById("listContacts").getElementsByTagName('tbody')[0];
                tableBody.innerHTML = "";

                var i;
                for (i = 0; i < jsonObject.results.length; i += 3) {

                    var nameData = jsonObject.results[i];
                    var phoneData = jsonObject.results[i + 1];

                    var tr = document.createElement("tr");
                    tr.innerHTML = "<td>" + nameData + "</td><td>" + phoneData + "</td><td><button type = 'button' id = 'delButton' onclick='deleteContact(this)'>DELETE</button></td>";
                    tableBody.appendChild(tr);

                    /*
                    var tableRows = document.getElementById("listContacts").tBodies[0].rows.length;
                    var newRow = tableBody.insertRow(tableRows);

                    var name = newRow.insertCell(0);
                    var phone = newRow.insertCell(1);
                    var del = newRow.insertCell(2);

                    var nameData = jsonObject.results[i];
                    var phoneData = jsonObject.results[i + 1];
                    var delButton = document.createElement("button"); 

                    var btnName = "button" + jsonObject.results[i + 2];
                    delButton.name = btnName;
                    delButton.innerHTML = "DELETE";
                    delButton.onclick = deleteContact;

                    

                    name.innerHTML = nameData;
                    phone.innerHTML = phoneData
                    del.appendChild(delButton);
                    */

                }
                
            }
        };
        xhr.send(jsonPayload);
    }
    catch (err) {
        document.getElementById("contactSearchResult").innerHTML = err.message;
    }
}

function deleteContact(r) {
    document.getElementById("contactSearchResult").innerHTML = "";

    var rowIndex = r.parentNode.parentNode.rowIndex;
    var table = document.getElementById("listContacts");
    var contactName = table.rows[rowIndex].cells[0].innerHTML;

    var jsonPayload = '{"search" : "' + contactName + '"}';
    var url = urlBase + '/DeleteContact.' + extension;

    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        table.deleteRow(rowIndex);
        alert(contactName + " has been successfully deleted!");
        xhr.send(jsonPayload);
    }
    catch (err) {
        document.getElementById("contactSearchResult").innerHTML = err.message;
    }

    searchContact();
}

function openRegistration() {
    hideOrShow('loginDiv', false);
    hideOrShow('registerDiv', true);
}

function cancelRegistration() {
    hideOrShow('loginDiv', true);
    hideOrShow('registerDiv', false);
}

function addUser() {
    var newUserName = document.getElementById("newUserName").value;
    var newUserPass = document.getElementById("newUserPass").value;
    var hashPass = md5(newUserPass);
    var newFirst = document.getElementById("newUserFirst").value;
    var newLast = document.getElementById("newUserLast").value;
    if (newUserName != "" && newUserPass != "" && newFirst !="" && newLast != "") {

        document.getElementById("userAddResult").innerHTML = "";

        var jsonPayload = '{"FirstName" : "' + newFirst + '", "LastName" : "' + newLast + '", "Login" : "' + newUserName + '", "Password" : "' + hashPass +'"}';
        var url = urlBase + '/AddUser.' + extension;


        var xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
        try {
            xhr.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    alert("Your account has been successfully created!");
                    cancelRegistration();
                }
            };

            xhr.send(jsonPayload);
        }
        catch (err) {
            document.getElementById("userAddResult").innerHTML = err.message;
        }


    }
    else
        alert("Stop! Please make sure all fields are completed.");
}
