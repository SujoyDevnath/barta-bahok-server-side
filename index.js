const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.s8i5p.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("bartaBahok");
        const postsCollection = database.collection("posts");
        
        ////////////////////////
        // USERS API HANDLING //
        //////////////////////
        
        // // GETTING CARS DATA
        app.get('/posts', async (req, res) => {
            const cursor = postsCollection.find({});
            const posts = await cursor.toArray();
            res.send(posts);
        })

        // // POSTING POSTS
        app.post('/posts', async (req, res) => {
            const posts = req.body;
            const result = await postsCollection.insertOne(posts);
            console.log(result);
            res.json(result);
        });
        // UPDATING LIKES IN POST
        app.put('/posts/:id', async (req, res) => {
            const id = req.params.id;
            const updatedPost = req.body;
            const updatedLike = updatedPost.updatedLike;
            const updatedLikedPeoples = updatedPost.updatedLikedPeoples;
            console.log(updatedPost.updatedLikedPeoples)
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    like: updatedLike,
                    likedPeople: updatedLikedPeoples
                },
            };
            const result = await postsCollection.updateOne(filter, updateDoc, options)
            res.json(result)
        })
        // UPDATING LIKED PEOPLES IN POST
        // app.put('/posts/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const updatedLikedPeoples = req.body;
        //     console.log(updatedLikedPeoples)
        //     // // const updatedLikedPeoples = updatedPost.updatedLike;
        //     // const filter = { _id: ObjectId(id) };
        //     // const options = { upsert: true };
        //     // const updateDoc = {
        //     //     $set: {
        //     //         likedPeople: updatedLikedPeoples,
        //     //     },
        //     // };
        //     // const result = await postsCollection.updateOne(filter, updateDoc, options)
        //     // res.json(result)
        // })
        // // CHECKING ADMIN
        // app.get('/users/:email', async (req, res) => {
        //     const email = req.params.email;
        //     const query = { email: email };
        //     const user = await usersCollection.findOne(query);
        //     let isAdmin = false;
        //     if (user?.role === 'admin') {
        //         isAdmin = true;
        //     }
        //     res.json({ admin: isAdmin });
        // })
        // // MAKING USER ADMIN
        // app.put('/users/admin', async (req, res) => {
        //     const user = req.body;
        //     const filter = { email: user.email, password: user.password };
        //     const updateDoc = { $set: { role: 'admin' } };
        //     const result = await usersCollection.updateOne(filter, updateDoc);
        //     res.json(result);
        // })

        // //////////////////////////////////

        // ////////////////////////
        // // CARS API HANDLING //
        // //////////////////////

        // // GETTING SINGLE CAR DATA
        // app.get('/cars/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const query = { _id: ObjectId(id) };
        //     const cars = await carsCollection.findOne(query);
        //     res.send(cars);
        // })
        // // POST CAR DATA
        // app.post('/cars', async (req, res) => {
        //     const car = req.body;
        //     const result = await carsCollection.insertOne(car);
        //     res.json(result);
        // })
        // // DELETING CAR DATA
        // app.delete('/cars/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const query = { _id: ObjectId(id) };
        //     const result = await carsCollection.deleteOne(query);
        //     res.json(result);
        // })

        // /////////////////////////////////

        // //////////////////////////
        // // REVIEW API HANDLING //
        // ////////////////////////

        // // GETTING REVIEW DATA
        // app.get('/reviews', async (req, res) => {
        //     const cursor = reviewsCollection.find({});
        //     const reviews = await cursor.toArray();
        //     res.send(reviews);
        // })
        // // ADDIND REVIEW DATA
        // app.post('/reviews', async (req, res) => {
        //     const review = req.body;
        //     const result = await reviewsCollection.insertOne(review);
        //     res.json(result);
        // })
        // //////////////////////////////////

        // //////////////////////////////
        // // ALL ORDERS API HANDLING //
        // ////////////////////////////

        // // GETTING ORDERS
        // app.get('/allOrders', async (req, res) => {
        //     const cursor = allOrdersCollection.find({});
        //     const allOrders = await cursor.toArray();
        //     res.send(allOrders);
        // })

        // // POSTING ORDERS
        // app.post('/allOrders', async (req, res) => {
        //     const allOrders = req.body;
        //     const result = await allOrdersCollection.insertOne(allOrders);
        //     res.json(result);
        // })
        // // UPDATING ALL ORDERS
        // app.put('/allOrders/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const updatedAllOrders = req.body;
        //     const filter = { _id: ObjectId(id) };
        //     const options = { upsert: true };
        //     const updateDoc = {
        //         $set: {
        //             status: updatedAllOrders.status,
        //         },
        //     };
        //     const result = await allOrdersCollection.updateOne(filter, updateDoc, options)
        //     res.json(result)
        // })
        // // DELETING AN ORDER
        // app.delete('/allOrders/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const query = { _id: ObjectId(id) };
        //     const result = await allOrdersCollection.deleteOne(query);
        //     res.json(result);
        // })

        ///////////////////////////////////////
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Congratulations! Api started');
})

app.listen(port, () => {
    console.log(`listening at ${port}`)
})