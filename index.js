import express from 'express';
import dotenv from 'dotenv'
import { usersRouter } from './routes/Users.js';
import { MongoClient } from 'mongodb';

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
const MONGO_URL = process.env.MONGO_URL;

async function createConnection(){
    const client  =  new MongoClient(MONGO_URL);
    await client.connect();
    console.log(`Connected to DB`)
    return client;
}

export const client  = await createConnection()

app.get('/',(req,res)=>{
    res.send("Home")
});

app.use('/users',usersRouter);

app.listen(PORT,()=>console.log(`App started in PORT ${PORT}`))