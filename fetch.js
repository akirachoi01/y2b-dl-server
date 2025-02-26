fetch("http://localhost:3000/get-audio?url=https://www.youtube.com/watch?v=mxddndIT0yo")
  .then(response => response.json())
  .then(data => {
    const audio = document.createElement("audio");
    audio.src = data.audioUrl;
    audio.controls = true;
    document.body.appendChild(audio);
  })
  .catch(error => console.error("Error fetching audio:", error));
