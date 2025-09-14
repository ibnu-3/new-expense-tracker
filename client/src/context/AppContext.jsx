import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

import { BASE_URL } from '../utils/apiPaths';
import { AuthContext } from './AuthContext';

const AppContext = createContext();

const AppProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [expenses, setExpenses] = useState([]);
    const [incomes, setIncomes] = useState([]);
    const [loading, setLoading] = useState(true); // Add loading state

    useEffect(() => {
        const fetchData = async () => {
            if (user) {
                try {
                    setLoading(true);
                    const expensesResponse = await axios.get(`${BASE_URL}/expenses`);
                    setExpenses(expensesResponse.data);

                    const incomesResponse = await axios.get(`${BASE_URL}/income`);
                    setIncomes(incomesResponse.data);
                } catch (error) {
                    console.error("Error fetching data:", error);
                } finally {
                    setLoading(false);
                }
            } else {
                setExpenses([]);
                setIncomes([]);
                setLoading(false);
            }
        };

        fetchData();
    }, [user]);

    const addExpense = async (expenseData) => {
        try {
            const response = await axios.post(`${BASE_URL}/expenses`, expenseData);
            setExpenses([...expenses, response.data]);
        } catch (error) {
            console.error("Error adding expense:", error);
            throw error;
        }
    };

    const updateExpense = async (id, expenseData) => {
        try {
            const response = await axios.put(`${BASE_URL}/expenses/${id}`, expenseData);
            setExpenses(expenses.map(expense => (expense._id === id ? response.data : expense)));
        } catch (error) {
            console.error("Error updating expense:", error);
            throw error;
        }
    };

    const deleteExpense = async (id) => {
        try {
            await axios.delete(`${BASE_URL}/expenses/${id}`);
            setExpenses(expenses.filter(expense => expense._id !== id));
        } catch (error) {
            console.error("Error deleting expense:", error);
            throw error;
        }
    };

    const addIncome = async (incomeData) => {
        try {
            const response = await axios.post(`${BASE_URL}/income`, incomeData);
            setIncomes([...incomes, response.data]);
        } catch (error) {
            console.error("Error adding income:", error);
            throw error;
        }
    };

    const updateIncome = async (id, incomeData) => {
        try {
            const response = await axios.put(`${BASE_URL}/income/${id}`, incomeData);
            setIncomes(incomes.map(income => (income._id === id ? response.data : income)));
        } catch (error) {
            console.error("Error updating income:", error);
            throw error;
        }
    };

    const deleteIncome = async (id) => {
        try {
            await axios.delete(`${BASE_URL}/income/${id}`);
            setIncomes(incomes.filter(income => income._id !== id));
        } catch (error) {
            console.error("Error deleting income:", error);
            throw error;
        }
    };

    const value = {
        expenses,
        incomes,
        loading,
        addExpense,
        updateExpense,
        deleteExpense,
        addIncome,
        updateIncome,
        deleteIncome,
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export { AppContext, AppProvider };