const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Logs
app.use((req, res, next) => {
    console.log("================================");
    console.log("METHOD:", req.method);
    console.log("URL:", req.originalUrl);
    console.log("BODY:", JSON.stringify(req.body));
    next();
});

// Sert les fichiers statiques (.moflex, .3dst, etc.)
app.use(express.static(__dirname));

// Charge catalog.json
function getCatalog() {
    return fs.readFileSync(
        path.join(__dirname, "catalog.json"),
        "utf8"
    );
}

// GET ou POST -> catalog.json
app.all("*", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.status(200).send(getCatalog());
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
    console.log("================================");
    console.log("NAC Revival Server Started");
    console.log("Port:", PORT);
    console.log("================================");
});
