import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './components/Toast';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Recipients } from './pages/Recipients';
import { SendHistory } from './pages/SendHistory';
import { Cases } from './pages/Cases';
import { Settings } from './pages/Settings';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthDisabled = import.meta.env.VITE_DISABLE_AUTH === 'true';
  const isAuthenticated =
    isAuthDisabled || localStorage.getItem('isAuthenticated') === 'true';
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const App: React.FC = () => {
  const isAuthDisabled = import.meta.env.VITE_DISABLE_AUTH === 'true';

  return (
    <ToastProvider>
      <HashRouter>
        <Routes>
          <Route
            path="/login"
            element={isAuthDisabled ? <Navigate to="/dashboard" replace /> : <Login />}
          />
          
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="recipients" element={<Recipients />} />
            <Route path="send-history" element={<SendHistory />} />
            <Route path="cases" element={<Cases />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </HashRouter>
    </ToastProvider>
  );
};

export default App;
