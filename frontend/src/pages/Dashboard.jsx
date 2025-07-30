import React, { useEffect, useState } from "react";
import { Container, Button, Typography } from "@mui/material";
import BookTable from "../components/BookTable";
import API from "../services/api";
import { logout } from "../utils/auth";

export default function Dashboard() {
  const [books, setBooks] = useState([]);

  const loadBooks = async () => {
    const res = await API.get("/books");
    setBooks(res.data);
  };

  useEffect(() => { loadBooks(); }, []);

  return (
    <Container>
      <Typography variant="h4">Book Dashboard</Typography>
      <Button onClick={logout} variant="outlined">Logout</Button>
      <BookTable books={books} reload={loadBooks} />
    </Container>
  );
}
