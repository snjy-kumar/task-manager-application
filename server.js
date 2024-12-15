import express from "express";
import dotenv from "dotenv";
import dbConfig from "./src/config/dbConfig.js";

dotenv.config();

const app = express();
const port = process.env.PORT  || 3001;
dbConfig();

app.use(express.json());

let users = [ 
    {
        id : 1,
        name:"",
        email:"",
    }
]

app.get("/:id", (req, res) => {
    const {id } = req.params
    const user = users.find(user => user.id === parseInt(id));
    if(!user){
        return res.status(404).json({
            message: "User not found"
        })
    }
    res.status(200).json(user)

})

app.get("/", (req, res) => {
    res.json({
        message: "Hello World!",
        users
    })
})
app.post("/", (req, res) =>{
    const {name, email } = req.body;
    if(!name && !email) {
        return res.status(400).json({
            message: "Name and email are required"
        })
    }
    const user = {
        id: users.length + 1,
        name, 
        email
    }
    users.push(user);
    res.status(201).json(user);
})

app.put("/:id", (req, res) => {
    const {id} = req.params;
    const {name, email} = req.body;
    const user = users.find(user => user.id === parseInt(id));
    if(!user){
        return res.status(404).json({
            message: "User not found"
        })
    }
    user.name = name
    user.email = email
    res.status(200).json(user);
})
app.delete("/:id", (req, res) => {
    const { id } = req.params;
    const user = users.find(user => user.id === parseInt(id));
    if(!user) {
        return res.status(404).json({
            message: "User not found"   
        })
    }
    users = users.filter(user => user.id !== parseInt(id));
    res.status(200).json({
        message:"deleted successfully"
    })
})

app.listen(port, () => {
    console.log(`Server is running on port localhost:${port}`);
})