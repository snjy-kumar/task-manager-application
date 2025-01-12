
// import bcrypt from 'bcryptjs'
import User from '../models/user.model.js'




// const createUser =  async (req, res) => {
//     const { name, email, password, role } = req.body;
//     console.log(name,email,password,role);
//     if(!name || !email || !password) {
//         return res.status(400).json({message: "All fields are required"})
//     }
//     const existingUser = await User.findOne({email})
//     if(existingUser) {
//         return res.status(400).json({message: "User by mail already exists"})
//     }

//     const hashedPassword = await bcrypt.hash(password, 10)

//     const user = new User({name, email, password: hashedPassword, role})
//     await user.save()
//     res.status(201).json({message: "User Registered successfully"})
// }

// const getUsers = async (req, res) => {
//     const users = await User.find();
//     res.status(200).json(users
//     )
// }
// export {createUser, getUsers}



// controllers/userController.js
// const User = require('../models/user.model.js'); // Assuming you have a User model

// Get all users
 const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new user
 const createUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const newUser = new User({ name, email, password });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: 'Bad request' });
  }
};

// Get a user by ID
 const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a user by ID
 const updateUserById = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: 'Bad request' });
  }
};

// Delete a user by ID
 const deleteUserById = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export { getUsers,createUser, getUserById, updateUserById,deleteUserById }