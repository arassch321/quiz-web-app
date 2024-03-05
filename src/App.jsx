import React, { useEffect, useState } from 'react'
import './App.css'
import { Login, DashboardAdmin, CreateQuiz, CreateQuestion, ViewQuiz, EditQuiz } from './pages'
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Loader from './common/Loader';
import Header from './components/Header';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const PrivateRoute = ({ element, ...rest }) => {
    const location = useLocation();
    const token = sessionStorage.getItem("token");
    return token ? (
      element
    ) : (
      <Login from={location.pathname} />
    );
  }

  return loading ? (
    <Loader />
  ) : (
    <BrowserRouter>
    <div className="z-10 top-0 left-0 w-full h-full bg-gray-100/60">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard-admin" element={<PrivateRoute element={<DashboardAdmin />} />} />
        <Route path="/create-quiz" element={<PrivateRoute element={<CreateQuiz />} />} />
        <Route path ="/edit-quiz/:IDQuiz" element={<PrivateRoute element={<EditQuiz />} />} />
        <Route path="/create-question/:IDQuiz" element={<PrivateRoute element={<CreateQuestion />} />} />
        <Route path="/view-quiz/:IDQuiz" element={<PrivateRoute element={<ViewQuiz />} />} />
        <Route path="*" element={<h1>Not Found</h1>} />
      </Routes>
    </div>
    </BrowserRouter>

    )
}

export default App
