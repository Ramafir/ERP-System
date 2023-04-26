import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import Login from '@/views/pages/Login';
import Users from '@/views/pages/Users';
import Dashboard from '@/views/pages/Dashboard';
import Contracts from '@/views/pages/Contracts';
import PrivateRoute from '@/components/PrivateRoute';
import 'react-toastify/dist/ReactToastify.css';
import Vacations from './views/pages/Vacations';

function App() {
    return (
        <BrowserRouter>
            <ToastContainer position={'bottom-right'} />
            <Routes>
                <Route exact path="/" element={<PrivateRoute />}>
                    <Route exact path="/" element={<Dashboard />} />
                    <Route exact path="/users" element={<Users />} />
                    <Route exact path="/contracts" element={<Contracts />} />
                    <Route exact path="/vacations" element={<Vacations />} />
                </Route>
                <Route exact path="/login" element={<Login />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
