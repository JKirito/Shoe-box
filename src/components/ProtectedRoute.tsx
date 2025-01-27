import { RootState } from '@/lib/store';
import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = () => {
    const { isAuthenticated } = useSelector((state:RootState) => state.auth)
    return isAuthenticated? <Outlet /> : <Navigate to="/login" />
}

export default ProtectedRoute;