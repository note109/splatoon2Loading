let ctx;
let stage;
let pattern;

let mouseX = 0;
let mouseY = 0;

// Debugger for position
$('#stage').on('click', (e) => {
  const rect = e.target.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  console.log(x, y);
  mouseX = x;
  mouseY = y;
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
    this.top1 = new Point(150, 30);

    this.top1_05 = new Point(150, 50);

    this.top1_1 = new Point(150, 70);

    this.top2 = new Point(150, 175);
    this.top3 = new Point(60, 175);
    this.center = this.getCenter();

    this.rotation = 30;
  }

  /**
    render triangle
  */
  render() {
    ctx.save();

    const angle = this.rotation * Math.PI / 180;

    ctx.translate(this.center.x, this.center.y);
    ctx.rotate(angle);

    ctx.beginPath();
    ctx.fillStyle = pattern;

    const x0 = this.center.x - this.top1.x;
    const y0 = this.center.y - this.top1.y;
    const x2 = this.center.x - this.top1_1.x;
    const y2 = this.center.y - this.top1_1.y;

    ctx.moveTo(x0, y0);

    const txBase = this.center.x - this.top1_05.x;
    const tyBase = this.center.y - this.top1_05.y;
    const tx = Math.cos(-angle) * txBase - Math.sin(-angle) * tyBase;
    const ty = Math.cos(-angle) * tyBase + Math.sin(-angle) * txBase;

    const cpX = tx * 2 - (x0 + x2) / 2;
    const cpY = ty * 2 - (y0 + y2) / 2;

    ctx.quadraticCurveTo(cpX, cpY, x2, y2);

    ctx.lineTo(this.center.x - this.top2.x, this.center.y - this.top2.y);
    ctx.lineTo(this.center.x - this.top3.x, this.center.y - this.top3.y);

    // fill image need not rotate.
    ctx.rotate(-this.rotation * Math.PI / 180);
    ctx.fill();

    ctx.restore();
  }

  /**
    get center position of triangle
    @return {object} {x, y}
  */
  getCenter() {
    const x = (this.top1.x + this.top2.x + this.top3.x) / 3;
    const y = (this.top1.y + this.top2.y + this.top3.y) / 3;

    return {x, y};
  }
}

/**
  Point for polygon
*/
class Point {
  /**
    @param {number} x - x position
    @param {number} y - y position
  */
  constructor(x, y) {
    this.x = x;
    this.y = y;
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


