import { Navbar } from './components';
import ProjectRoutes from './Routes';
import { BrowserRouter as Router } from 'react-router-dom';


function App() {
  return (
	<>
		<Router>
			<Navbar/>
			<ProjectRoutes/>
			{/* <Footer/> */}
		</Router>
	</>
  );
}

export default App;
