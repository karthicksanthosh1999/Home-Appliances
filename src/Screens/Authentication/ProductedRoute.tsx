import { FC } from 'react';
import { Navigate } from 'react-router-dom';
import Encryption from '../../Components/Encryption/Encryption';


interface ProtectedRouteProps {
    element: JSX.Element;
    allowedRoles: string[];
}

const ProductedRoute: FC<ProtectedRouteProps> = ({ element, allowedRoles }) => {
    const localUser = Encryption({ type: 'A2B' })
    return localUser && allowedRoles.includes(localUser as string) ? (
        element
    ) : (
        <Navigate to="/unauthorized" replace />
    );
};

export default ProductedRoute
