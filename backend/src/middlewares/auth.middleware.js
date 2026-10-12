import foodPartnerModel from "../models/foodPartner.model.js";
import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";

// Store profiles are readable by either signed-in account type.
export async function authProfileViewerMiddleware(req, res, next) {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Please log in to view this store.' });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const [user, partner] = await Promise.all([
            userModel.findById(decoded.id).select('_id'),
            foodPartnerModel.findById(decoded.id).select('_id'),
        ]);
        if (!user && !partner) return res.status(401).json({ message: 'Please log in to view this store.' });
        return next();
    } catch {
        return res.status(401).json({ message: 'Please log in to view this store.' });
    }
}



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

        if(!foodPartner) {
            return res.status(401).json({
                message: "Please log in as a food partner to access this resource"
            })
        }
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

        const user = await userModel.findById(
            decoded.id
        )

        if (!user) {
            return res.status(401).json({ message: "Please log in as a user to access this resource" });
        }
        req.user = user;

        return next();
    }
    catch(err){
        return res.status(401).json({
            message: "Unauthorized access"
        })
    }
}
