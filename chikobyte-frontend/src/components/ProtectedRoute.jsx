import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ user, isAdminRoute, children }) {
    
    if (!user) {
        return <Navigate to="/" replace />;
    }

    if (isAdminRoute === true && user.isadmin === false) {
        // User is logged in, but doesn't have the right permissions
        return <Navigate to="/" replace />; 
    }

    return children;
}

export default ProtectedRoute;