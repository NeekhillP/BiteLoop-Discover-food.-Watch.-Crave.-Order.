import Router from "express";
import * as foodController from "../controllers/food.controller.js";
import { authFoodPartnerMiddleware, authUserMiddleware } from "../middlewares/auth.middleware.js";
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

/**
 * @route GET /api/food/ [protected route]
 * @desc Get all food items
 */
foodRouter.get('/', 
    authUserMiddleware,
    foodController.getAllFood)

export default foodRouter;