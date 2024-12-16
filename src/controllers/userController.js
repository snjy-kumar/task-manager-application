
import bcrypt from 'bcryptjs'
import User from '../models/user.model.js'



const createUser =  async (req, res) => {
    const { name, email, password, role="user" } = req.body
    if(!name || !email || !password) {
        return res.status(400).json({message: "All fields are required"})
    }
    const existingUser = await User.findOne({email})
    if(existingUser) {
        return res.status(400).json({message: "User already exists"})
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = new User({name, email, password: hashedPassword, role})
    await user.save()
    res.status(201).json({message: "User Registered successfully"})
}

export {createUser}