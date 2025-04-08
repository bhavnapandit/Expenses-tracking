import express from 'express';
import { addExpenses, deleteExpense, getAllExpenses, getUserExpenses } from '../controllers/expenseController.js';

const expenseRouter = express.Router();

expenseRouter.get('/', getAllExpenses);
expenseRouter.get('/:userId', getUserExpenses);
expenseRouter.post('/', addExpenses);  // Changed .add() to .post()
expenseRouter.delete('/delete/:id', deleteExpense);

export default expenseRouter;
