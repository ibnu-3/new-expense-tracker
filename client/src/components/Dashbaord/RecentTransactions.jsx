import React from 'react';
import moment from 'moment';

const RecentTransactions = ({ transactions }) => {
    return (
        <div className="bg-white shadow-md rounded-md p-4">
            <h2 className="text-lg font-semibold mb-2">Recent Transactions</h2>
            {transactions.length === 0 ? (
                <p>No recent transactions.</p>
            ) : (
                <ul className="divide-y divide-gray-200">
                    {transactions.map((transaction) => (
                        <li key={transaction._id} className="py-2 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-900">{transaction.title}</p>
                                <p className="text-gray-500 text-xs">{moment(transaction.date).format('YYYY-MM-DD')}</p>
                            </div>
                            <div className={transaction.type === 'expense' ? "text-red-500" : "text-green-500"}>
                                ${transaction.amount}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default RecentTransactions;