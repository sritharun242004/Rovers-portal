import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { login as apiLogin, verifyOTP as apiVerifyOTP, register as apiRegister } from "@/api/auth";

type LoginResponse = {
  success: boolean;
  message: string;
  requireOTP?: boolean;
  user?: any;
  accessToken?: string;
  refreshToken?: string;
}

type AuthContextType = {
  isAuthenticated: boolean;
  userEmail: string | null;
  userRole: string | null;
  isOtpSent: boolean;
  login: (email: string, password?: string) => Promise<LoginResponse>;
  verifyOTP: (email: string, otp: string) => Promise<{role: string; checkpoint: string}>;
  register: (email: string, password: string, name: string, role: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = localStorage.getItem("accessToken");
    return !!token;
  });
  const [userEmail, setUserEmail] = useState<string | null>(() => {
    return localStorage.getItem("userEmail");
  });
  const [userRole, setUserRole] = useState<string | null>(() => {
    return localStorage.getItem("userRole");
  });
  const [isOtpSent, setIsOtpSent] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setIsAuthenticated(!!token);

    const email = localStorage.getItem("userEmail");
    const role = localStorage.getItem("userRole");
    if (email) {
      setUserEmail(email);
    }
    if (role) {
      setUserRole(role);
    }
  }, []);

  const login = async (email: string, password?: string) => {
    try {
      const response = await apiLogin(email, password);
      if (response?.success) {
        if (response.requireOTP) {
          setUserEmail(email);
          setIsOtpSent(true);
          localStorage.setItem("userEmail", email);
          return response;
        } else if (response.accessToken && response.user) {
          localStorage.setItem("accessToken", response.accessToken);
          if (response.refreshToken) {
            localStorage.setItem("refreshToken", response.refreshToken);
          }
          localStorage.setItem("userEmail", email);
          localStorage.setItem("userRole", response.user.role);
          if (response.checkpoint) {
            localStorage.setItem("checkpoint", response.checkpoint);
          }
          setIsAuthenticated(true);
          setUserEmail(email);
          setUserRole(response.user.role);
          setIsOtpSent(false);
          return response;
        }
      }
      throw new Error("Login failed: Invalid response");
    } catch (error: any) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userRole");
      setIsAuthenticated(false);
      setUserEmail(null);
      setUserRole(null);
      setIsOtpSent(false);

      console.error("Login error:", {
        message: error?.message,
        response: error?.response?.data,
        status: error?.response?.status,
        timestamp: new Date().toISOString(),
        email: email,
        isNetworkError: error?.message?.includes('Network Error'),
        isTimeoutError: error?.code === 'ECONNABORTED'
      });

      if (error?.message?.includes('Network Error')) {
        throw new Error(
          'Unable to connect to the server. Please check your internet connection and try again. ' +
          'If the problem persists, try refreshing the page or clearing your browser cache.'
        );
      } else if (error?.response?.status === 429) {
        throw new Error('Too many login attempts. Please try again in a few minutes.');
      } else if (error?.response?.status === 404) {
        throw new Error('Login service is currently unavailable. Please try again later.');
      } else if (error?.response?.status === 401) {
        throw new Error('Invalid credentials. Please check your email and try again.');
      } else if (error?.response?.status === 500) {
        throw new Error('Server error. Please try again later or contact support if the problem persists.');
      } else {
        throw new Error(error?.response?.data?.message || error?.message || 'Login failed. Please try again.');
      }
    }
  };

  const verifyOTP = async (email: string, otp: string) => {
    try {
      const response = await apiVerifyOTP(email, otp);
      if (response?.accessToken && response?.role) {
        localStorage.setItem("accessToken", response.accessToken);
        if (response.refreshToken) {
          localStorage.setItem("refreshToken", response.refreshToken);
        }
        localStorage.setItem("userEmail", email);
        localStorage.setItem("userRole", response.role);

        
        localStorage.setItem("checkpoint",response.checkpoint)
        setIsAuthenticated(true);
        setUserEmail(email);
        setUserRole(response.role);
        setIsOtpSent(false);
        return { role: response.role, checkpoint: response.checkpoint };
      } else {
        throw new Error("Login failed: No access token or role received");
      }
    } catch (error: any) {
      setIsOtpSent(false);
      throw new Error(error?.message || 'OTP verification failed');
    }
  };

  const register = async (email: string, password: string, name: string, role: string) => {
    try {
      const response = await apiRegister(email, password, name, role);
      if (!response.success) {
        throw new Error("Registration failed");
      }
    } catch (error: any) {
      throw new Error(error?.message || 'Registration failed');
    }
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRole");
    localStorage.removeItem("checkpoint");
    setIsAuthenticated(false);
    setUserEmail(null);
    setUserRole(null);
    setIsOtpSent(false);
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      userEmail,
      userRole,
      isOtpSent,
      login,
      verifyOTP,
      register,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}