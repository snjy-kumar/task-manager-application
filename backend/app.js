import express from "express";
import dbConfig from "./src/config/dbConfig.js"; 
import cors from "cors";
// import router from "./src/routes/useRouter.js";

import userRouter  from './src/routes/userRouter.js';
import taskRouter from './src/routes/taskRouter.js';
 
const app = express();
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(cors());
dbConfig(); 



// Routes or Endpoints
app.use("/api/v1/auth", userRouter);
app.use("/api/v1/user", taskRouter);





// Error handler (must be defined after all routes)
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send('Internal Server Error');
});
 
export default app;