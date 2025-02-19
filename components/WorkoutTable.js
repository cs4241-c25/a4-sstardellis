// Workout Table Component
export default function WorkoutTable({ workouts, onDelete, onEdit }) {
    return (
        <table className="min-w-full mt-4 table-auto border-separate border-spacing-0 rounded-lg shadow-md">
            <thead>

            <tr className="bg-gray-200 text-gray-700 border-b-2 border-gray-300">
                <th className="border-r border-gray-300 p-3 text-left">Muscle Group</th>
                <th className="border-r border-gray-300 p-3 text-left">Number of Exercises</th>
                <th className="border-r border-gray-300 p-3 text-left">Date</th>
                <th className="border-r border-gray-300 p-3 text-left">Comments</th>
                <th className="p-3 text-left">Actions</th>

            </tr>
            </thead>
            <tbody className="text-gray-700">


            {workouts.map((workout) => (


                <tr key={workout.id} className="border-b border-gray-300">
                    <td className="border-r border-gray-300 p-3">{workout.muscleGroup}</td>
                    <td className="border-r border-gray-300 p-3">{workout.numExercises}</td>
                    <td className="border-r border-gray-300 p-3">{workout.date}</td>
                    <td className="border-r border-gray-300 p-3">{workout.comments}</td>
                    <td className="p-3">
                        <button
                            onClick={() => onEdit(workout)}
                            className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => onDelete(workout.id)}
                            className="bg-red-500 text-white px-2 py-1 rounded"
                        >
                            Delete
                        </button>

                    </td>
                </tr>
            ))}

            </tbody>
        </table>
    );
}