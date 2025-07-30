import React, { useEffect, useState } from "react";
import { Container, Button, Typography, Snackbar, Alert } from "@mui/material";
import BookTable from "../components/BookTable";
import API from "../services/api";
import { logout } from "../utils/auth";
import "../styles/Dashboard.css";

export default function Dashboard() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info" // "success", "error", "warning", "info"
  });
  const [stats, setStats] = useState({
    totalBooks: 0,
    uniqueAuthors: 0,
    uniqueGenres: 0,
    latestYear: 0
  });

  const showSnackbar = (message, severity = "info") => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  const calculateStats = (booksData) => {
    const totalBooks = booksData.length;
    const uniqueAuthors = new Set(booksData.map(book => book.author)).size;
    const uniqueGenres = new Set(booksData.map(book => book.genre)).size;
    const latestYear = booksData.length > 0 ? Math.max(...booksData.map(book => book.yearPublished)) : new Date().getFullYear();
    
    setStats({
      totalBooks,
      uniqueAuthors,
      uniqueGenres,
      latestYear
    });
  };

  const loadBooks = async () => {
    try {
      setLoading(true);
      const res = await API.get("/books");
      if(res.status === 401) {
        logout();
        showSnackbar("Unauthorized access. Please log in again.", "error");
        return;
      }
      setBooks(res.data);
      calculateStats(res.data);
    } catch (error) {
      console.error("Failed to load books:", error);
      showSnackbar("Something went wrong while loading books.", "error");
      return;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    loadBooks(); 
  }, []);

  if (loading) {
    return (
      <Container className="dashboard-container">
        <div className="dashboard-content dashboard-animated">
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container className="dashboard-container">
      <div className="dashboard-content dashboard-animated">
        {/* Header Section */}
        <div className="dashboard-header">
          <Typography variant="h4" className="dashboard-title">
            📚 Book Dashboard
          </Typography>
          <Button onClick={logout} className="logout-button">
            Logout
          </Button>
        </div>

        {/* Statistics Section */}
        <div className="stats-section">
          <div className="stat-card">
            <div className="stat-number">{stats.totalBooks}</div>
            <div className="stat-label">Total Books</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.uniqueAuthors}</div>
            <div className="stat-label">Authors</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.uniqueGenres}</div>
            <div className="stat-label">Genres</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.latestYear}</div>
            <div className="stat-label">Latest Year</div>
          </div>
        </div>

        {/* Books Section */}
        <div className="books-section">
          <Typography variant="h5" className="section-title">
            Your Book Collection
          </Typography>
          <BookTable books={books} reload={loadBooks} />
        </div>
      </div>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
