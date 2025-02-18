import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Home() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [workouts, setWorkouts] = useState([]);
    const [formData, setFormData] = useState({
        muscleGroup: "",
        numExercises: "",
        date: "",
        comments: "",
    });

    // go to login page if not logged in
    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }
    }, [status, router]);

    useEffect(() => {
        if (session) {
            fetchWorkouts();
        }
    }, [session]);

    // get workouts from API
    const fetchWorkouts = async () => {
        try {
            const response = await fetch("/api/workouts");
            const data = await response.json();
            // make sure _id is string
            setWorkouts(data.map((workout) => ({ ...workout, _id: workout._id.toString() })));
        } catch (error) {
            console.error("Failed to fetch workouts:", error);
        }
    };

    // form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("/api/workouts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },

                // include cookies
                credentials: "include",
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                console.error("Error adding workout");
                return;
            }

            setFormData({ muscleGroup: "", numExercises: "", date: "", comments: "" });
            setWorkouts((prevWorkouts) => [...prevWorkouts, data]);
        } catch (error) {
            console.error("Error submitting form");
        }
    };



    // handling delete
    const handleDelete = async (id) => {
        try {
            const response = await fetch(`/api/workouts?id=${id}`, { method: "DELETE" });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Failed to delete workout");
            }

            // refresh the workouts list
            await fetchWorkouts();
        } catch (error) {
            console.error("Error deleting workout:", error);
        }
    };

    if (!session) {
        return null;
    }


    // our html
    return (
        <div className="flex flex-col items-center justify-center font-sans bg-gray-100 min-h-screen">
            <header class="w-full max-w-4xl p-4 text-center">
                <h1 class="text-2xl font-bold">Workout Logger</h1>


                <button id="logout" class="bg-blue-500 text-white py-3 px-4 rounded-md hover:bg-blue-600 mt-4">
                    Logout
                </button>

                <p class="text-gray-700 text-lg font-medium mt-4 mx-auto max-w-2xl">
                    Fill out the muscle group you worked out, the number of exercises for the workout, date of workout, and any additional comments about the workout. Press submit when complete.
                </p>
                <a href="https://www.muscleandstrength.com/workout-routines"
                   class="text-blue-500 hover:underline font-semibold mt-4 block" target="_blank">
                    Read more about different exercises →
                </a>

            </header>
            <main className="w-full max-w-4xl p-4">

                    <form
                    onSubmit={handleSubmit}
                    className="flex flex-col max-w-xl mx-auto p-5 bg-white rounded-lg shadow-lg mt-6"
                >
                    <label htmlFor="muscle-group" className="font-bold">
                        Muscle Group:
                        <span className="text-red-500">*</span>
                    </label>
                    <select
                        name="muscleGroup"
                        id="muscle-group"
                        required
                        value={formData.muscleGroup}
                        onChange={(e) => setFormData({ ...formData, muscleGroup: e.target.value })}
                        className="w-full p-2 border border-gray-400 rounded mt-2"
                    >
                        <option value="" disabled>
                            Select a muscle group
                        </option>
                        <option value="back">Back</option>
                        <option value="chest">Chest</option>
                        <option value="legs">Legs</option>
                        <option value="triceps">Triceps</option>
                        <option value="biceps">Biceps</option>
                        <option value="shoulders">Shoulders</option>
                        <option value="abs">Abdominals</option>
                    </select>

                    <label htmlFor="num-exercises" className="font-bold mt-4">
                        Number of Exercises:
                        <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        id="num-exercises"
                        name="numExercises"
                        required
                        value={formData.numExercises}
                        onChange={(e) => setFormData({ ...formData, numExercises: e.target.value })}
                        className="w-full p-2 border border-gray-400 rounded mt-2"
                    />

                    <label htmlFor="date" className="font-bold mt-4">
                        Date of Workout:
                        <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="date"
                        id="date"
                        name="date"
                        required
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="w-full p-2 border border-gray-400 rounded mt-2"
                    />

                    <label htmlFor="comments" className="font-bold mt-4">Additional Comments:</label>
                    <textarea
                        id="comments"
                        name="comments"
                        rows="2"
                        value={formData.comments}
                        onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                        className="w-full p-2 border border-gray-400 rounded mt-2"
                    ></textarea>

                    <button
                        type="submit"
                        className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded mt-4"
                    >
                        Submit
                    </button>
                </form>

                <section className="mt-6">
                    <h2 className="text-xl font-bold text-center">Workout Logs</h2>
                    <table className="min-w-full mt-4 table-auto border-separate border-spacing-0 rounded-lg shadow-md">
                        <thead>
                        <tr className="bg-gray-200 text-gray-700 border-b-2 border-gray-300">
                            <th className="p-3 text-left">Muscle Group</th>
                            <th className="p-3 text-left">Number of Exercises</th>
                            <th className="p-3 text-left">Date</th>
                            <th className="p-3 text-left">Comments</th>
                            <th className="p-3 text-left">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {workouts.map((workout) => (
                            <tr key={workout._id} className="border-b">
                                <td className="p-3">{workout.muscleGroup}</td>
                                <td className="p-3">{workout.numExercises}</td>
                                <td className="p-3">{workout.date}</td>
                                <td className="p-3">{workout.comments}</td>
                                <td className="p-3">
                                    <button
                                        onClick={() => handleDelete(workout._id)}
                                        className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </section>
            </main>
        </div>
    );
}
