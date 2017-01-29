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
    this.center = this.getCenter();

    this.rotation = 30;
  }

  /**
    render triangle
  */
  render() {
    ctx.save();

    ctx.translate(this.center.x, this.center.y);
    ctx.rotate(this.rotation * Math.PI / 180);

    ctx.beginPath();
    ctx.fillStyle = pattern;

    ctx.moveTo(this.center.x - this.top1.x, this.center.y - this.top1.y);
    ctx.lineTo(this.center.x - this.top2.x, this.center.y - this.top2.y);
    ctx.lineTo(this.center.x - this.top3.x, this.center.y - this.top3.y);

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


