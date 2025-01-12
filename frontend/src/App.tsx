import { BrowserRouter,  Route, Routes } from 'react-router-dom'
import './App.css' 
import Home from './pages/Home' 
import LoginPage from './pages/Login'
import SignupPage from './pages/Signup'
import Navbar from './components/ui/Navbar'

function App() {

  return (
   <BrowserRouter>
    {/* <Navbar /> */}
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/signup' element={<SignupPage />} />
      </Routes> 
   </BrowserRouter>
  )
}

export default App
