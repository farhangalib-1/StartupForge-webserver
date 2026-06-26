const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
    const userCollection = db.collection("user")
    const startupCollections = db.collection("startups")
    const opportunitiesCollections = db.collection("opportunities")
    const paymentCollections = db.collection("payments")
    app.post("/payment", async(req, res)=>{
      const {sessionId, userId, priceId, userName, userEmail} = req.body
      const isExist = await paymentCollections.findOne({sessionId})
      if(isExist){
        return res.json({message: "Already Exist"})
      }
      const result = await paymentCollections.insertOne({
        sessionId,
        userId,
        userName,
        userEmail,
        priceId,
        createAt: new Date(),
      })
      await userCollection.updateOne(
        {_id: new ObjectId(userId)},
        {$set: {plan: "pro"}}
      );
      res.json({message:"payment successful!!!"})
    })
    app.patch("/api/startups/:id", async (req, res) => {
  const { id } = req.params;

  const result = await startupCollections.updateOne(
    {
      _id: new ObjectId(id),
    },
    {
      $set: {
        status: "approved",
      },
    }
  );

  res.send(result);
});
    app.get("/payment", async(req, res)=>{
      const cursor = await paymentCollections.find();
      const result = await cursor.toArray();
      res.send(result)
    })
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
    
    
    app.get("/api/users", async (req, res) => {
  const cursor = userCollection.find({
    role: { $ne: "Admin" }
  });
  const result = await cursor.toArray();
  res.send(result);
});



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
    app.get("/api/opportunities/:id", async (req, res) => {
  const id = req.params.id;

  const result = await opportunitiesCollections.findOne({
    _id: new ObjectId(id),
  });

  res.send(result);
});
    app.get("/api/my-startups/:id", async (req, res) => {
  const id = req.params.id;

  const result = await startupCollections.findOne({
    _id: new ObjectId(id),
  });

  res.send(result);
});
app.delete("/api/my-startups/:id", async (req, res) => {
  const id = req.params.id;

  const result = await startupCollections.deleteOne({
    _id: new ObjectId(id),
  });

  res.send(result);
});
app.patch("/api/my-startups/:id", async (req, res) => {
  const id = req.params.id;

  const data = req.body;


  const result = await startupCollections.updateOne(
    {
      _id: new ObjectId(id),
    },
    {
      $set: data,
    }
  );

  res.send(result);
});
app.patch("/api/opportunities/:id", async (req, res) => {
  const id = req.params.id;

  const data = req.body;

  delete data.status;

  const result = await opportunitiesCollections.updateOne(
    {
      _id: new ObjectId(id),
    },
    {
      $set: data,
    }
  );

  res.send(result);
});
app.delete("/api/opportunities/:id", async (req, res) => {
  const { id } = req.params;

  const result = await opportunitiesCollections.deleteOne({
    _id: new ObjectId(id),
  });

  res.send(result);
});
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