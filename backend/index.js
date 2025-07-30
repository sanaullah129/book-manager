const express = require("express");
const cors = require("cors");
const authRoutes = require("./src/routes/auth");
const bookRoutes = require("./src/routes/books");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/login", authRoutes);
app.use("/books", bookRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
