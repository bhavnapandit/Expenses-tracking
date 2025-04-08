import express from 'express';
import { signUp, login} from '../controllers/userController.js';

const userRouter = express.Router();

// POST /signup: Sign up a user
userRouter.post('/signup', signUp);

// POST /login: Log in a user
userRouter.post('/login', login);


export default userRouter;
