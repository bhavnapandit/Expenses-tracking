import express from 'express';
import { signUp, login, logout } from '../controllers/userController.js';

const userRouter = express.Router();

// POST /signup: Sign up a user
userRouter.post('/signup', signUp);

// POST /login: Log in a user
userRouter.post('/login', login);

// POST /logout: Log out a user
userRouter.post('/logout', logout);

export default userRouter;
