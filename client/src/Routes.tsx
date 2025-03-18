import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Publication from './pages/Publication';
import Analytics from './pages/Analytics';
import About from './pages/About';
import PiProfile from './pages/PiProfile';
import Login from './pages/Login';
import PrivateRoute from './PrivateRoute';
import SubmitPublication from './pages/SubmitPublication';

const ProjectRoutes = () => {
    return (
        <React.Suspense fallback={<>Loading...</>}>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/about" element={<About />} />
                <Route path="/publication/:doi" element={<Publication />} />
                <Route path="/login" element={<Login />} />
                <Route
                    path="/profile"
                    element={
                        // <PrivateRoute>
                        <PiProfile />
                        // </PrivateRoute>
                    }
                />
                <Route
                    path="/submit-publication"
                    element={
                        // <PrivateRoute>
                        <SubmitPublication />
                        // </PrivateRoute>
                    }
                />
            </Routes>
        </React.Suspense>
    );
};

export default ProjectRoutes;
