
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Register from './Components/User/Register'
import Users from './Components/User/Users'
import Login from './Components/User/Login'
import Profile from './Components/User/Profile'
import Projects from './Components/Projects/Projects'
import Update from './Components/User/Update'
import Project from './Components/Projects/Project'
import Create from './Components/Projects/Create'
import TaskForm from './Components/Tasks/TaskForm'
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
          <Route path="/project" element={<Project />} />
          <Route path="/projects/new" element={<Create />} />

          <Route path="/edit_task" element={<TaskForm />} />
          <Route path="/new_task" element={<TaskForm />} />




        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
