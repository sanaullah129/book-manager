import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField, Button, Container, Snackbar
} from "@mui/material";
import API from "../services/api";

export default function Login() {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await API.post("/login", credentials);
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch {
      setError("Invalid username or password");
    }
  };

  return (
    <Container>
      <form onSubmit={handleSubmit}>
        <TextField label="Username" fullWidth margin="normal"
          onChange={e => setCredentials({ ...credentials, username: e.target.value })} />
        <TextField label="Password" type="password" fullWidth margin="normal"
          onChange={e => setCredentials({ ...credentials, password: e.target.value })} />
        <Button type="submit" variant="contained" color="primary" fullWidth>Login</Button>
      </form>
      <Snackbar
        open={!!error}
        autoHideDuration={3000}
        message={error}
        onClose={() => setError("")}
      />
    </Container>
  );
}
