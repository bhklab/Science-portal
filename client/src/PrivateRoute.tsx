import React, { ReactNode, useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from './hooks/AuthContext';
import { ProgressSpinner } from 'primereact/progressspinner';

type PrivateRouteProps = {
    children: ReactNode;
};

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
    const authContext = useContext(AuthContext);
    const location = useLocation();

    if (!AuthContext) {
        return null;
    }

    // Check if the user is authenticated, if not redirect to login
    if (authContext?.status === 'loading') {
        return (
            <div className="flex justify-content-center items-center">
                <ProgressSpinner
                    style={{ width: '400px', height: '400px' }}
                    strokeWidth="4"
                    fill="var(--surface-ground)"
                    animationDuration="1s"
                />
            </div>
        );
    }

    if (!authContext?.user) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return <>{children}</>;
};

export default PrivateRoute;
