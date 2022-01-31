const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();



const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1hecm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('tourx_database');
        const servicesCollection = database.collection('services');
        const bookingCollection = database.collection('bookings');



        //get Api all products
        app.get('/products', async (req, res) => {
            const cursor = servicesCollection.find({});
            const products = await cursor.toArray();
            res.send(products);
        })



        app.get('/product/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const package = await servicesCollection.findOne(query)
            res.send(package);
            console.log(id);
        })




        app.post('/bookings', async (req, res) => {
            const newBooking = req.body;
            const result = await bookingCollection.insertOne(newBooking);
            res.send(result)
        })


        // GET bookings API
        app.get('/bookings', async (req, res) => {
            const cursor = bookingCollection.find({});
            const bookings = await cursor.toArray();
            res.send(bookings);
        })



        app.get('/bookings/:uEmail', async (req, res) => {
            const uEmail = req.params.uEmail;
            const query = { email: uEmail }
            const cursor = bookingCollection.find(query);
            const userBookings = await cursor.toArray();
            res.send(userBookings);
        })



        app.delete('/booking/:bookingId', async (req, res) => {
            const bookingId = req.params.bookingId;
            const query = { _id: ObjectId(bookingId) };

            const result = await bookingCollection.deleteOne(query);
            res.send(result);
        })




    } finally {
        // await client.close(); 
    }

}
run().catch(console.dir);





app.get('/', (req, res) => {
    res.send("running website");
});

app.listen(port, () => {
    console.log("running sob kisu", port);
})