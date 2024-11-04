import { Navbar } from './components';
import ProjectRoutes from './Routes';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './hooks/AuthContext';

function App() {
    return (
        <Router>
            <AuthProvider>
                <Navbar />
                <ProjectRoutes />
                {/* <Footer/> */}
            </AuthProvider>
        </Router>
    );
}

export default App;
