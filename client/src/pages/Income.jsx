import React from 'react';
import IncomeForm from '../components/Income/IncomeForm';
import IncomeList from '../components/Income/IncomeList';

const Income = () => {
    return (
        <div className="container mx-auto py-8">
            <IncomeForm />
            <IncomeList />
        </div>
    );
};

export default Income;