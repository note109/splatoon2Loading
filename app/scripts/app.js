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

const rotatePos = (baseX, baseY, angle) => {
  const x = Math.cos(angle) * baseX - Math.sin(angle) * baseY;
  const y = Math.cos(angle) * baseY + Math.sin(angle) * baseX;

  return [x, y];
};

/**
  Triangle shape
*/
class Triangle {
  /**
    initialize top value
  */
  constructor() {
    this.top1 = new Point(150, 30);

    this.arc1 = new ArcPoint(140, 30, 30);
    this.arc2 = new ArcPoint(140, 60, 60);

    this.top2 = new Point(150, 175);
    this.top3 = new Point(60, 175);
    this.center = this.getCenter();
    this.arcArray = [this.arc1, this.arc2];

    this.rotation = 0.05;
  }

  /**
    render triangle
  */
  render() {
    const afterTop1 = this.getTranslatedPos(this.top1);
    const afterTop2 = this.getTranslatedPos(this.top2);
    const afterTop3 = this.getTranslatedPos(this.top3);

    this.top1.x = afterTop1[0] + this.center.x;
    this.top1.y = afterTop1[1] + this.center.y;

    this.top2.x = afterTop2[0] + this.center.x;
    this.top2.y = afterTop2[1] + this.center.y;

    this.top3.x = afterTop3[0] + this.center.x;
    this.top3.y = afterTop3[1] + this.center.y;

    ctx.save();
    ctx.translate(this.center.x, this.center.y);

    ctx.beginPath();
    ctx.fillStyle = pattern;

    ctx.moveTo(...this.getTranslatedPos(this.top1));
    ctx.lineTo(...this.getTranslatedPos(this.top2));
    ctx.lineTo(...this.getTranslatedPos(this.top3));
    ctx.closePath();

    ctx.fill();

    this.arcArray.forEach((arc) => {
      this.renderArc(arc);
    });

    ctx.restore();
  }

  /**
    get radian from this.angle
    @param {number} angle
    @return {number} radian
  */
  getRadian(angle = this.rotation) {
    return angle * Math.PI / 180;
  }

  /**
    get angle from radian
    @param {number} radian
    @return {number} angle
  */
  getAngle(radian) {
    return radian * 180 / Math.PI;
  }

  /**
    get position relative to center.
    @param {object} basePos - pos.x / pos.y
    @return {array} [x, y]
  */
  getTranslatedPos(basePos, rotation = this.rotation) {
    const x = basePos.x - this.center.x;
    const y = basePos.y - this.center.y;
    const pos = rotatePos(x, y, rotation);

    return pos;
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
    TODO: remove arc rendering from Triangle class.
  */
  renderArc(arc) {
    const points = this.getTranslatedPos(arc);
    const pointX = points[0];
    const pointY = points[1];

    const dx = pointX;
    const dy = pointY;
    const d = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));

    const baseRadian = Math.atan2(pointY, pointX);
    const beginRadian = baseRadian + this.getRadian();
    const endRadian = this.getRadian(arc.endAngle);

    const distance = this.getAngle(beginRadian) - this.getAngle(endRadian);

    if (distance < 0 || distance > 180) {
      return;
    }

    ctx.beginPath();
    ctx.arc(0, 0, d, beginRadian, endRadian, true);

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
  Point for Arc
*/
class ArcPoint extends Point {
  /**
    @param {number} x - x position
    @param {number} y - y position
    @param {number} endAngle - end position of arc
  */
  constructor(x, y, endAngle) {
    super(x, y);

    this.endAngle = endAngle;
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


