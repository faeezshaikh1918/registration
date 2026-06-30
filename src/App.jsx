import { Routes, Route } from 'react-router-dom'
import RegistrationForm from './RegistrationForm.jsx'
import RecordsPage from './RecordsPage.jsx'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<RegistrationForm />} />
      <Route path="/records" element={<RecordsPage />} />
    </Routes>
  )
}

export default App
