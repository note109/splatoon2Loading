import "babel-polyfill";

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
  const stage = new Stage();
  const shape = new Shape();

  stage.contents = [shape];

  const renderingTaskGen = function* () {
    while (1) {
      yield* shape.rotateGen(40, 20);
      yield* yieldAll([
        shape.rotateGen(20, 10),
        shape.morphGen(shape.getCircleMatrix(), 30),
      ]);

      yield* shape.rotateGen(270, 10);

      yield* shape.scaleGen([0, 1], 10);
      shape.switchPattern();

      yield* yieldAll([
        shape.morphGen(shape.getTriangleMatrix(), 1),
        shape.scaleGen([1, 1], 15),
      ]);

      yield* stage.wait(10);

      yield;
    }
  };
  const renderingTask = renderingTaskGen();

  stage.renderingThread = () => {
    renderingTask.next();
  };
});
