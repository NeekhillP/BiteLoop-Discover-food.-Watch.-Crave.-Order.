import userModel from "../models/user.model.js";
import foodPartnerModel from "../models/foodPartner.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


/**
 * Authentication Controllers for Users
 */

export async function registerUserController(req, res){
    try{
        const {fullName, email, password} = req.body;

        const existingUser = await userModel.findOne({
        email
        })

        if(existingUser){
        return res.status(400).json({
            message: "User already exists"
        })}

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await userModel.create({
            fullName,
            email,
            password: hashedPassword
        })

        const token = jwt.sign({
            id: newUser._id,
        }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        })

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 60 * 60 * 1000 // 1 hour
        })

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email
            }
        })

    }catch(err){
        console.log(err)
    }
}


export async function loginUserController(req, res){
    try{
        const {email, password} = req.body;

        const user = await userModel.findOne({
            email
        })

        if(!user){
            return res.status(400).json({
                message: "User does not exist"
            })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(!isPasswordValid){
            return res.status(400).json({
                message: "Invalid email or password"
            })
        }

        const token = jwt.sign({
            id: user._id,
        }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        })

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 60 * 60 * 1000 // 1 hour
        })

        res.status(200).json({
            message: "User logged in successfully",
            user: {
                id: user._id,
                email: user.email
            }
        })
    } catch(err){
        console.log(err)
    }
}


export async function logoutUserController(req, res){
    try{
        res.clearCookie("token")
        res.status(200).json({
            message: "User logged out successfully"
        })
    }catch(err){
        console.log(err)
    }
}



/**
 * Authentication Controllers for Food Partners
 */
export async function registerFoodPartnerController(req, res){
    try{
        const {name, email, password, phone, address, contactName} = req.body;

        const existingFoodPartner = await foodPartnerModel.findOne({
            email
        })

        if(existingFoodPartner){
            return res.status(400).json({
                message: "Food Partner already exists"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newFoodPartner = await foodPartnerModel.create({
            name,
            email,
            password: hashedPassword,
            phone,
            address,
            contactName
        })

        const token = jwt.sign({
            id: newFoodPartner._id,
        }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        })

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 60 * 60 * 1000 // 1 hour
        })

        res.status(201).json({
            message: "Food Partner registered successfully",
            foodPartner: {
                id: newFoodPartner._id,
                name: newFoodPartner.name,
                email: newFoodPartner.email,
                phone: newFoodPartner.phone,
                address: newFoodPartner.address,
                contactName: newFoodPartner.contactName
            }
        })

    } catch(err){
        console.log(err)
    }
}


export async function loginFoodPartnerController(req, res){
    try{
        const {email, password} = req.body;

        const foodPartner = await foodPartnerModel.findOne({
            email
        })

        if(!foodPartner){
            return res.status(400).json({
                message: "Food Partner does not exist"
            })
        }

        const isPasswordValid = await bcrypt.compare(password, foodPartner.password);

        if(!isPasswordValid){
            return res.status(400).json({
                message: "Invalid email or password"
            })
        }

        const token = jwt.sign({
            id: foodPartner._id,
        }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        })

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 60 * 60 * 1000 // 1 hour
        })

        res.status(200).json({
            message: "Food Partner logged in successfully",
            foodPartner: {
                id: foodPartner._id,
                email: foodPartner.email
            }
        })
    } catch(err){
        console.log(err)
    }
}

export async function logoutFoodPartnerController(req, res){
    try{
        res.clearCookie("token")
        res.status(200).json({
            message: "Food Partner logged out successfully"
        })
    }catch(err){
        console.log(err)
    }
}