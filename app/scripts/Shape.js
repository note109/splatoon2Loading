import calc from "./calc.js";

export default class Shape {
  constructor() {
    const tm = this.getTriangleMatrix();

    this.matrix = tm;
    this.ctx = document.getElementById("stage").getContext("2d");

    this.scale = [1, 1];
    this.angle = 90;

    this.calliePattern;
    this.mariePattern;
    this.pattern;

    const callieImg = new Image();
    callieImg.src = "../assets/callie.png";
    callieImg.onload = () => {
      this.calliePattern = this.ctx.createPattern(callieImg, "repeat");
      this.pattern = this.calliePattern;
    };

    const marieImg = new Image();
    marieImg.src = "../assets/marie.png";
    marieImg.onload = () => {
      this.mariePattern = this.ctx.createPattern(marieImg, "repeat");
    };
  }

  switchPattern() {
    if (this.pattern === this.calliePattern) {
      this.pattern = this.mariePattern;
    } else {
      this.pattern = this.calliePattern;
    }
  }

  getDistanceMap(m1, m2) {
    return m1.map((ary, i) => {
      const ary1 = m1[i];
      const ary2 = m2[i];

      return ary1.map((elm, j) => {
        const elm1 = ary1[j];
        const elm2 = ary2[j];

        return elm1 - elm2;
      });
    });
  }

  getAccelMap(distanceMap, duration) {
    return distanceMap.map((ary, i) => {
      return ary.map((distance, j) => {
        const accelPerFps = distance / duration;

        return accelPerFps;
      });
    });
  }

  render() {
    this.ctx.save();
    // scale, rotate
    this.ctx.translate(...this.getCenter());
    this.ctx.rotate(calc.toRadian(this.angle));
    this.ctx.scale(...this.scale);

    // draw
    this.ctx.beginPath();

    const matrix = this.matrix;

    matrix.forEach((pos, i) => {
      const nPos = matrix[(i + 1) % 4];
      if (i === 0) this.ctx.moveTo(pos[0], pos[1]); // for fill
      this.ctx.bezierCurveTo(pos[2], pos[3], nPos[4], nPos[5], nPos[0], nPos[1]);
    });

    // fill
    this.ctx.rotate(-calc.toRadian(this.angle + 12));
    this.ctx.fillStyle = this.pattern;
    this.ctx.fill();
    this.ctx.restore();
  }

  * scaleGen(scale = [1, 1], duration = 30) {
    const scaleX = this.scale[0];
    const scaleY = this.scale[1];
    const accel = [
      (scale[0] - scaleX) / duration,
      (scale[1] - scaleY) / duration,
    ];

    while(duration--) {
      this.scale = [
        this.scale[0] + accel[0],
        this.scale[1] + accel[1],
      ];
      yield;
    }

    this.scale = scale;
  }

  * rotateGen(rotation = 60, duration = 30) {
    const accel = rotation / duration;

    while(duration--) {
      this.angle += accel;
      yield;
    }
  }

  * morphGen(n = 30) {
    const distanceMap = this.getDistanceMap(
      this.getCircleMatrix(),
      this.getTriangleMatrix(),
    );
    const accelMap = this.getAccelMap(distanceMap, n);

    while(n--) {
      const nextMatrix = this.matrix.map((posAry, i) => {
        return posAry.map((pos, j) => {
          const nextPos = pos + accelMap[i][j] * 1;

          return nextPos;
        });
      });

      this.matrix = nextMatrix;

      yield;
    }
  }

  * reMorphGen(n = 30) {
    const distanceMap = this.getDistanceMap(
      this.getCircleMatrix([0.25, 1]),
      this.getTriangleMatrix([0.25, 1]),
    );
    const accelMap = this.getAccelMap(distanceMap, n);

    while(n--) {
      const nextMatrix = this.matrix.map((posAry, i) => {
        return posAry.map((pos, j) => {
          const nextPos = pos + accelMap[i][j] * -1;

          return nextPos;
        });
      });

      this.matrix = nextMatrix;

      yield;
    }
  }

  getCenter() {
    return [100, 100];
  }

  getTriangleMatrix() {
    // Init position
    let matrix = [
      [0,   100, 0,   100, 0,   100],
      [100, 100, 100, 100, 100, 100],
      [100, 0,   100, 0,   100, 0],
      [50,  50,  50,  50,  50,  50],
    ];

    // Base center position.
    const center = this.getCenter();

    matrix = matrix.map((pos) => {
      return pos.map((p, j) => {
        return p - center[j % 2] * 0.5;
      });
    });

    return matrix;
  }

  getCircleMatrix() {
    const r = 50;
    const cx = 50;
    const cy = 50;
    const bz = (4 / 3) * Math.tan(Math.PI / 8) * r;

    // Init position
    let matrix = [
      [cx,     cy + r, cx + bz, cy + r,  cx - bz, cy + r],
      [cx + r, cy,     cx + r,  cy - bz, cx + r,  cy + bz],
      [cx,     cy - r, cx - bz, cy - r,  cx + bz, cy - r],
      [cx - r, cy,     cx - r,  cy + bz, cx - r,  cy - bz],
    ];

    // Base center position.
    const center = this.getCenter();

    matrix = matrix.map((pos) => {
      return pos.map((p, j) => {
        return p - center[j % 2] * 0.5;
      });
    });

    return matrix;
  }
}

