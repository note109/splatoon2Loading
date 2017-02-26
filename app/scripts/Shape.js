export default class Shape {
  constructor() {
    const cm = this.getCircleMatrix();
    const tm = this.getTriangleMatrix();

    this.distanceMap = this.getDistanceMap(cm, tm);
    this.matrix = tm;
    this.ctx = document.getElementById("stage").getContext("2d");

    this.scale = [1, 1];
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

  getAccelMap(duration) {
    return this.distanceMap.map((ary, i) => {
      return ary.map((distance, j) => {
        const accelPerFps = distance / duration;

        return accelPerFps;
      });
    });
  }

  render() {
    this.ctx.beginPath();

    const matrix = this.matrix;

    matrix.forEach((pos, i) => {
      const nPos = matrix[(i + 1) % 4];
      this.ctx.moveTo(pos[0], pos[1]);
      this.ctx.bezierCurveTo(pos[2], pos[3], nPos[4], nPos[5], nPos[0], nPos[1]);
    });

    this.ctx.stroke();
  }

  * scaleGen(addX, stopX, matrix) {
    while(true) {
      const scale = [
        this.scale[0] + addX,
        this.scale[1],
      ];

      if (this.scale[0] >= stopX && addX > 0) {
        break;
      }
      if (this.scale[0] <= stopX && addX < 0) {
        break;
      }

      this.scale = scale;

      this.matrix = matrix.map((pos, i) => {
        return pos.map((p, j) => {
          return p * this.scale[j % 2];
        });
      });

      yield;
    }
  }

  * rotateGen() {
    while(true) {

      yield;
    }
  }

  * morphGen() {
    while(true) {
      const accelMap = this.getAccelMap(60);

      const cm = this.getCircleMatrix();
      const nextMatrix = this.matrix.map((posAry, i) => {
        return posAry.map((pos, j) => {
          const nextPos = pos + accelMap[i][j] * 1;

          return nextPos;
        });
      });

      if (nextMatrix[0][0] >= cm[0][0]) {
        break;
      }

      this.matrix = nextMatrix;

      yield;
    }
  }

  * reMorphGen() {
    while(true) {
      const accelMap = this.getAccelMap(60);

      const tm = this.getTriangleMatrix();
      const nextMatrix = this.matrix.map((posAry, i) => {
        return posAry.map((pos, j) => {
          const nextPos = pos + accelMap[i][j] * -1;

          return nextPos;
        });
      });

      if (nextMatrix[0][0] <= tm[0][0]) {
        break;
      }

      this.matrix = nextMatrix;

      yield;
    }
  }

  getTriangleMatrix(scale = [1, 1]) {
    let matrix = [
      [0,   100, 0,   100, 0,   100],
      [100, 100, 100, 100, 100, 100],
      [100, 0,   100, 0,   100, 0],
      [50,  50,  50,  50,  50,  50],
    ];

    matrix = matrix.map((pos, i) => {
      return pos.map((p, j) => {
          return p * scale[j % 2];
      });
    });

    return matrix;
  }

  getCircleMatrix() {
    const r = 50;
    const cx = 50;
    const cy = 50;
    const bz = (4 / 3) * Math.tan(Math.PI / 8) * r;

    return [
      [cx,     cy + r, cx + bz, cy + r,  cx - bz, cy + r],
      [cx + r, cy,     cx + r,  cy - bz, cx + r,  cy + bz],
      [cx,     cy - r, cx - bz, cy - r,  cx + bz, cy - r],
      [cx - r, cy,     cx - r,  cy + bz, cx - r,  cy - bz],
    ];
  }
}

