import p5 from "p5";
import { easeInOutCubic, linear } from "./mapping";

const width = 100;
const cubes: Hex[] = [];
let dt = 0;
let speed = 0.03;

class Hex {
  phaseDelayStart: number;
  constructor(public sketch: p5, public position: p5.Vector, public isRowEven: boolean) {
    const distanceFromEnd = p5.Vector.dist(this.position, new p5.Vector((window.innerWidth - width * 1.5) / 2, (window.innerHeight - width * 1.5) / 2));

    this.phaseDelayStart = distanceFromEnd / 500;
  }

  modifiedDt(dt: number) {
    const end = dt + 2 * Math.PI;
    if (dt < this.phaseDelayStart) {
      return 0;
    } else {
      return dt - this.phaseDelayStart;
    }
  }

  draw(dt: number) {
    this.sketch.fill(255);
    this.sketch.push();
    this.sketch.translate(this.position.x, this.position.y);

    dt = this.modifiedDt(dt);

    const angle = dt % (2 * Math.PI);
    const angleRotation = easeInOutCubic(angle, 0, 2 * Math.PI, 0, 2 * Math.PI) * (this.isRowEven ? 1 : -1);

    this.sketch.rotate(angleRotation)
    this.sketch.beginShape();

    for (let angle = 0; angle <= 2 * Math.PI; angle += Math.PI / 2) {
      const x = (Math.cos(angle) * width) / 2;
      const y = (Math.sin(angle) * width) / 2;
      this.sketch.vertex(x, y);
    }

    this.sketch.endShape("close");
    this.sketch.pop();
  }
}

export default function (sketch: p5) {
  sketch.setup = () => {
    sketch.createCanvas(window.innerWidth, window.innerHeight);

    let row = 0;
    for (
      let x = width * 1.5;
      x < window.innerWidth - width * 1.5;
      x += width * 1.5
    ) {
      for (
        let y = width * 1.5;
        y < window.innerHeight - width * 1.5;
        y += width * 1.5
      ) {
        cubes.push(new Hex(sketch, new p5.Vector(x, y), row % 2 === 0));
      }
      row++
    }
  };

  sketch.windowResized = () => {
    sketch.createCanvas(window.innerWidth, window.innerHeight);
  };

  sketch.draw = () => {
    dt += speed;
    sketch.colorMode("hsb", 360, 100, 100, 1);

    sketch.background(300, 0, 93);
    cubes.forEach((cube) => cube.draw(dt));
  };
}
