
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Register from './Components/User/Register'
import Users from './Components/User/Users'
import Login from './Components/User/Login'
import Profile from './Components/User/Profile'
import Projects from './Components/Projects/Projects'
import UserForm from './Components/User/UserForm'
import Project from './Components/Projects/Project'
import ProjectForm from './Components/Projects/ProjectForm'
import TaskForm from './Components/Tasks/TaskForm'
import NewUsers from './Components/User/NewUsers'
function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* user */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/edit_user" element={<UserForm />} />
          <Route path="/profile" element={<Profile />} />
          {/* projects */}
          <Route path="/projects" element={<Projects />} />
          <Route path="/users" element={<Users />} />
          <Route path="/new_users" element={<NewUsers/>} />

          <Route path="/project" element={<Project />} />
          <Route path="/new_project" element={<ProjectForm />} />
          <Route path="/edit_project" element={<ProjectForm />} />

          {/* tasks */}
          <Route path="/edit_task" element={<TaskForm />} />
          <Route path="/new_task" element={<TaskForm />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
