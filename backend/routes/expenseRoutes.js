import express from 'express';
import { addExpenses, deleteExpense, getAllExpenses } from '../controllers/expenseController.js';

const expenseRouter = express.Router();

expenseRouter.get('/', getAllExpenses);
expenseRouter.post('/', addExpenses);  // Changed .add() to .post()
expenseRouter.delete('/delete/:id', deleteExpense);

export default expenseRouter;
