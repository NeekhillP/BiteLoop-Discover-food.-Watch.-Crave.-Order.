import Router from "express";
import * as foodController from "../controllers/food.controller.js";
import { authFoodPartnerMiddleware } from "../middlewares/auth.middleware.js";
import multer from "multer";

const foodRouter = Router();


const upload = multer({
    storage: multer.memoryStorage(),
})


/**
 * @route POST /api/food/ [protected route]
 * @desc Create a new food item
 */
foodRouter.post('/', 
    authFoodPartnerMiddleware, 
    upload.single('video'), 
    foodController.createFood
)



export default foodRouter;