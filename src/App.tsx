
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Register from './Components/User/Register'
import Users from './Components/User/Users'
import Login from './Components/User/Login'
import Profile from './Components/User/Profile'
import Projects from './Components/Projects/Projects'
import Update from './Components/User/Update'
import Show from './Components/Projects/Show'
import Create from './Components/Projects/Create'
function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/update" element={<Update />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/users" element={<Users />} />
          <Route path="/project_details" element={<Show />} />
          <Route path="/projects/new" element={<Create />} />


        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
