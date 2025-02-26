const express = require("express");
const app = express();
const { default: handler } = require("vercel-express");

app.get("/", (req, res) => {
    res.send("Server is running on Vercel!");
});

app.get("/audio", (req, res) => {
    const videoId = req.query.id;
    if (!videoId) return res.status(400).send("Missing video ID");

    res.send(`Audio stream for video ID: ${videoId}`);
});

module.exports = handler(app);
