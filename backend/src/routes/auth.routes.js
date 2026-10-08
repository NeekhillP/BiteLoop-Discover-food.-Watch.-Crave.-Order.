import Router from 'express';
import * as authController from '../controllers/auth.controllers.js';


const authRouter = Router();

/**
 * @route POST /api/auth/user/register
 * @desc Register a new user
 * @access Public
 */
authRouter.post('/user/register', authController.registerUserController)


/**
 * @route POST /api/auth/user/login
 * @desc Login a user
 * @access Public
 */
authRouter.post('/user/login', authController.loginUserController)


/**
 * @route GET /api/auth/user/logout
 * @desc Logout a user
 * @access Public
 */
authRouter.get('/user/logout', authController.logoutUserController)


export default authRouter;