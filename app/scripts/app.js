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
      yield* shape.rotateGen(60, 30);

      yield* yieldAll([
        shape.rotateGen(30, 15),
        shape.morphGen(),
      ]);

      yield* stage.wait(20);

      yield* shape.scaleGen([0, 1], 15);
      shape.switchPattern();

      yield* yieldAll([
        shape.reMorphGen(1),
        shape.scaleGen([1, 1], 15),
      ]);

      yield* stage.wait(1);

      yield;
    }
  };
  const renderingTask = renderingTaskGen();

  stage.renderingThread = () => {
    renderingTask.next();
  };
});
