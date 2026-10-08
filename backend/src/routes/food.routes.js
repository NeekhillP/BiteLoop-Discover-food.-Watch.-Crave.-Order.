import Router from "express";
import * as foodController from "../controllers/food.controller.js";
import { authFoodPartnerMiddleware } from "../middlewares/auth.middleware.js";


const foodRouter = Router();


/**
 * @route POST /api/food/ [protected route]
 * @desc Create a new food item
 */
foodRouter.post('/', authFoodPartnerMiddleware, foodController.createFood)



export default foodRouter;