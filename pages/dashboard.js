import React, { useState } from "react";
import { MongoClient } from "mongodb";
import AddWorkoutForm from "@/components/AddWorkoutForm";
import WorkoutTable from "@/components/WorkoutTable";
import EditWorkout from "@/components/EditWorkout";
import Head from "next/head";

export async function getServerSideProps() {

    // database init
    const client = await MongoClient.connect(process.env.MONGODB_URI);
    const db = client.db("workoutLogger");
    const workoutsCollection = db.collection("workouts");


    const workouts = await workoutsCollection.find().toArray();
    client.close();


    // array of workouts mapping
    return {
        props: {
            initialWorkouts: workouts.map((workout) => ({
                id: workout._id.toString(),
                muscleGroup: workout.muscleGroup,
                numExercises: workout.numExercises,
                date: workout.date,
                comments: workout.comments,
            })),
        },
    };
}

export default function Home({ initialWorkouts }) {


    const [workouts, setWorkouts] = useState(initialWorkouts);
    const [editingWorkout, setEditingWorkout] = useState(null);

    // adding a new workout
    const addWorkoutHandler = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const workout = Object.fromEntries(formData);

        // add to database
        const response = await fetch("/api/workouts", {
            method: "POST",
            body: JSON.stringify(workout),
            headers: {
                "Content-Type": "application/json",
            },
        });

        // ensure object gets sent
        const newWorkout = await response.json();
        setWorkouts((prevWorkouts) => [...prevWorkouts, { id: newWorkout.id, ...workout }]);
    };

    // deleting workout API call
    const deleteWorkoutHandler = async (id) => {
        await fetch(`/api/workouts?id=${id}`, {
            method: "DELETE",
        });

        // find the
        setWorkouts((prevWorkouts) => prevWorkouts.filter((workout) => workout.id !== id));
    };

    // editing workout API call
    const editWorkoutHandler = async (event) => {

        event.preventDefault();
        const formData = new FormData(event.target);

        const updatedWorkout = Object.fromEntries(formData);

        // put request
        await fetch(`/api/workouts?id=${editingWorkout.id}`, {
            method: "PUT",
            body: JSON.stringify(updatedWorkout),
            headers: {
                "Content-Type": "application/json",
            },
        });

        // update
        setWorkouts((prevWorkouts) =>
            prevWorkouts.map((workout) =>
                workout.id === editingWorkout.id ? { ...workout, ...updatedWorkout } : workout
            )
        );
        setEditingWorkout(null);
    };

    // closing popup
    const closeEditPopup = () => {

        setEditingWorkout(null);
    };

    return (
        <>
            <Head>
                <title>Workout Logger</title>
            </Head>

            <div className="flex flex-col items-center justify-center font-sans bg-gray-100 m-0 p-0 min-h-screen">
                <header className="w-full max-w-4xl p-4 text-center">
                    <h1 className="text-2xl font-bold">Workout Logger</h1>


                    <p className="text-gray-700 text-lg font-medium mt-4 mx-auto max-w-2xl">
                        Fill out the muscle group you worked out, the number of exercises for the workout, date of
                        workout, and any additional comments about the workout. Press submit when complete.
                    </p>
                    <a
                        href="https://www.muscleandstrength.com/workout-routines"
                        className="text-blue-500 hover:underline font-semibold mt-4 block"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Read more about different exercises →
                    </a>
                </header>

                <main className="w-full max-w-4xl p-4">
                    <section>
                        { /*  add workout component */}
                        <AddWorkoutForm onSubmit={addWorkoutHandler} />
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-center mt-4">Workout Logs</h2>
                        <p className="text-gray-700 text-lg font-medium mt-4 mx-auto max-w-3xl text-center">
                            Press Edit to change information on a workout or Delete to remove workout from log.
                        </p>
                        { /* workout table component */}
                        <WorkoutTable
                            workouts={workouts}
                            onDelete={deleteWorkoutHandler}
                            onEdit={setEditingWorkout}
                        />
                    </section>

                    { /*  editing workout component */}
                    {editingWorkout && (
                        <EditWorkout
                            workout={editingWorkout}
                            onClose={closeEditPopup}
                            onSubmit={editWorkoutHandler}
                        />
                    )}
                </main>
            </div>
        </>
    );
}