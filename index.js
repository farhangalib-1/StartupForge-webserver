const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.MONGODB_URI;
const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {
  try {

    
    const db = client.db("StartupForge")
    const startupCollections = db.collection("startups")
    const opportunitiesCollections = db.collection("opportunities")
    app.post("/api/startups", async(req, res)=>{
        const body = req.body
        const result = await startupCollections.insertOne(body)
        res.send(result)

    })
    app.get("/api/my-startups", async(req, res)=>{
        const cursor = await startupCollections.find()
        const result = await cursor.toArray()
        res.send(result)
    })
    app.post("/api/opportunities", async(req, res)=>{
      const data = req.body
      const result = await opportunitiesCollections.insertOne(data)
      res.send(res)
    })
    app.get("/api/opportunities", async(req, res)=>{
      const cursor = await opportunitiesCollections.find()
      const result = await cursor.toArray()
      res.send(result)
    })
  //await client.connect();
  //await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {

    //await client.close();
  }
}
run().catch(console.dir);
app.get("/", (req, res) => {
  res.send("Server is running successfully 🚀");
});

app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "API working perfectly",
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});