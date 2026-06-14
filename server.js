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

    try {
        console.log("BODY:");
        console.log(JSON.stringify(req.body, null, 2));
    } catch (e) {
        console.log("BODY: <unable to parse>");
    }

    next();
});

// Sert les fichiers statiques (test.moflex, images, etc.)
app.use(express.static(__dirname));

// Charge le catalogue
function getCatalog() {
    return fs.readFileSync(
        path.join(__dirname, "catalog.json"),
        "utf8"
    );
}

// Répond au catalogue pour TOUTES les requêtes
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
