const express = require('express')
const app = express()
const { MongoClient } = require('mongodb');
const port = process.env.PORT || 5000
const cors = require('cors')
app.use(cors())
app.use(express.json())

const ObjectId = require('mongodb').ObjectId
require ('dotenv').config()


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qlklf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


const run = async() =>{
     try{
          await client.connect();
          console.log("database connected")
          
          const database = client.db("contact-manager");
          const contactCollection = database.collection("contact-detail");

          // get all contact information
          app.get('/allContacts',async (req,res)=>{
               const cursor =  contactCollection.find({})
               const result = await cursor.toArray()
               res.json(result)
          })

          // get single contact information
          app.get('/allContacts/:id',async(req,res)=>{
               const query = {name: req.params?.id}
               console.log(query)
               const cursor = await contactCollection.find(query)
               const result = await cursor.toArray()
               console.log(result)
               res.json(result)
          })

          // add new contact
          app.post('/newContact',async(req,res) => {
               console.log(req.body)
               const doc = await contactCollection.insertOne(req.body)
               res.json(doc)
          })

          // delete contact information
          app.delete('/allContacts/:id',async(req,res)=>{
               console.log(req.params.id)
               const query = {_id:ObjectId(req.params.id)}
               const result = await contactCollection.deleteOne(query)  
               res.json(result)
          })

          // update status
          app.put('/allContacts/:id', async(req,res)=>{
               const id = req.params.id
               const updateInfo = req.body
               console.log(updateInfo)
               const filter = {_id:ObjectId(id)}
               const option = {upsert : true}
               const updateDoc = {
                    $set: {
                      status: `approved`
                    },
                  };
               const result = await contactCollection.updateOne(filter,updateDoc,option)

               res.json(result)
          })



          app.get('/', (req, res) => {
               console.log("server running")
               res.send('Server Running')
          })
          
          app.listen(port, () => {
               console.log("listening from port",port)
          })
          

     }
     finally {
          // await client.close();
     }
    

}


run().catch(console.dir);