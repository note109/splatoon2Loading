export default class Shape {
  constructor() {
    const cm = this.getCircleMatrix();
    const tm = this.getTriangleMatrix();

    const distanceMap = cm.map((_posAry, i) => {
      const cPosAry = cm[i];
      const tPosAry = tm[i];

      return cPosAry.map((pos, j) => {
        const cPos = cPosAry[j];
        const tPos = tPosAry[j];

        return cPos - tPos;
      })
    });

    this.duration = 90;
    this.accelMap = distanceMap.map((ary, i) => {
      return ary.map((distance, j) => {
        const accelPerFps = distance / this.duration;

        return accelPerFps;
      });
    });
    this.matrix = tm;
  }

  render() {
    ctx.beginPath();

    const matrix = this.matrix;

    matrix.forEach((pos, i) => {
      const nPos = matrix[(i + 1) % 4];
      ctx.moveTo(pos[0], pos[1]);
      ctx.bezierCurveTo(pos[2], pos[3], nPos[4], nPos[5], nPos[0], nPos[1]);
    });

    ctx.stroke();
  }

  *genMorph() {
    while(true) {
      const cm = this.getCircleMatrix();
      const nextMatrix = this.matrix.map((posAry, i) => {
        return posAry.map((pos, j) => {
          const nextPos = pos + this.accelMap[i][j] * 1;

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

  *genReMorph() {
    while(true) {
      const tm = this.getTriangleMatrix();
      const nextMatrix = this.matrix.map((posAry, i) => {
        return posAry.map((pos, j) => {
          const nextPos = pos + this.accelMap[i][j] * -1;

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

  getTriangleMatrix() {
    return [
      [0,   100, 0,   100, 0,   100],
      [100, 100, 100, 100, 100, 100],
      [100, 0,   100, 0,   100, 0],
      [50,  50,  50,  50,  50,  50],
    ];
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

