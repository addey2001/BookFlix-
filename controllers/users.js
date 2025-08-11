import express from "express";
import User from "../models/user.js";
import { InvalidData, Unauthorized} from "../utils/errors.js";
import jwt from "jsonwebtoken";

const router = express.Router();


//starting path: /api/auth

router.post('/sign-up', async (req, res, next) => {
    try {
        //user existence 



        if (req.body.password !== req.body.passwordConfirmation) {
            throw new
                InvalidData('Passwords do not match', 'password');
        }


        const newUser = await User.create(req.body);
        //generate token 
        const token = jwt.sign(
            {
                user: {
                    _id: newUser._id,
                    username: newUser.username,
                    email: newUser.email
                }
            },// payload
            process.env.TOKEN_SECRET,// secret 
            { expiresIn: '2d' }

        )

        return res.status(201).json({ token: token });

    } catch (error) {
        next(error)

    }
})

//sign-up
router.post('/sign-in', async (req, res, next) => {
    try {
        //search the user by  username and password
const foundUser = await User.findOne({ username: req.body.username })
console.log(foundUser)
        if (!foundUser) 
            throw new Unauthorized('user does not exist');
        
        //compare the hash against the password

        //generate token 

        //send the response
return res.status(201).json('User does not exist' );

        //searching user 

    } catch (error) {
        next(error);
    }
})
//sign-in

export default router;