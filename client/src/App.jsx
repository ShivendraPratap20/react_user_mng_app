import Home from './pages/Home.jsx';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import './index.css';
import { Route, Routes } from 'react-router-dom'

function App() {
  return(<>
    <Routes>
      <Route path='/' element={<SignIn/>}/>
      <Route path='/home' element={<Home/>}/> 
      <Route path='/signup' element={<SignUp/>}/>
    </Routes>
  </>)
}

export default App