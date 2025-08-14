import express from "express";
import "dotenv/config";
import mongoose from "mongoose";
import morgan from "morgan";
import cors from 'cors';
//middleware 
import notFoundHandler from "./middleware/NotFoundHandler.js";
import errorHandler from "./middleware/errorhandler.js";
//routers
import userRouter from "./controllers/users.js";
import verifyToken from "./middleware/verifyToken.js";
import booksRouter from "./controllers/books.js";



const app = express();
const port = process.env.PORT || 3000;


//middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

//routes

//protected routes 
app.get('/api/protected', verifyToken , (req, res, next) => {
    console.log(req.user)
    return res.json({ message: 'You have access to this protected route' });
})

// Authentication routes
app.use('/api/auth', userRouter);


// Books routes (protected)
app.use('/api/books', verifyToken, booksRouter);

//error handlers
app.use(notFoundHandler);

app.use(errorHandler)








// server conection 
const startServers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('🔒 Database connected')
    app.listen(port, () => console.log(`🚀 Server running on port ${port}`))
  } catch (error) {
    console.log(error)
  }
}
startServers()