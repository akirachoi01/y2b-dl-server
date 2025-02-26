const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");

const app = express();
app.use(cors());

app.get("/get-audio", (req, res) => {
  const videoUrl = req.query.url;

  if (!videoUrl) {
    return res.status(400).json({ error: "YouTube URL is required" });
  }

  exec(`yt-dlp -f 140 -g "${videoUrl}"`, (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({ error: "Error fetching audio URL" });
    }
    res.json({ audioUrl: stdout.trim() });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
