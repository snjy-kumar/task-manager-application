// import express from 'express'
// import { createUser, getUsers } from '../controllers/userController.js'


// const router = express.Router()

// router.post("/register", createUser)
// router.get("/all", getUsers)

// export default router

// routes/userRoutes.js
// const express = require('express');
// const router = express.Router();
// const userController = require('../controllers/userController');
import express from "express";
// import {userController} from "../controllers/userController.js";

import { getUsers, createUser, getUserById } from "../controllers/userController.js"

const router = express.Router();

// Route for getting all users
router.get('/users', getUsers);

// Route for creating a new user
router.post('/users', createUser);

// Route for getting a user by ID
router.get('/users/:id', getUserById);

// Route for updating a user by ID
// router.put('/users/:id', updateUserById);

// Route for deleting a user by ID
// router.delete('/users/:id', deleteUserById);

// module.exports = router;
export default router;
