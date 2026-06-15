import React from 'react';
import { Navigate } from 'react-router-dom';

function isUserLoggedProtect({ user, children }) {
    
    if (user != null) {
        return <Navigate to="/" replace />;
    }

    return children;
}

export default isUserLoggedProtect;