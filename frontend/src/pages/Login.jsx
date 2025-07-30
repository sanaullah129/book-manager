import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField, Button, Container, Snackbar, Typography
} from "@mui/material";
import API from "../services/api";
import "../styles/Login.css";

export default function Login() {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post("/login", credentials);
      localStorage.setItem("book-manager-token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="login-container">
      <div className="login-card">
        <div className="book-icon">📚</div>
        <Typography variant="h4" className="login-title">
          Book Manager
        </Typography>
        <Typography className="login-subtitle">
          Welcome back! Please sign in to your account.
        </Typography>
        
        <form className="login-form" onSubmit={handleSubmit}>
          <TextField 
            label="Username" 
            fullWidth 
            variant="outlined"
            value={credentials.username}
            onChange={e => setCredentials({ ...credentials, username: e.target.value })}
            disabled={loading}
            required
          />
          <TextField 
            label="Password" 
            type="password" 
            fullWidth 
            variant="outlined"
            value={credentials.password}
            onChange={e => setCredentials({ ...credentials, password: e.target.value })}
            disabled={loading}
            required
          />
          <Button 
            type="submit" 
            className="login-button"
            fullWidth
            disabled={loading || !credentials.username || !credentials.password}
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </div>
      <Snackbar
        open={!!error}
        autoHideDuration={3000}
        message={error}
        onClose={() => setError("")}
      />
    </Container>
  );
}
