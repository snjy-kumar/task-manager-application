
import bcrypt from 'bcryptjs'
import User from '../models/user.model.js'
import jwt from 'jsonwebtoken'
import environment from '../config/environment.js';


const logInUser = async (req, res) => {
   const {email, password} = req.body;
    if(!email || !password) {
        return res.status(400).json({message: "All fields are required"})
    }

    const user = await User.findOne({email})
    if(!user) {
        return res.status(400).json({message: "Invalid credentials or User does not exist"})
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password)
    if(!isPasswordCorrect) {
        return res.status(400).json({message: "Invalid Password"})
    }

    const token = jwt.sign({email: user.email, id: user._id}, environment.jwtSecret, {expiresIn: "1h"})

    res.status(200).json({message: "Login successful", user, token})
    
}


const createUser =  async (req, res) => {
    const { name, email, password } = req.body;
    console.log(name,email,password );
    if(!name || !email || !password) {
        return res.status(400).json({message: "All fields are required"})
    }
    const existingUser = await User.findOne({email})
    if(existingUser) {
        return res.status(400).json({message: "User by mail already exists"})
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = new User({name, email, password: hashedPassword })
    await user.save()
    res.status(201).json({message: "User Registered successfully", user})
}

const getAllUsers = async (req, res) => {
    const users = await User.find()
    res.status(200).json(users)
}

export {createUser, logInUser, getAllUsers}
