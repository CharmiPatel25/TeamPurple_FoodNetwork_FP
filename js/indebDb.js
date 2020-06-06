
    function idbOK() {
    return "indexedDB" in window;
}

var db;

$(document).ready(function() {

    //No support? Go in the corner and pout.
    if(!idbOK()) return;

    var openRequest = indexedDB.open("ora_idb7",1);

    openRequest.onupgradeneeded = function(e) {
        var thisDB = e.target.result;
    console.log("running onupgradeneeded");

        if(!thisDB.objectStoreNames.contains("people")) {
            var peopleOS = thisDB.createObjectStore("people",
                {keyPath: "email"});
    peopleOS.createIndex("name", "name",
                {unique:false});
    peopleOS.createIndex("hobbies", "hobbies",
                {unique:false, multiEntry: true});
    peopleOS.createIndex("comments", "comments",
                {unique:false, multiEntry: true});
      peopleOS.createIndex("gender", "gender",
                {unique:false});
      peopleOS.createIndex("birthdate", "birthdate",
                {unique:false});

}

}

    openRequest.onsuccess = function(e) {
        console.log("running onsuccess");
    db = e.target.result;

    //Start listening for button clicks
    $("#addPerson").on("click", addPerson);
    $("#search").on("click", searchPeople);
    $("#clear").on("click", clear);

}

    openRequest.onerror = function(e) {
        console.log("onerror!");
    console.dir(e);
}

});

function addPerson(e) {
    var name = $("#name").val();
    var email = $("#email").val();
    var hobbies = $("#hobbies").val();

	var gender = $("input:radio[name=option]:checked").val();
	var comment = $("#comment").val();

	var month = document.getElementById("birth_month");
var year = document.getElementById("birth_year");

var birthmonth = month.options[month.selectedIndex].text;
var birthyear = year.options[year.selectedIndex].value;
var birthdate =  birthmonth.concat(birthyear);

    if(hobbies != "") hobbies = hobbies.split(",");

    console.log("About to add "+name+"/"+email);

    //Get a transaction
    //default for OS list is all, default for type is read
    var transaction = db.transaction(["people"],"readwrite");
    //Ask for the objectStore
    var store = transaction.objectStore("people");

    //Define a person
    var person = {
        name:name,
    email:email,
    hobbies:hobbies,
    gender:gender,
    comment:comment,
    birthdate:birthdate,
    created:new Date().getTime()
}

//Perform the add
var request = store.add(person);

    request.onerror = function(e) {
        console.log("Error", e.target.error.name);
    //some type of error handler
}

    request.onsuccess = function(e) {
        alert("User Registered !!");
        window.location.href = 'index.html';

}
}

function searchPeople(e) {


    var hobby = $("#hobby").val();

    if(hobby == "") return;

    var range = IDBKeyRange.only(hobby);

    var transaction = db.transaction(["people"],"readonly");
    var store = transaction.objectStore("people");
    var index = store.index("hobbies");

    var s = "";

    index.openCursor(range).onsuccess = function(e) {
        var cursor = e.target.result;
        if (cursor) {

        s +=  "Category : " + cursor.key + " " +"\n";
            for (var field in cursor.value) {

                s += field + "=" + cursor.value[field] + " " + "\n";
}
            s += "" + "\n";
            alert(s);
cursor.continue();
        }
    }

transaction.oncomplete = function () {
    //no results?
    if (s === "") s = "<p>No results.</p>";
    $("#results").html(s);
}

}

function clear() {
    document.getElementById('name').value = " ";
    document.getElementById('email').value = " ";
    document.getElementById('hobbies').value = " ";
    document.getElementById("maleRd").checked = false;
    document.getElementById("femaleRd").checked = false;
    document.getElementById("birth_month").selectedIndex = -1;
    document.getElementById("birth_year").selectedIndex = -1;
    document.getElementById('comment').value = " ";
    document.getElementById("dataCheck").checked = false;
    var text = document.getElementsByTagName("button").name;
}



//progress bar function

$("#pro-form input").keyup(function () {

    var numValid = 0;
    $("#pro-form input[required]").each(function () {
        if (this.validity.valid) {
            numValid++;
        }
    });

    var progress = $("#progress"),
        progressMessage = $("#progress-message");

    if (numValid == 0) {
        progress.attr("value", "0");
        progressMessage.text("The form, it wants you.");
    }
    if (numValid == 1) {
        progress.attr("value", "25");
        progressMessage.text("There you go, great start!");
    }
    if (numValid == 2) {
        progress.attr("value", "40");
        progressMessage.text("Nothing can stop you now.");
    }
    if (numValid == 3) {
        progress.attr("value", "55");
        progressMessage.text("You're basically a hero, right?");
    }
    if (numValid == 4) {
        progress.attr("value", "100");
        progressMessage.text("They are going to write songs about you.");
    }


});


//login
function login(e) {

    var user = $("#userid").val();

    if (user == "") return;

    var range = IDBKeyRange.only(user);

    var transaction = db.transaction(["people"], "readonly");
    var store = transaction.objectStore("people");
    var index = store.index("name");

    var s = "";
    var hobby = $("#hobby").val();

    index.openCursor(range).onsuccess = function (e) {
        var cursor = e.target.result;
        if (cursor) {

            for (var field in cursor.value) {
                

                if (field.localeCompare("name")) {
                    if (user.localeCompare(cursor.value[name])) 
                    {
                        if (cursor.value.hobbies.includes("breakfast"))
                        {
                            alert("Welcome  " + " " + user);
                            window.location.href = 'rBreakfastMenu.html';

                            break;
                        }
                        if (cursor.value.hobbies.includes("lunch")) {
                            alert("Welcome  " + " " +  user);
                            window.location.href = 'rLunchMenu.html';
                            break;
                        }
                        if (cursor.value.hobbies.includes("dinner")) {
                            alert("Welcome  " + " " + user);
                            window.location.href = 'rDinnerMenu.html';
                            break;
                        }
                       // break;
                    }


                }
            }
        }
        if (cursor == null) {
            alert("Please register to continue !")
            window.location.href = 'register.html';
        }
    }
}

