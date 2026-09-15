import express from 'express';
import { nanoid } from 'nanoid'
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get('/',(req,res)=>{
    res.send("hello world")
})
app.post('/api/create', (req,res)=>{
    const {url} =req.body
    console.log(url); 
    res.send(nanoid(7))
})


const PORT = 3000
app.listen(PORT,()=>{
    console.log(`server is running ${PORT}`)
})