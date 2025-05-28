import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import NavBar from "./components/NavBar";
import LandingPage from "./components/LandingPage";
import Registration from "./components/Registration";
import TestPage from "./components/TestPage";
import LoginPage from "./components/LoginPage";
import AdminPage from "./components/AdminPage";
import ThankYouPage from "./components/ThankYouPage";
import InstructionsPage from "./components/InstructionsPage";
import personalityQuestions from "./data/personalityQuestions";
import intelligenceQuestions from "./data/intelligenceQuestions";
import careerQuestions from "./data/careerQuestions";
import learningQuestions from "./data/learningQuestions";

// Add Protected Route component
const ProtectedRoute = ({ children }) => {
  const userToken = localStorage.getItem('userToken');
  if (!userToken) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  const location = useLocation();
  const showNavBar = !["/", "/login", "/register"].includes(location.pathname);

  return (
    <>
      {showNavBar && <NavBar />}
      <Routes>
        <Route exact path="/" element={<LandingPage />} />
        <Route exact path="/login" element={<LoginPage />} />
        <Route
          exact
          path="/register"
          element={
            <ProtectedRoute>
              <Registration />
            </ProtectedRoute>
          }
        />
        <Route
          exact
          path="/personality"
          element={
            <ProtectedRoute>
              <TestPage title="Personality Test" questions={personalityQuestions} />
            </ProtectedRoute>
          }
        />
        <Route
          exact
          path="/intelligences"
          element={
            <ProtectedRoute>
              <TestPage title="Multiple Intelligences Test" questions={intelligenceQuestions} />
            </ProtectedRoute>
          }
        />
        <Route
          exact
          path="/career"
          element={
            <ProtectedRoute>
              <TestPage title="Career Preference Test" questions={careerQuestions} />
            </ProtectedRoute>
          }
        />
        <Route
          exact
          path="/learning"
          element={
            <ProtectedRoute>
              <TestPage title="Learning Styles Test" questions={learningQuestions} />
            </ProtectedRoute>
          }
        />
        <Route path="/admin" element={<AdminPage />} />
        <Route
          path="/thank-you"
          element={
            <ProtectedRoute>
              <ThankYouPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/instructions"
          element={
            <ProtectedRoute>
              <InstructionsPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;