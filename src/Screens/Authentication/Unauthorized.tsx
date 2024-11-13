import React from 'react';

const Unauthorized: React.FC = () => {
    return (
        <>
            <div className='dark:text-gray-400'>
                <h1>403 - Unauthorized</h1>
                <p>You do not have permission to view this page.</p>
            </div>
        </>
    );
};

export default Unauthorized;
