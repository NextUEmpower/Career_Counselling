import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import NavBar from "./components/NavBar";
import LandingPage from "./components/LandingPage";
import TestPage from "./components/TestPage";
import LoginPage from "./components/LoginPage";
import AdminPage from "./components/AdminPage";
import ThankYouPage from "./components/ThankYouPage";
import InstructionsPage from "./components/InstructionsPage";
import Registration from "./components/Registration";
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

// Add Test Flow Route component
const TestFlowRoute = ({ children }) => {
  const userToken = localStorage.getItem('userToken');
  const hasSeenInstructions = localStorage.getItem('hasSeenInstructions');
  
  if (!userToken) {
    return <Navigate to="/login" replace />;
  }
  
  if (!hasSeenInstructions) {
    return <Navigate to="/instructions" replace />;
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
        <Route exact path="/register" element={<Registration />} />
        <Route exact path="/login" element={<LoginPage />} />
        <Route
          exact
          path="/instructions"
          element={
            <ProtectedRoute>
              <InstructionsPage />
            </ProtectedRoute>
          }
        />
        <Route
          exact
          path="/personality"
          element={
            <TestFlowRoute>
              <TestPage 
                title="Personality Test" 
                questions={personalityQuestions}
                nextTest="/intelligences"
              />
            </TestFlowRoute>
          }
        />
        <Route
          exact
          path="/intelligences"
          element={
            <TestFlowRoute>
              <TestPage 
                title="Multiple Intelligences Test" 
                questions={intelligenceQuestions}
                nextTest="/career"
              />
            </TestFlowRoute>
          }
        />
        <Route
          exact
          path="/career"
          element={
            <TestFlowRoute>
              <TestPage 
                title="Career Preference Test" 
                questions={careerQuestions}
                nextTest="/learning"
              />
            </TestFlowRoute>
          }
        />
        <Route
          exact
          path="/learning"
          element={
            <TestFlowRoute>
              <TestPage 
                title="Learning Styles Test" 
                questions={learningQuestions}
                nextTest="/thank-you"
              />
            </TestFlowRoute>
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
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;