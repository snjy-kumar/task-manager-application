import express from "express";
import dotenv from "dotenv";
import dbConfig from "./src/config/dbConfig.js";
import User from "./src/models/user.model.js";
import router from "./src/routes/useRouter.js";
dotenv.config();
const app = express();

app.use(express.json());

const port = process.env.PORT  || 4000;
dbConfig(); // Connect to database
// app.use((req, res, next) => {
//     console.log("Middleware is running");
//     console.log(`${req.method} ${req.url}`);
//     next();
// });


console.log("Hello World");



// app.post("/users", async (req, res) => {
//     const {name, email} = req.body;
//     const user = new User({
//         name,
//         email
//     })
//     const newUser = await user.save();
//     res.status(201).json(newUser);
// })

// app.get("/users/:id", async (req, res) => {
//     const { id } = parseInt(req.params.id);
//     const user = await User.findOne(id);
//     if(!user) {
//         return res.status(404).json({
//             message: "User not found at all"
//         })
//     }
//     res.status(200).json(user);
// })

// app.get("/users", async (req, res) => {
//     const users = await User.find();
//     if(!users) {
//         return res.status(404).json({
//             message: "No users found"
//         })
//     }
//     res.status(200).json(users);
// })

// app.put("/users/:id", async (req, res) => {
//     const {id} = parseInt(req.params.id);
//     const {name, email} = req.body;
//     const user = await User.findOneAndUpdate(id, {
//         name,
//         email
//     }, {new: true})
//     if(!user) {
//         return res.status(404).json({
//             message: "User not found"
//         })
//     }
//     res.status(200).json(user);
// })

// app.delete("/users/:id", async (req, res) => {
//     const { id } = parseInt(req.params.id);
//     const user = await User.findOneAndDelete(id)
//     if(!user) {
//         return res.status(404).json({
//             message: "User not found"
//         })
//     }
//     res.status(200).json({
//         message: "User deleted successfully"
//     })
// })

app.use("/users/", router);





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


// Error handler (must be defined after all routes)
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send('Internal Server Error');
  });
  

app.listen(port, () => {
    console.log(`Server is running on port https://localhost:${port}`);
})