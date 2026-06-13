const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    console.log("================================");
    console.log("METHOD:", req.method);
    console.log("URL:", req.originalUrl);

    try {
        console.log("BODY:", JSON.stringify(req.body));
    } catch (e) {
        console.log("BODY: <unreadable>");
    }

    next();
});

app.use(express.static(__dirname)); 

function getCatalog() {
    return fs.readFileSync(
        path.join(__dirname, "catalog.json"),
        "utf8"
    );
}

app.all("*", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.status(200).send(getCatalog());
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
    console.log("================================");
    console.log("NAC Revival server started");
    console.log("Port:", PORT);
    console.log("================================");
});
