let pattern;

import Stage from "./Stage.js";
import Shape from "./Shape.js";

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
    const stage = new Stage();
    const shape = new Shape();

    stage.contents = [shape];
    pattern = stage.ctx.createPattern(img, "");
  };
});
