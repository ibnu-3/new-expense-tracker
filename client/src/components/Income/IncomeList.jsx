import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash } from 'react-icons/fa';
import moment from 'moment';

const IncomeList = () => {
    const { incomes, deleteIncome } = useContext(AppContext);

    const handleDelete = async (id) => {
        try {
            await deleteIncome(id);
            toast.success('Income deleted successfully!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete income');
        }
    };

    return (
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <h2 className="text-2xl font-bold mb-4">Incomes</h2>
            {incomes.length === 0 ? (
                <p>No incomes added yet.</p>
            ) : (
                <table className="table-auto w-full">
                    <thead>
                        <tr>
                            <th className="px-4 py-2">Title</th>
                            <th className="px-4 py-2">Amount</th>
                            <th className="px-4 py-2">Date</th>
                            <th className="px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {incomes.map((income) => (
                            <tr key={income._id}>
                                <td className="border px-4 py-2">{income.title}</td>
                                <td className="border px-4 py-2">${income.amount}</td>
                                <td className="border px-4 py-2">{moment(income.date).format('YYYY-MM-DD')}</td>
                                <td className="border px-4 py-2">
                                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded mr-2">
                                        <FaEdit />
                                    </button>
                                    <button onClick={() => handleDelete(income._id)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-2 rounded">
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default IncomeList;