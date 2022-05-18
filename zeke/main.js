const GUI = lil.GUI;
let members;

window.addEventListener("DOMContentLoaded", () => {
  setup();
}, false);

window.addEventListener("keydown", e => {
  if(e.key === "g" || e.key === "G") {
    
  }
});

const setup = () => {
  members = document.querySelectorAll(".member");
  setupGUI();
  const video = document.querySelector("video");
  if(video) {
    navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    }).then(stream => {
      video.srcObject = stream;
      video.play();
    }).catch(e => {
      console.log(e);
    });
  }
};

const setupGUI = () => {
  const gui = new GUI();
  for(var i = 0; i < 2; i++) {
    const params = {
      belongs: "zeke",
      name: "Player（5）"
    };
    const belongs = members[i].querySelector(".member__info");
    const player = members[i].querySelector(".member__player");
    belongs.innerHTML = params.belongs;
    player.innerHTML = params.name;

    const pf = gui.addFolder(`Player ${i === 0 ? "A" : "B"}`);
    pf.add(params, "belongs").onChange((val) => {
      console.log("update belongs: ", val);
      belongs.innerHTML = val;
    });
    pf.add(params, "name").onChange((val) => {
      console.log("update name: ", val);
      player.innerHTML = val;
    });
  }
};