import Routes from './routes';
import Global from './styles/global';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <>
      <ToastContainer/>
      <Global></Global>
      <Routes/>
    </>

    
  );
}

export default App;
