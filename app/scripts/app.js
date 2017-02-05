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

  $('#input').attr('value', `${x}, ${y}`);
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

    ctx.translate(this.center.x, this.center.y);
    ctx.rotate(this.getRadian());

    ctx.beginPath();
    ctx.fillStyle = pattern;

    ctx.moveTo(this.top1.x - this.center.x, this.top1.y - this.center.y);
    ctx.lineTo(this.top2.x - this.center.x, this.top2.y - this.center.y);
    ctx.lineTo(this.top3.x - this.center.x, this.top3.y - this.center.y);
    ctx.closePath();

    // fill image need not rotate.
    ctx.rotate(-this.rotation * Math.PI / 180);
    ctx.fill();

    this.renderArc();

    ctx.restore();
  }

  /**
    get radian from this.angle
  */
  getRadian() {
    return this.rotation * Math.PI / 180;
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

  /**
    render arc
  */
  renderArc() {
    const pointX = this.top1_1.x - this.center.x;
    const pointY = this.top1_1.y - this.center.y;

    const dx = pointX;
    const dy = pointY;
    const d = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));

    const startAngle = Math.atan2(pointY, pointX);

    ctx.beginPath();
    ctx.arc(0, 0, d, startAngle + this.getRadian(), this.getRadian() * -1, true);

    ctx.lineWidth = 20;
    ctx.lineCap = 'round';
    ctx.strokeStyle = pattern;
    ctx.stroke();
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


