import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { ThemeProvider } from "./components/ui/theme-provider"
import { Toaster } from "./components/ui/toaster"
import { AuthProvider, useAuth } from "./contexts/AuthContext"
import { Login } from "./pages/Login"
import { Register } from "./pages/Register"
import { ForgotPassword } from "./pages/ForgotPassword"
import { Dashboard } from "./pages/Dashboard"
import { LiveDashboard } from "./pages/LiveDashboard"
import { VolunteerRegister } from "./pages/VolunteerRegister"
import { VolunteerLogin } from "./pages/VolunteerLogin"
import { Volunteers } from "./pages/Volunteers"
import { Students } from "./pages/Students"
import { Layout } from "./components/Layout"
import { ParentDashboard } from "./pages/ParentDashboard"
import { EventDetail } from "./pages/EventDetail"
import { StudentsDashboard } from "./pages/StudentsDashboard"
import { StudentDetail } from "./pages/StudentDetail"
import { MyRegistrationsPage } from './pages/MyRegistrations'
import { PaymentRedirectPage } from './components/PaymentRedirectPage'
import { PaymentSuccessPage } from './components/PaymentSuccessPage'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '')
import { Support } from './pages/Support'
import { RegistrationDetailPage } from './pages/RegistrationDetail'
import { StudentSelection } from './pages/StudentSelection'
import Clarity from '@microsoft/clarity';
import { SetupPassword } from './pages/SetupPassword'

const projectId = import.meta.env.VITE_CLARITY_ID;
Clarity.init(projectId);

function AppRoutes() {

  const { isAuthenticated, userRole } = useAuth();

  return (
    <Routes>

      <Route path="/" element={<iframe src="/Rovers-Website/dist/index.html" style={{
        width: "100%",
        height: "100vh",
        border: "none",
      }} frameBorder="0"></iframe>} />
      {/* Alternative: use rovers.html wrapper */}
      {/* <Route path="/" element={<iframe src="rovers.html" style={{
        width: "100%",
        height: "100vh",
        border: "none",
      }} frameBorder="0"></iframe>} /> */}
      {/* <Route path="/" element={<iframe src="/roverslife2.0/index.html" style={{
        width: "100%",
        height: "100vh",
        border: "none",
      }} frameBorder="0"></iframe>} /> */}


      <Route path="/login" element={
        isAuthenticated ?
          <Navigate to={
            userRole === 'manager' ? "/live" :
              userRole === 'parent' || userRole === 'school' ? "/parent" :
                userRole === 'volunteer' ? "/volunteer" :
                  "/login"
          } />
          : <Login />
      } />
      <Route path="/volunteer/login" element={
        isAuthenticated ? <Navigate to="/volunteer" /> : <VolunteerLogin />
      } />
      <Route path="/register" element={<Register />} />
      <Route path="/setup-password" element={<SetupPassword />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Payment Redirect Routes */}
      <Route path="/payment-redirect" element={<PaymentRedirectPage />} />
      <Route path="/payment-success" element={
        <Elements stripe={stripePromise}>
          <PaymentSuccessPage />
        </Elements>
      } />

      {/* Protected Routes */}
      <Route element={<Layout />}>
        {/* Manager Routes */}
        <Route path="/live" element={
          isAuthenticated && userRole === 'manager' ?
            <LiveDashboard /> :
            <Navigate to="/login" />
        } />
        <Route path="/volunteer/register" element={
          isAuthenticated && userRole === 'manager' ?
            <VolunteerRegister /> :
            <Navigate to="/login" />
        } />
        <Route path="/volunteers" element={
          isAuthenticated && userRole === 'manager' ?
            <Volunteers /> :
            <Navigate to="/login" />
        } />
        <Route path="/students" element={
          isAuthenticated && userRole === 'manager' ?
            <Students /> :
            <Navigate to="/login" />
        } />

        {/* Volunteer Routes */}
        <Route path="/volunteer" element={
          isAuthenticated && userRole === 'volunteer' ?
            <Dashboard /> :
            <Navigate to="/login" />
        } />

        {/* Parent Routes */}
        <Route path="/parent" element={
          isAuthenticated && (userRole === 'parent' || userRole === 'school') ?
            <ParentDashboard /> :
            <Navigate to="/login" />
        } />
        <Route path="/event/:id" element={
          isAuthenticated && (userRole === 'parent' || userRole === 'school') ?
            <EventDetail /> :
            <Navigate to="/login" />
        } />
        <Route path="/event/:eventId/student-selection" element={
          isAuthenticated && (userRole === 'parent' || userRole === 'school') ?
            <StudentSelection /> :
            <Navigate to="/login" />
        } />
        <Route path="/student-selection" element={
          isAuthenticated && (userRole === 'parent' || userRole === 'school') ?
            <StudentSelection /> :
            <Navigate to="/login" />
        } />
        <Route path="/parent/students" element={
          isAuthenticated && (userRole === 'parent' || userRole === 'school') ?
            <StudentsDashboard /> :
            <Navigate to="/login" />
        } />
        <Route path="/parent/students/:studentId" element={
          isAuthenticated && (userRole === 'parent' || userRole === 'school') ?
            <StudentDetail /> :
            <Navigate to="/login" />
        } />
        <Route path="/parent/registrations" element={
          isAuthenticated && (userRole === 'parent' || userRole === 'school') ?
            <MyRegistrationsPage /> :
            <Navigate to="/login" />
        } />
        <Route path="/registration-details/:id" element={
          isAuthenticated && (userRole === 'parent' || userRole === 'school') ?
            <RegistrationDetailPage /> :
            <Navigate to="/login" />
        } />
        <Route path="/support" element={
          isAuthenticated && (userRole === 'parent' || userRole === 'school') ?
            <Support /> :
            <Navigate to="/login" />
        } />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider defaultTheme="light" storageKey="ui-theme">
        <Router>
          <AppRoutes />
          <Toaster />
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;