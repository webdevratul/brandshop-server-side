const express = require('express');
const app = express();
const cors = require("cors");
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 200;


// middlewares 
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uxcjhbh.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {

        const brandCollection = client.db("ElectraPulse").collection("brand");
        const productDataCollection = client.db("ElectraPulse").collection("product");
        const addToCartCollection = client.db("ElectraPulse").collection("addToCart");


        app.get("/brands", async (req, res) => {
            const result = await brandCollection.find().toArray();
            res.send(result);
        });

        app.get("/allProducts", async (req, res) => {
            const result = await productDataCollection.find().toArray();
            res.send(result);
        });

        app.post("/productData", async (req, res) => {
            const product = req.body;
            const result = await productDataCollection.insertOne(product);
            res.send(result);
        });

        app.get("/brands/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await brandCollection.findOne(query);
            res.send(result);
        });

        app.get("/productData/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await productDataCollection.findOne(query);
            res.send(result);
        });

        app.post("/addCart", async (req, res) => {
            const product = req.body;
            const result = await addToCartCollection.insertOne(product);
            res.send(result);
        });

        app.get("/myCarts", async (req, res) => {
            const result = await addToCartCollection.find().toArray();
            res.send(result);
        });

        app.delete("/myCarts/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await addToCartCollection.deleteOne(query);
            res.send(result);
        });

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        /* await client.close(); */
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('ElectricPulse Server Running');
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});