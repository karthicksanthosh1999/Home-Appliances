import { FC } from 'react';
import { Link } from 'react-router-dom';

const NetworkError: FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-4xl font-bold">Network Error</h1>
      <p className="mt-4">Unable to connect to the network. Please check your connection.</p>
      <Link to="/" className="mt-6 text-blue-600 underline">
        Try Again
      </Link>
    </div>
  );
};

export default NetworkError;
