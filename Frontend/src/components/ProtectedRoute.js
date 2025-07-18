import { useAuth}   from   "../context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({allowedRoles}) => {
    const { user, isLoggedIn } = useAuth();

    console.log("User in ProtectedRoute:", user);
    console.log("isLoggedIn:", isLoggedIn);
    console.log("Allowed Roles:", allowedRoles);

    
    if (!isLoggedIn) {
        return <Navigate to="/auth" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user?.role?.toUpperCase())) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
