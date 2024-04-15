import { useEffect } from "react";
import { useAuth } from "../contexts/fakeAuthContext";
import { useNavigate } from "react-router-dom";


function ProtectedRoute({ children }) {

    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    useEffect(
        function () {
            if (!isAuthenticated) {
                alert("Login First")
                navigate('/');
            }
        }, [isAuthenticated, navigate]
    )
    return isAuthenticated ? children : null;
}

export default ProtectedRoute
