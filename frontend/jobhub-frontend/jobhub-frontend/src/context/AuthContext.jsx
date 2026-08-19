import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import api from "../services/api";

/**
 * AuthContext - Global Authentication State
 *
 * This file creates a global state that stores the logged in user's
 * information and makes it accessible throughout the entire React app
 * without passing props manually between components.
 *
 * It stores:
 *  - token   : the JWT token received from Spring Boot after login
 *  - user    : decoded user info extracted from the token (email, role)
 *
 * Any component in the app can access the logged in user's data
 * by simply calling useAuth() hook.
 */

// Create the context object
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {

    // Store JWT token — loaded from localStorage on app start
    const [token, setToken] = useState(() => localStorage.getItem("token"));

    // Store decoded user info synchronously to avoid auth flashing on refresh
    const [user, setUser] = useState(() => {
        const savedToken = localStorage.getItem("token");
        if (savedToken) {
            try {
                return jwtDecode(savedToken);
            } catch (e) {
                return null;
            }
        }
        return null;
    });

    /**
     * Runs whenever the token changes.
     * Decodes the JWT token to extract user info (email, role)
     * and stores it in the user state.
     */
    useEffect(() => {
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUser(decoded);
            } catch (e) {
                // If token is invalid or corrupted, clear everything
                setToken(null);
                setUser(null);
                localStorage.removeItem("token");
            }
        }
    }, [token]);

    /**
     * Called after successful login.
     * Saves the token to localStorage so user stays logged in
     * even after refreshing the page.
     *
     * @param newToken - JWT token received from Spring Boot login API
     */
    const login = (newToken) => {
        localStorage.setItem("token", newToken);
        setToken(newToken);
    };

    /**
     * Called when user clicks Logout.
     * Clears the token and user info from both state and localStorage.
     */
    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
    };

    /**
     * Authenticate user via backend API
     */
    const loginUser = async (credentials) => {
        const response = await api.post("/api/auth/login", credentials);
        const { token, role, name, email } = response.data;
        
        // Save to local storage
        localStorage.setItem("token", token);
        
        // We can manually set the user state immediately using the API response
        // so we don't have to wait for the useEffect decode to trigger
        setToken(token);
        setUser({ role, name, email });
        
        return response.data;
    };

    /**
     * Register new user via backend API
     */
    const registerUser = async (userData) => {
        const response = await api.post("/api/auth/register", userData);
        const { token, role, name, email } = response.data;
        
        // Auto-login after registration
        localStorage.setItem("token", token);
        setToken(token);
        setUser({ role, name, email });
        
        return response.data;
    };

    return (
        <AuthContext.Provider value={{ token, user, login, logout, loginUser, registerUser }}>
            {children}
        </AuthContext.Provider>
    );
};

/**
 * Custom hook to access auth state from any component.
 * Usage: const { user, login, logout } = useAuth();
 */
export const useAuth = () => useContext(AuthContext);
