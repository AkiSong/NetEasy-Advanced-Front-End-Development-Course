const { ipcRenderer } = require("electron");

let box = document.querySelector("box");

box.onclick = function(e) {
  if (e.target && e.target.nodeName == "SPAN") {
    let color = e.target.dataset["color"];
    ipcRenderer.send("hm_setColor", color);
  }
};
