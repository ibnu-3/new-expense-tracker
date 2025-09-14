import React from 'react';

const DashboardCard = ({ title, value, icon, color }) => {
    return (
        <div className={`bg-${color}-100 p-4 rounded-md shadow-md flex items-center justify-between`}>
            <div>
                <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
                <p className="text-2xl font-bold text-gray-900">${value}</p>
            </div>
            <div className={`text-${color}-500 text-4xl`}>
                {icon}
            </div>
        </div>
    );
};

export default DashboardCard;