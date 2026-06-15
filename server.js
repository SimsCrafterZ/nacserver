const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logs
app.use((req, res, next) => {
    console.log("METHOD:", req.method, "URL:", req.originalUrl);
    console.log("BODY:", req.body);
    next();
});

// Static files (thumbnails + moflex)
app.use(express.static(__dirname));

// Load catalog once
const catalog = fs.readFileSync(
    path.join(__dirname, "catalog.json"),
    "utf8"
);

// 🟢 1. NAC catalog request
app.post("/", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(catalog);
});

// 🟡 2. viewCount increment (POST JSON dummy response)
app.post("/incrementView", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send({ hello: "world" });
});

// 🔴 fallback POST (safe)
app.post("*", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send({ ok: true });
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
    console.log("NAC server running on port", PORT);
});
