let stage;
let pattern;

import Stage from "./Stage.js";

// Debugger for position
$("#stage").on("click", (e) => {
  const rect = e.target.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  console.log(x, y);

  $("#input").attr("value", `${x}, ${y}`);
});

// Init
$(() => {
  const img = new Image();
  img.src = "../assets/calliePattern.png";

  img.onload = () => {
    stage = new Stage();
    stage.contents = [];
    pattern = stage.ctx.createPattern(img, "");
  };
});
