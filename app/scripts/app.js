let ctx;
let stage;
let pattern;

// Debugger for position
$('#stage').on('click', (e) => {
  const rect = e.target.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  console.log(x, y);
});

// Init
$(() => {
  const canvas = document.getElementById('stage');
  ctx = canvas.getContext('2d');

  const img = new Image();
  img.src = '../assets/calliePattern.png';

  img.onload = () => {
    pattern = ctx.createPattern(img, '');

    const triangle = new Triangle();
    stage = new Stage();
    stage.contents = [triangle];

    const gui = new dat.GUI();
    gui.add(triangle, 'rotation', 0, 360);
  };
});


/**
  Triangle shape
*/
class Triangle {
  /**
    initialize top value
  */
  constructor() {
    this.top1 = {x: 100, y: 30};
    this.top2 = {x: 100, y: 75};
    this.top3 = {x: 80, y: 75};

    this.rotation = 0;
  }

  /**
    render triangle
  */
  render() {
    ctx.save();

    ctx.rotate(this.rotation * Math.PI / 180);

    ctx.beginPath();
    ctx.fillStyle = pattern;

    ctx.moveTo(this.top1.x, this.top1.y);
    ctx.lineTo(this.top2.x, this.top2.y);
    ctx.lineTo(this.top3.x, this.top3.y);
    ctx.fill();

    ctx.restore();
  }

}

/**
  Stage for draw shapes
*/
class Stage {
  /**
    @param {array} contents - instanses of shapes. Each has render() method.
  */
  constructor(contents = []) {
    this.canvas = document.getElementById('stage');
    this.contents = contents;

    this.init();
  }

  /**
    Initialize canvas and start render.
  */
  init() {
    this.width = $('.wrapper').width();
    this.height = $('.wrapper').height();
    this.canvas.setAttribute('width', this.width);
    this.canvas.setAttribute('height', this.height);

    this.render();
  }

  /**
    Render contents to canvas every animationFrame.
  */
  render() {
    ctx.clearRect(0, 0, this.width, this.height);

    this.contents.forEach((cnt) => {
      cnt.render();
    });
    requestAnimationFrame(::this.render);
  }
}


