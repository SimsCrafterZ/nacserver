const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(express.json({ limit: "10mb" }));

app.post("*", (req, res) => {
    const body = req.body;

    // Requête invalide
    if (!body || !body.body || !body.body[0]) {
        return res.json({
            error: "Invalid request! Please try again later!"
        });
    }

    const request = body.body[0];

    // incViewCount
    if (request.incViewCount) {
        return res.json({});
    }

    // getNode root
    if (request.getNode) {
        const node = request.getNode;

        if (node.id === "root" && node.type === "root") {

            const lang = body.head?.device?.language || "en";

            let catalogFile = "catalog_en.json";

            if (fs.existsSync(path.join(__dirname, `catalog_${lang}.json`))) {
                catalogFile = `catalog_${lang}.json`;
            }

            const catalog = JSON.parse(
                fs.readFileSync(
                    path.join(__dirname, catalogFile),
                    "utf8"
                )
            );

            const channel1 = JSON.parse(
                fs.readFileSync(
                    path.join(__dirname, "channel_1.json"),
                    "utf8"
                )
            );

            const channel2 = JSON.parse(
                fs.readFileSync(
                    path.join(__dirname, "channel_2.json"),
                    "utf8"
                )
            );

            const airing = JSON.parse(
                fs.readFileSync(
                    path.join(__dirname, "airing_shows.json"),
                    "utf8"
                )
            );

            const result = {
                body: [
                    ...catalog,
                    channel1,
                    channel2,
                    {
                        setNode: {
                            id: "root",
                            type: "root",
                            children: airing
                        }
                    }
                ]
            };

            return res.json(result);
        }
    }

    res.json({});
});

// Fichiers statiques (.moflex, .3dst, etc.)
app.use(express.static(__dirname));

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
    console.log("Anime Channel MockAPI running on port", PORT);
});
