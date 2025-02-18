// FRONT-END (CLIENT) JAVASCRIPT HERE


// submit button post request
const submitWorkout = async function(event) {
    event.preventDefault();

    // finding the input from the fields
    const muscleGroup = document.querySelector("#muscle-group").value;
    const numExercises = document.querySelector("#numexercises").value;
    const date = document.querySelector("#date").value;
    let comments = document.querySelector("#comments").value;

    // fixes comment error where you can't edit with new lines
    comments = comments.replace(/\s+/g, ' ').trim();

    // object format for json export
    const workout = {
        muscleGroup,
        numExercises,
        date,
        comments
    };

    try {
        // sending post request
        const response = await fetch("/workouts", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(workout)
        });

        if (response.ok) {
            // refresh workout list
            console.log("Workout added");
            loadWorkouts();
        } else {
            console.error("POST request error");
        }
    } catch (error) {
        console.error("Error", error);
    }
};

// updating table whenever a change happens
const loadWorkouts = async function() {

    // getting workout data and convert to json format
    const response = await fetch("/workouts");
    const workouts = await response.json();


    // setup table and clear contents
    const table = document.querySelector("#workout-table tbody");
    table.innerHTML = '';

    // for loop going through the database and fetching the workouts
    workouts.forEach(workout => {

        // setting up each row
        const row = document.createElement("tr");


        // delete and edit button available, calling their functions
        row.innerHTML = `
            <td>${workout.muscleGroup}</td>
            <td>${workout.numExercises}</td>
            <td>${workout.date}</td>
            <td>${workout.comments}</td>
            <td>
                <button class="bg-lime-500 text-white py-2 px-4 rounded-md hover:bg-lime-600" onclick="openEditPopup('${workout._id}', '${workout.muscleGroup}', '${workout.numExercises}', '${workout.date}', '${workout.comments}')">Edit</button>
                <button class="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600" onclick="deleteWorkout('${workout._id}')">Delete</button>

            </td>
        `;
        table.appendChild(row);
    });
};




// deleting workout log
const deleteWorkout = async function(id) {

    // get the ID and delete
    const response = await fetch(`/workouts/${id}`, {
        method: 'DELETE'
    });

    if (response.ok) {
        console.log("Workout deleted");

        // if successful, refresh the table
        loadWorkouts();
    } else {
        console.error("DELETE request error");
    }
};

// making sure we are able to edit form
document.addEventListener("DOMContentLoaded", () => {
    const editForm = document.getElementById("edit-form");
    if (editForm) {
        editForm.addEventListener("submit", async function(event) {
            // prevents default form
            event.preventDefault();
        });
    } else {
        console.error("Cannot edit form because form isn't found");
    }
});



// open popup window
const openEditPopup = (id, muscleGroup, numExercises, date, comments) => {

    // all the fields show up, same as the regular form
    document.getElementById("edit-id").value = id;
    document.getElementById("edit-muscle-group").value = muscleGroup;
    document.getElementById("edit-numexercises").value = numExercises;
    document.getElementById("edit-date").value = date;
    document.getElementById("edit-comments").value = comments;

    // changes the popup to show in the CSS
    document.getElementById("edit-popup").style.display = "flex";
};

// changes the styling of the edit to be none, thus hiding hte popup
const closeEditPopup = () => {
    document.getElementById("edit-popup").style.display = "none";
};

// handling form editing
document.getElementById("edit-form").addEventListener("submit", async function(event) {

    // stops the default form
    event.preventDefault();


    // gets the form information based on the ID
    const id = document.getElementById("edit-id").value;

    // gets new information
    const updatedWorkout = {
        muscleGroup: document.getElementById("edit-muscle-group").value,
        numExercises: document.getElementById("edit-numexercises").value,
        date: document.getElementById("edit-date").value,
        comments: document.getElementById("edit-comments").value,
    };

    // setup PUT request to update with new information
    const response = await fetch(`/workouts/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedWorkout)
    });

    if (response.ok) {
        console.log("Workout edited");

        // closes the window and reloads the table
        closeEditPopup();
        loadWorkouts();
    } else {
        console.error("PUT request error");
    }
});


// submit button
window.onload = function() {
    const form = document.querySelector("form");
    form.onsubmit = submitWorkout;
    loadWorkouts();
};

// logout implementation
document.getElementById("logout").addEventListener("click", async () => {
    try {

        // gets logout setup
        const response = await fetch("/logout", { method: "POST" });

        if (response.ok) {
            // back into login page
            window.location.href = "/login";
        } else {
            console.error("Cannot logout, error");
        }
    } catch (error) {
        console.error("Error logging out, code:", error);
    }
});
