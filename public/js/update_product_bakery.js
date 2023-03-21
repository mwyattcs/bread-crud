// Citation for this code:
// Date: 3/2/23
// Based on NodeJS Starter App, written for CS 340
// https://github.com/osu-cs340-ecampus/nodejs-starter-app


// Get the objects we need to modify
let updateProductBakeryForm = document.getElementById('update-product-bakery-form-ajax');

// Modify the objects we need
updateProductBakeryForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputName = document.getElementById("mySelect2");
    let inputBakery = document.getElementById("input-bakery-update");

    // Get the values from the form fields
    let nameValue = inputName.value;
    let bakeryValue = inputBakery.value;

    // Put our data we want to send in a javascript object
    let data = {
        name: nameValue,
        bakery: bakeryValue,
    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-product-bakery-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow2(xhttp.response, nameValue);
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function updateRow2(data, product_id){
    let parsedData2 = JSON.parse(data);
    
    let table2 = document.getElementById("product-table");
    console.log(table2)

    for (let i = 0, row; row = table2.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table2.rows[i].getAttribute("data-value") == product_id) {

            // Get the location of the row where we found the matching person ID
            let updateRowIndex2 = table2.getElementsByTagName("tr")[i];

            // Get td of homeworld value
            let td2 = updateRowIndex2.getElementsByTagName("td")[4];

            // Reassign bakery
            // Account for null bakery values here
            if (parsedData2.length === 0) {
                td2.innerHTML = ""
            }
            else {
                td2.innerHTML = parsedData2[0].name; 
            }            
       }
    }
}


