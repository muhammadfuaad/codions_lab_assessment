
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Register from './Components/User/Register'
import UsersIndex from './Components/User/UsersIndex'
import Login from './Components/User/Login'
import Profile from './Components/User/Profile'
import Projects from './Components/Projects/Projects'
import Update from './Components/User/Update'
import Show from './Components/Projects/Show'
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
          <Route path="/all_users" element={<UsersIndex />} />
          <Route path="/project_details" element={<Show />} />

        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
