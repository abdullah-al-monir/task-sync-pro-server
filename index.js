const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");

const app = express();
const port = process.env.PORT || 7000;
// middleware
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173"],
  })
);

const uri = `mongodb+srv://${process.env.USER_DB}:${process.env.PASS_DB}@cluster0.edvzxqj.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const taskCollection = client.db("taskDB").collection("tasks");

    // to create task
    app.post("/create-task", async (req, res) => {
      const task = req.body;
      const result = await taskCollection.insertOne(task);
      res.send(result);
    });
    app.get("/tasks", async (req, res) => {
      const email = req.query.email;
      const status = req.query.status;
      const query = { email: email, status: status };
      const result = await taskCollection.find(query).toArray();
      res.send(result);
    });
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Task Sync Pro is Running");
});

app.listen(port, () => {
  console.log("Task Sync Pro is running on port", port);
});
