const express = require("express");
const path = require("path");

const app = express();

app.use(express.json());

app.get("/catalog.json", (req, res) => {
    res.sendFile(path.join(__dirname, "catalog.json"));
});

app.post("*", (req, res) => {
    res.json({});
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
