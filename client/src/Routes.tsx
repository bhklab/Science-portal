import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Publication from './pages/Publication';

const ProjectRoutes = () => {
    return (
        <React.Suspense fallback={<>Loading...</>}>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/publication/:doi" element={<Publication />} />
            </Routes>
        </React.Suspense>
    );
};
export default ProjectRoutes;
