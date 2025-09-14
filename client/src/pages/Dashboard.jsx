import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';

import { FaWallet, FaMoneyBillWave, FaChartLine } from 'react-icons/fa';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import moment from 'moment';
import DashboardCard from '../components/Dashbaord/DashboardCard';
import RecentTransactions from '../components/Dashbaord/RecentTransactions';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const Dashboard = () => {
    const { expenses, incomes, loading } = useContext(AppContext);
    const [totalBalance, setTotalBalance] = useState(0);
    const [totalIncome, setTotalIncome] = useState(0);
    const [totalExpenses, setTotalExpenses] = useState(0);
    const [last60DaysExpenses, setLast60DaysExpenses] = useState([]);
    const [last30DaysIncome, setLast30DaysIncome] = useState([]);

    useEffect(() => {
        if (!loading) {
            // Calculate total balance
            const balance = incomes.reduce((acc, income) => acc + income.amount, 0) -
                expenses.reduce((acc, expense) => acc + expense.amount, 0);
            setTotalBalance(balance);

            // Calculate total income
            const incomeTotal = incomes.reduce((acc, income) => acc + income.amount, 0);
            setTotalIncome(incomeTotal);

            // Calculate total expenses
            const expenseTotal = expenses.reduce((acc, expense) => acc + expense.amount, 0);
            setTotalExpenses(expenseTotal);

            // Calculate last 60 days expenses
            const sixtyDaysAgo = moment().subtract(60, 'days').toDate();
            const last60DaysExpensesData = expenses.filter(expense => new Date(expense.date) >= sixtyDaysAgo);
            setLast60DaysExpenses(last60DaysExpensesData);

            // Calculate last 30 days income
            const thirtyDaysAgo = moment().subtract(30, 'days').toDate();
            const last30DaysIncomeData = incomes.filter(income => new Date(income.date) >= thirtyDaysAgo);
            setLast30DaysIncome(last30DaysIncomeData);
        }
    }, [expenses, incomes, loading]);

    // Prepare data for chart
    const chartData = {
        labels: last60DaysExpenses.map(expense => moment(expense.date).format('YYYY-MM-DD')),
        datasets: [
            {
                                label: 'Expenses Last 60 Days',
                data: last60DaysExpenses.map(expense => expense.amount),
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Expenses Chart (Last 60 Days)',
            },
        },
    };

    const recentTransactions = [...expenses, ...incomes]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);

    if (loading) {
        return <div className="text-center py-8">Loading dashboard data...</div>;
    }

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <DashboardCard title="Total Balance" value={totalBalance} icon={<FaWallet />} color="green" />
                <DashboardCard title="Total Income" value={totalIncome} icon={<FaMoneyBillWave />} color="blue" />
                <DashboardCard title="Total Expenses" value={totalExpenses} icon={<FaChartLine />} color="red" />
                <DashboardCard title="Last 30 Days Income" value={last30DaysIncome.reduce((acc, income) => acc + income.amount, 0)} icon={<FaMoneyBillWave />} color="purple" />
            </div>

            <div className="mb-4">
                <RecentTransactions transactions={recentTransactions} />
            </div>

            <div className="bg-white shadow-md rounded-md p-4">
                <h2 className="text-lg font-semibold mb-2">Expenses Chart (Last 60 Days)</h2>
                <Bar options={chartOptions} data={chartData} />
            </div>
        </div>
    );
};

export default Dashboard;