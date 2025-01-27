import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import { makeStore } from '@/lib/store'
import './index.css'
import App from './App.tsx'
import Login from './components/Login.tsx'
import ProtectedRoute from './components/ProtectedRoute.tsx'
import Signup from './components/Signup.tsx'

const store = makeStore()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<App />} />
          </Route>
        </Routes>
      </Router>
    </Provider>
  </StrictMode>,
)
