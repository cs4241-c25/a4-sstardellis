import { MongoClient, ObjectId } from "mongodb";

const uri = process.env.MONGODB_URI;

export default async function handler(req, res) {
    const client = await MongoClient.connect(uri);
    const db = client.db("workoutLogger");
    const collection = db.collection("workouts");

    try {
        if (req.method === "POST") {
            const data = req.body;
            const result = await collection.insertOne(data);
            res.status(201).json({ id: result.insertedId, message: "Workout added successfully" });
        } else if (req.method === "DELETE") {
            const { id } = req.query;
            if (!ObjectId.isValid(id)) {
                throw new Error("Invalid ID format");
            }
            await collection.deleteOne({ _id: new ObjectId(id) });
            res.status(200).json({ message: "Workout deleted successfully" });
        } else if (req.method === "PUT") {
            const { id } = req.query;
            if (!ObjectId.isValid(id)) {
                throw new Error("Invalid ID format");
            }
            const data = req.body;
            await collection.updateOne({ _id: new ObjectId(id) }, { $set: data });
            res.status(200).json({ message: "Workout updated successfully" });
        } else {
            const workouts = await collection.find().toArray();
            res.status(200).json(workouts);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    } finally {
        client.close();
    }
}
