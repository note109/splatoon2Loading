import "babel-polyfill";

let pattern;

import Stage from "./Stage.js";
import Shape from "./Shape.js";

const yieldAll = function* (generators = []) {
  while (1) {
    const doneAll = generators.map((gen) => {
      const genStat = gen.next();

      return genStat.done;
    }).every((done) => done);

    if (doneAll) {
      break;
    }
    yield;
  }
};

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

    const renderingTaskGen = function* () {
      while (1) {
        yield* yieldAll([
          shape.rotateGen(),
          shape.morphGen(),
        ]);

        yield* shape.scaleGen([0, 1]);

        yield* yieldAll([
          shape.reMorphGen(),
          shape.scaleGen([1, 1]),
        ]);
        yield;
      }
    };
    const renderingTask = renderingTaskGen();

    stage.renderingThread = () => {
      renderingTask.next();
    };
  };
});
