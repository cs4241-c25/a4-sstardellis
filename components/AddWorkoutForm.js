// Workout Form Component
export default function AddWorkoutForm({ onSubmit }) {
    return (
        <form onSubmit={onSubmit} className="flex flex-col max-w-xl mx-auto p-5 bg-white rounded-lg shadow-lg mt-6">
            <label htmlFor="muscle-group" className="font-bold">
                Muscle Group:
                <span className="text-red-500">*</span>
            </label>

            <select
                name="muscleGroup"
                id="muscle-group"
                required
                className="w-full p-2 border border-gray-400 rounded mt-2"
            >


                <option value="">Select a muscle group</option>
                <option value="back">Back</option>
                <option value="chest">Chest</option>
                <option value="legs">Legs</option>
                <option value="triceps">Triceps</option>
                <option value="biceps">Biceps</option>
                <option value="shoulders">Shoulders</option>
                <option value="abs">Abdominals</option>
            </select>


            <label htmlFor="numExercises" className="font-bold mt-4">
                Number of Exercises:

                <span className="text-red-500">*</span>
            </label>
            <input

                type="number"
                id="numExercises"
                name="numExercises"
                required
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
                className="w-full p-2 border border-gray-400 rounded mt-2"
            />

            <label htmlFor="comments" className="font-bold mt-4">
                Additional Comments:
            </label>


            <textarea
                id="comments"
                name="comments"
                rows="2"
                className="w-full p-2 border border-gray-400 rounded mt-2"
            ></textarea>

            <input
                type="submit"
                value="Submit"
                className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded cursor-pointer mt-4"
            />

        </form>
    );
}