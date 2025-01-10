
import bcrypt from 'bcryptjs'
import User from '../models/user.model.js'



const createUser =  async (req, res) => {
    const { name, email, password, role } = req.body;
    console.log(name,email,password,role);
    if(!name || !email || !password) {
        return res.status(400).json({message: "All fields are required"})
    }
    const existingUser = await User.findOne({email})
    if(existingUser) {
        return res.status(400).json({message: "User by mail already exists"})
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = new User({name, email, password: hashedPassword, role})
    await user.save()
    res.status(201).json({message: "User Registered successfully"})
}

const getUsers = async (req, res) => {
    const users = await User.find();
    res.status(200).json(users
    )
}
export {createUser, getUsers}