const express = require("express");
const fs = require("fs");
const app = express();

app.use(express.json());

const catalog = fs.readFileSync("catalog.json", "utf8");

app.all("*", (req, res) => {
    console.log(req.method, req.path);
    res.setHeader("Content-Type", "application/json");
    res.send(catalog);
});

app.listen(process.env.PORT || 10000);
