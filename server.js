const express = require("express");
const path = require("path");

const app = express();

app.use(express.json());

app.all("/catalog.json", (req, res) => {
    console.log(req.method, JSON.stringify(req.body));
    res.sendFile(path.join(__dirname, "catalog.json"));
});

app.use(express.static(__dirname));

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});
