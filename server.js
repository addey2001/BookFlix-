import express from "express";
import "dotenv/config";
import mongoose from "mongoose";
import morgan from "morgan";
//middleware 
import notFoundHandler from "./middleware/NotFoundHandler.js";
import errorHandler from "./middleware/errorhandler.js";
//routers
import userRouter from "./controllers/users.js";
import router from "./controllers/users.js";


const app = express();
const port = process.env.PORT || 3000;


//middlewares
app.use(express.json());
app.use(morgan("dev"));

//routes
app.use('/api/auth', userRouter);

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