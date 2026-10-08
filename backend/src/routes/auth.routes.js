import Router from 'express';
import * as authController from '../controllers/auth.controllers.js';


const authRouter = Router();

/**
 * @route POST /api/auth/user/register
 * @desc Register a new use
 */
authRouter.post('/user/register', authController.registerUserController)


/**
 * @route POST /api/auth/user/login
 * @desc Login a use
 */
authRouter.post('/user/login', authController.loginUserController)


/**
 * @route GET /api/auth/user/logout
 * @desc Logout a user
 */
authRouter.get('/user/logout', authController.logoutUserController)



// Food Partner Routes

/**
 * @route POST /api/auth/food-partner/register
 * @desc Register a new food partner
 */
authRouter.post('/food-partner/register', authController.registerFoodPartnerController)


/**
 * @route POST /api/auth/food-partner/login
 * @desc Login a food partner
 */
authRouter.post('/food-partner/login', authController.loginFoodPartnerController)


/**
 * @route GET /api/auth/food-partner/logout
 * @desc Logout a food partner
 */
authRouter.get('/food-partner/logout', authController.logoutFoodPartnerController)


export default authRouter;