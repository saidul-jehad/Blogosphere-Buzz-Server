const express = require('express')
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000;


// middleWare
app.use(
    cors({
        origin: [
            "http://localhost:5173",
            "https://blogosphere-buzz.netlify.app"
        ],
        credentials: true,
    })
);
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ujjqksd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


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
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        const blogsCollection = client.db('blogosphereBuzz').collection('blogs')
        const commentsCollection = client.db('blogosphereBuzz').collection('comments')

        // get all blogs
        app.get('/blogs', async (req, res) => {
            const cursor = blogsCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })

        // get specific blog by req id
        app.get('/blog/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await blogsCollection.findOne(query)
            res.send(result)
        })

        // Add Blog 
        app.post('/add-blog', async (req, res) => {
            const blog = req.body
            const result = await blogsCollection.insertOne(blog)
            res.send(result)
            // console.log(blog);
        })

        // add comment
        app.post('/add-comment', async (req, res) => {
            const comment = req.body
            const result = await commentsCollection.insertOne(comment)
            res.send(comment)
        })

        // get all comment
        app.get('/all-comments', async (req, res) => {
            const cursor = commentsCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })



        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send("blogosphere buzz server is running ...........")
})

app.listen(port, () => {
    console.log(`blogosphere buzz server is running port is : ${port}`);
})

