import { connectToDatabase } from "@/app/lib/db";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
    const { method } = req;
    const { id } = req.query;

    const { db } = await connectToDatabase();
    const userId = req.session?.user?.id;


    // delete method
    if (method === "DELETE") {
        try {
            const result = await db.collection("users").updateOne(
                { _id: new ObjectId(userId) },
                { $pull: { workouts: { _id: new ObjectId(id) } } }
            );

            if (result.modifiedCount === 0) {
                return res.status(404).json({
                    error: "Workout not found" });
            }

            res.status(200).json({
                message: "Workout deleted" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Failure to delete workout" });
        }
    }

    // post req
    if (method === "POST") {
        const { muscleGroup, numExercises, date, comments } = req.body;

        try {
            const newWorkout = {
                _id: new ObjectId(),
                muscleGroup,
                numExercises,
                date,
                comments,
            };

            // in the user collection
            await db.collection("users").updateOne(
                { _id: new ObjectId(userId) },
                { $push: { workouts: newWorkout } }
            );

            res.status(201).json(newWorkout);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Failure to add workout" });
        }
    }
}
