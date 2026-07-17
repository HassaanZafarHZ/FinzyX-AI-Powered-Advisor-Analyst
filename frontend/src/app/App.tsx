import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "../contexts/ThemeContext";
import { AppProvider, useApp } from "../contexts/AppContext";
import { Login } from "./pages/auth/Login";
import { Signup } from "./pages/auth/Signup";
import { ForgotPassword } from "./pages/auth/ForgotPassword";
import { ResetPassword } from "./pages/auth/ResetPassword";
import { Onboarding } from "./pages/auth/Onboarding";
import { Dashboard } from "./pages/Dashboard";
import { AIRahbar } from "./pages/AIRahbar";
import { Screener } from "./pages/Screener";
import { StockDetail } from "./pages/StockDetail";
import { Portfolio } from "./pages/Portfolio";
import { Dividends } from "./pages/Dividends";
import { Subscription } from "./pages/Subscription";
import { Profile } from "./pages/Profile";

function AppRoutes() {
  const { currentUser, profileComplete, isInitializing } = useApp();

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={currentUser ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/signup" element={currentUser ? <Navigate to="/dashboard" replace /> : <Signup />} />
      <Route path="/forgot-password" element={currentUser ? <Navigate to="/dashboard" replace /> : <ForgotPassword />} />
      <Route path="/reset-password" element={currentUser ? <Navigate to="/dashboard" replace /> : <ResetPassword />} />
      
      {/* Protected Routes */}
      <Route path="/onboarding" element={
        currentUser ? <Onboarding /> : <Navigate to="/login" replace />
      } />
      <Route path="/dashboard" element={
        currentUser ? (
          profileComplete ? <Dashboard /> : <Navigate to="/onboarding" replace />
        ) : <Navigate to="/login" replace />
      } />
      <Route path="/ai-rahbar" element={
        currentUser ? <AIRahbar /> : <Navigate to="/login" replace />
      } />
      <Route path="/screener" element={
        currentUser ? <Screener /> : <Navigate to="/login" replace />
      } />
      <Route path="/stock/:symbol" element={
        currentUser ? <StockDetail /> : <Navigate to="/login" replace />
      } />
      <Route path="/portfolio" element={
        currentUser ? <Portfolio /> : <Navigate to="/login" replace />
      } />
      <Route path="/dividends" element={
        currentUser ? <Dividends /> : <Navigate to="/login" replace />
      } />
      <Route path="/subscription" element={
        currentUser ? <Subscription /> : <Navigate to="/login" replace />
      } />
      <Route path="/profile" element={
        currentUser ? <Profile /> : <Navigate to="/login" replace />
      } />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AppProvider>
    </ThemeProvider>
  );
}
