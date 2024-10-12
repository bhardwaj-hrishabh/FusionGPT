import { NextFunction, Request, Response } from "express";
import User from "../models/User.js";
import { hash, compare } from "bcrypt";
import { createToken } from "../utils/token-manager.js";
import { COOKIE_NAME } from "../utils/constants.js";

export const getAllUsers = async(
    req:Request, 
    res:Response,
    next: NextFunction
) => {
    try {
        // get all users
        const users = await User.find();

        return res.status(200).json({
            message: "OK", 
            users
        });
    } 
    catch (error) {
        console.log("ERROR :- ",error);
        return res.status(200).json({
            message: "ERROR", 
            cause: error.message
        });
    }
}

export const userSignup = async(
    req:Request, 
    res:Response,
    next: NextFunction
) => {
    try {
        // user SignUp
        const {name, email, password} = req.body;
        const existinUser = await User.findOne({email});
        if(existinUser) return res.status(401).send("User already registered");
        const hashedPassword = await hash(password, 10);
        const user = new User({name, email, password: hashedPassword});
        await user.save();


        // Create token and store cookies
        res.clearCookie(COOKIE_NAME, {
            httpOnly: true,
            domain: "localhost",
            signed: true,
            path: "/"
        });

        const token = createToken(user._id.toString(), user.email, "7d");
        const expires = new Date();
        expires.setDate(expires.getDate()+7);
        res.cookie( COOKIE_NAME , token, {
            path: "/", 
            domain: "localhost", 
            expires,
            httpOnly: true,
            signed: true,
        });



        return res.status(201).json({
            message: "User created successfully",
            // id: user._id.toString(),
            name: user.name,
            email: user.email
        })
    } 
    catch (error) {
        console.log("ERROR :- ",error);
        return res.status(500).json({
            message: "ERROR", 
            cause: error.message
        });
    }
}


export const userLogin = async(
    req:Request, 
    res:Response,
    next: NextFunction
) => {
    try {
        // user LogIn
        const {email, password} = req.body;
        const user = await User.findOne({email});

        if(!user){
            return res.status(401).send("User not registered");
        }
        
        const isValidPassword = await compare(password, user.password);

        if(!isValidPassword){
            return res.status(403).send("Incorrect Password");
        }


        res.clearCookie(COOKIE_NAME, {
            httpOnly: true,
            domain: "localhost",
            signed: true,
            path: "/"
        });

        const token = createToken(user._id.toString(), user.email, "7d");
        const expires = new Date();
        expires.setDate(expires.getDate()+7);
        res.cookie( COOKIE_NAME , token, {
            path: "/", 
            domain: "localhost", 
            expires,
            httpOnly: true,
            signed: true,
        });


        return res.status(200).json({
            message: "User LogedIn Successfully",
            // id: user._id.toString(),
            name: user.name,
            email: user.email
        })
    } 
    catch (error) {
        console.log("ERROR :- ",error);
        return res.status(500).json({
            message: "ERROR", 
            cause: error.message
        });
    }
}



export const verifyUser = async(
    req:Request, 
    res:Response,
    next: NextFunction
) => {
    try {
        // user token check
        const user = await User.findById( res.locals.jwtData.id);

        if(!user){
            return res.status(401).send("User not registered OR Token malfunctioned");
        }
        console.log(user._id.toString(), res.locals.jwtData.id)

        if(user._id.toString() !== res.locals.jwtData.id){
            return res.status(401).send("Permissions didn't match");
        }


        return res.status(200).json({
            message: "User LogedIn Successfully",
            // id: user._id.toString(),
            name: user.name,
            email: user.email
        })
    } 
    catch (error) {
        console.log("ERROR :- ",error);
        return res.status(500).json({
            message: "ERROR", 
            cause: error.message
        });
    }
}


export const userLogout = async(
    req:Request, 
    res:Response,
    next: NextFunction
) => {
    try {
        // user token check
        const user = await User.findById( res.locals.jwtData.id);

        if(!user){
            return res.status(401).send("User not registered OR Token malfunctioned");
        }
        console.log(user._id.toString(), res.locals.jwtData.id)

        if(user._id.toString() !== res.locals.jwtData.id){
            return res.status(401).send("Permissions didn't match");
        }

        res.clearCookie(COOKIE_NAME, {
            httpOnly: true,
            domain: "localhost",
            signed: true,
            path: "/"
        });

        return res.status(200).json({
            message: "User LogedIn Successfully",
            // id: user._id.toString(),
            name: user.name,
            email: user.email
        })
    } 
    catch (error) {
        console.log("ERROR :- ",error);
        return res.status(500).json({
            message: "ERROR", 
            cause: error.message
        });
    }
}
