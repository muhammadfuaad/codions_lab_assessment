
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Register from './Components/User/Register'
import UsersIndex from './Components/User/UsersIndex'
function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/all_users" element={<UsersIndex />} />

        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
