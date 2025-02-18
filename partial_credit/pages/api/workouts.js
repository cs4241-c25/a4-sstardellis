import clientPromise from "../../app/lib/db";
import { getSession } from "next-auth/react";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
    const session = await getSession({ req });


    // checking for authorization
    if (!session) {
        console.error("Unauthorized request, no session");
        return res.status(401).json({ error: "You are not authenticated" });
    }

    const client = await clientPromise;
    const db = client.db("workoutLogger");

    // get req
    if (req.method === "GET") {
        try {


            const workouts = await db.collection("workouts").find().toArray();

            res.status(200).json(workouts);


        } catch (error) {
            console.error("Error fetching workouts");
            res.status(500).json({ error: "Failed to fetch workouts" });
        }

    // post req
    } else if (req.method === "POST") {
        try {
            const workout = { ...req.body, userId: session.user.id };
            const result = await db.collection("workouts").insertOne(workout);

            // return the  workout
            res.status(201).json(result.ops[0]);
        } catch (error) {
            console.error("Error adding workout:", error);
            res.status(500).json({
                error: "Failed to add workout" });
        }
    // delete req
    } else if (req.method === "DELETE") {
        const { id } = req.query;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid workout ID" });
        }

        try {
            const result = await db.collection("workouts").deleteOne({ _id: new ObjectId(id) });

            if (result.deletedCount === 0) {

                return res.status(404).json({
                    error: "Workout not found" });
            }

            res.status(200).json({ message: "Workout deleted successfully"
            });
        } catch (error) {
            console.error("Error deleting workout");
            res.status(500).json({ error: "Failed to delete workout" });
        }
    }
}
