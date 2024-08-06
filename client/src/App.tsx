import { Navbar } from './components';
import ProjectRoutes from './Routes';
import { BrowserRouter as Router } from 'react-router-dom';
import MagicProvider from './hooks/magicProvider';


function App() {
  return (
		<Router>
			<MagicProvider>
			<Navbar/>
			<ProjectRoutes/>
			{/* <Footer/> */}
			</MagicProvider>
		</Router>
  );
}

export default App;
