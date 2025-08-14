import express from "express";
import User from "../models/user.js";
import { InvalidData, Unauthorized} from "../utils/errors.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const router = express.Router();


//starting path: /api/auth

router.post('/sign-up', async (req, res, next) => {
    try {
        //user existence 

        if (req.body.password !== req.body.passwordConfirmation) {
            throw new InvalidData('Passwords do not match', 'password');
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

//sign-in
router.post('/sign-in', async (req, res, next) => {

    const { identifier, password } = req.body;
    try {
        //search the user by  username and password
const foundUser = await User.findOne({ 
    $or: [
        { username: identifier },
        { email: identifier }
    ]
})

        if (!foundUser) {
            throw new Unauthorized('User does not exist.');
        }

        //compare the hash against the password
        if (!bcrypt.compareSync(password, foundUser.password)) {
            throw new Unauthorized('Invalid password.');
        }
        
        //generate token 
        const token = jwt.sign(
            {
                user: {
                    _id: foundUser._id,
                    username: foundUser.username,
                    email: foundUser.email
                }
            },
            process.env.TOKEN_SECRET,
            { expiresIn: '4d' }
        );


        //send the response
        return res.status(200).json({ token: token });


    } catch (error) {
        next(error);
    }
})


export default router;