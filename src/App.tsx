import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { useToastContext } from './contexts';
import { useAuthContext } from './contexts';
import { LoginPage, RegisterPage, DashboardPage } from './pages';
import { Loading, ToastContainer, TokenExpiryDialog } from './components/ui';
import { ToastProvider, AuthProvider, LanguageProvider } from './contexts';
import { CurrencyExample } from './components/examples/CurrencyExample';
import { ROUTES } from './constants';
import { STORAGE_KEYS } from './constants';
import './App.css';

function AppContent() {
  const {
    isAuthenticated,
    isLoading,
    tokenExpired,
    refreshToken,
    clearTokenExpired,
    logout,
  } = useAuthContext();
  const { toasts, removeToast } = useToastContext();

  const handleStayLoggedIn = async () => {
    const result = await refreshToken();
    if (result.success && result.token) {
      // Store new token
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, result.token);
      clearTokenExpired();
      // No reload needed - AuthContext will handle the state update
    } else {
      // Refresh failed, logout
      logout(false);
    }
  };

  const handleTokenExpiryLogout = () => {
    logout(true);
    clearTokenExpired();
  };

  if (isLoading) {
    return <Loading />;
  }
  return (
    <>
      <Routes>
        {/* Public Routes - redirect to dashboard if authenticated */}
        <Route
          path={ROUTES.LOGIN}
          element={
            !isAuthenticated ? (
              <LoginPage />
            ) : (
              <Navigate to={ROUTES.DASHBOARD} replace />
            )
          }
        />
        <Route
          path={ROUTES.REGISTER}
          element={
            !isAuthenticated ? (
              <RegisterPage />
            ) : (
              <Navigate to={ROUTES.DASHBOARD} replace />
            )
          }
        />{' '}
        {/* Protected Routes - redirect to login if not authenticated */}
        <Route
          path={ROUTES.DASHBOARD}
          element={
            isAuthenticated ? (
              <DashboardPage />
            ) : (
              <Navigate to={ROUTES.LOGIN} replace />
            )
          }
        />
        {/* Development Routes */}
        <Route
          path="/currency-test"
          element={
            isAuthenticated ? (
              <CurrencyExample />
            ) : (
              <Navigate to={ROUTES.LOGIN} replace />
            )
          }
        />
        {/* Default Route */}
        <Route
          path={ROUTES.HOME}
          element={
            <Navigate
              to={isAuthenticated ? ROUTES.DASHBOARD : ROUTES.LOGIN}
              replace
            />
          }
        />
      </Routes>

      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
      <TokenExpiryDialog
        isOpen={tokenExpired}
        onStayLoggedIn={handleStayLoggedIn}
        onLogout={handleTokenExpiryLogout}
      />
    </>
  );
}

function App() {
  return (
    <div className="app">
      <LanguageProvider>
        <ToastProvider>
          <AuthProvider>
            <Router>
              <AppContent />
            </Router>
          </AuthProvider>
        </ToastProvider>
      </LanguageProvider>
    </div>
  );
}

export default App;
