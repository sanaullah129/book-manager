// src/components/BookTable.js
import React, { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    IconButton,
    Snackbar,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import API from "../services/api";

const BookTable = ({ books, reload }) => {
    const [open, setOpen] = useState(false);
    const [editBook, setEditBook] = useState(null);
    const [snackbar, setSnackbar] = useState("");

    const [form, setForm] = useState({
        title: "",
        author: "",
        genre: "",
        yearPublished: "",
    });

    const handleOpen = (book = null) => {
        if (book) {
            setEditBook(book);
            setForm(book);
        } else {
            setEditBook(null);
            setForm({ title: "", author: "", genre: "", yearPublished: "" });
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEditBook(null);
    };

    const handleSubmit = async () => {
        try {
            if (editBook) {
                await API.put(`/books/${editBook.id}`, form);
                setSnackbar("Book updated successfully");
            } else {
                await API.post("/books", form);
                setSnackbar("Book added successfully");
            }
            reload();
            handleClose();
        } catch {
            setSnackbar("Something went wrong");
        }
    };

    const handleDelete = async id => {
        if (window.confirm("Are you sure you want to delete this book?")) {
            await API.delete(`/books/${id}`);
            setSnackbar("Book deleted");
            reload();
        }
    };

    return (
        <>
            <Button variant="contained" onClick={() => handleOpen()} style={{ margin: "1rem 0" }}>
                Add Book
            </Button>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Title</TableCell>
                            <TableCell>Author</TableCell>
                            <TableCell>Genre</TableCell>
                            <TableCell>Year</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {books.map(book => (
                            <TableRow key={book.id}>
                                <TableCell>{book.title}</TableCell>
                                <TableCell>{book.author}</TableCell>
                                <TableCell>{book.genre}</TableCell>
                                <TableCell>{book.yearPublished}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleOpen(book)}><EditIcon /></IconButton>
                                    <IconButton onClick={() => handleDelete(book.id)}><DeleteIcon /></IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{editBook ? "Edit Book" : "Add Book"}</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Title"
                        fullWidth
                        margin="dense"
                        value={form.title}
                        onChange={e => setForm({ ...form, title: e.target.value })}
                    />
                    <TextField
                        label="Author"
                        fullWidth
                        margin="dense"
                        value={form.author}
                        onChange={e => setForm({ ...form, author: e.target.value })}
                    />
                    <TextField
                        label="Genre"
                        fullWidth
                        margin="dense"
                        value={form.genre}
                        onChange={e => setForm({ ...form, genre: e.target.value })}
                    />
                    <TextField
                        label="Year Published"
                        fullWidth
                        margin="dense"
                        type="number"
                        value={form.yearPublished}
                        onChange={e => setForm({ ...form, yearPublished: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained" color="primary">
                        {editBook ? "Update" : "Add"}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={!!snackbar}
                autoHideDuration={3000}
                message={snackbar}
                onClose={() => setSnackbar("")}
            />
        </>
    );
};

export default BookTable;
