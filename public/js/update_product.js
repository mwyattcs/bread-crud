// Citation for this code:
// Date: 3/2/23
// Based on NodeJS Starter App, written for CS 340
// https://github.com/osu-cs340-ecampus/nodejs-starter-app


// Get the objects we need to modify
let updateProductForm = document.getElementById('update-product-form-ajax');

// Modify the objects we need
updateProductForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputName = document.getElementById("mySelect");
    let inputCategory = document.getElementById("input-category-update");

    // Get the values from the form fields
    let nameValue = inputName.value;
    let categoryValue = inputCategory.value;

    // Put our data we want to send in a javascript object
    let data = {
        name: nameValue,
        category: categoryValue,
    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-product-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, nameValue);
            console.log(xhttp.response, nameValue)

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function updateRow(data, product_id){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("product-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == product_id) {

            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of homeworld value
            let td = updateRowIndex.getElementsByTagName("td")[5];

            // Reassign homeworld to our value we updated to
            td.innerHTML = parsedData[0].category_name; 
       }
    }
}


