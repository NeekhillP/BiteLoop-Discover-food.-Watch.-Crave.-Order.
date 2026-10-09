import foodPartnerModel from "../models/foodPartner.model.js";
import jwt from "jsonwebtoken";



export async function authFoodPartnerMiddleware(req, res, next){

        const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

        if(!token){
            return res.status(401).json({ message: "Unauthorized access" });
        }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);


        const foodPartner = await foodPartnerModel.findById(
            decoded.id
        )

        req.foodPartner = foodPartner;

        return next();

    } catch(err){
        return res.status(401).json({
            message: "Unauthorized access"
        })
    }
}


export async function authUserMiddleware(req, res, next){
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if(!token){
        return res.status(401).json({ message: "Unauthorized access" });
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await foodPartnerModel.findById(
            decoded.id
        )

        req.user = user;

        return next();
    }
    catch(err){
        return res.status(401).json({
            message: "Unauthorized access"
        })
    }
}