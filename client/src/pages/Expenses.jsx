import React from 'react';
import ExpenseForm from '../components/Expense/ExpenseForm';
import ExpenseList from '../components/Expense/ExpenseList';

const Expenses = () => {
    return (
        <div className="container mx-auto py-8">
            <ExpenseForm />
            <ExpenseList />
        </div>
    );
};

export default Expenses;