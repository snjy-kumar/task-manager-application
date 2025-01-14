import { BrowserRouter,  Route, Routes } from 'react-router-dom'
import './App.css' 
import Home from './pages/Home' 
import LoginPage from './pages/Login'
import SignupPage from './pages/Signup'

function App() {

  return (
   <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/signup' element={<SignupPage />} />
      </Routes> 
   </BrowserRouter>
  )
}

export default App
