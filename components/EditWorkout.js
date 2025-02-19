// Edit Workout Component
export default function EditWorkout({ workout, onClose, onSubmit }) {
    if (!workout) return null;

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-30 flex justify-center items-center">
            <div className="bg-white p-5 rounded-lg w-96 text-center relative">
                <span
                    className="absolute top-2 right-4 text-xl cursor-pointer text-red-500"
                    onClick={onClose}
                >
                    x
                </span>
                <h2 className="text-lg font-bold">Edit Workout</h2>
                <form onSubmit={onSubmit} className="flex flex-col">
                    <input type="hidden" name="id" value={workout.id} />
                    <label htmlFor="edit-muscle-group" className="font-bold mt-4">
                        Muscle Group:
                    </label>
                    <select
                        id="edit-muscle-group"
                        name="muscleGroup"
                        defaultValue={workout.muscleGroup}
                        className="w-full p-2 border border-gray-400 rounded mt-2"
                        required
                    >
                        <option value="back">Back</option>
                        <option value="chest">Chest</option>
                        <option value="legs">Legs</option>
                        <option value="triceps">Triceps</option>
                        <option value="biceps">Biceps</option>
                        <option value="shoulders">Shoulders</option>
                        <option value="abs">Abdominals</option>
                    </select>

                    <label htmlFor="edit-numExercises" className="font-bold mt-4">
                        Number of Exercises:
                    </label>
                    <input
                        id="edit-numExercises"
                        type="number"
                        name="numExercises"
                        defaultValue={workout.numExercises}
                        className="w-full p-2 border border-gray-400 rounded mt-2"
                        required
                    />

                    <label htmlFor="edit-date" className="font-bold mt-4">
                        Date:
                    </label>
                    <input
                        id="edit-date"
                        type="date"
                        name="date"
                        defaultValue={workout.date}
                        className="w-full p-2 border border-gray-400 rounded mt-2"
                        required
                    />

                    <label htmlFor="edit-comments" className="font-bold mt-4">
                        Comments:
                    </label>
                    <textarea
                        id="edit-comments"
                        name="comments"
                        defaultValue={workout.comments}
                        className="w-full p-2 border border-gray-400 rounded mt-2"
                        rows="2"
                    ></textarea>

                    <button
                        type="submit"
                        className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded mt-4"
                    >
                        Save
                    </button>
                </form>
            </div>
        </div>
    );
}