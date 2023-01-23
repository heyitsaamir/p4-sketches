import p5 from "p5";

let points: Point[] = [];
const space = 50;
const sizeOfLength = 10;
// 0 distnace should map to the most distance away
// 1000 distnace should map to the least distnace away

class Point {
  constructor(public position: p5.Vector) {}

  draw(sketch: p5) {
    // distance
    const mouseDiff = p5.Vector.sub(
      this.position,
      new p5.Vector(sketch.mouseX, sketch.mouseY)
    );
    const distance = p5.Vector.dist(
      this.position,
      new p5.Vector(sketch.mouseX, sketch.mouseY)
    );
    const distanceCoefficient = sketch.map(distance, 0, sketch.width, 30, 0);

    const strokeWeight = sketch.map(distanceCoefficient, 0, 30, 0.5, 2);
    sketch.strokeWeight(strokeWeight);

    const hue = sketch.map(distanceCoefficient, 0, 30, 0, 360);
    sketch.stroke(hue, 80, 70);

    const vector = mouseDiff.copy().normalize();
    const start = p5.Vector.add(
      this.position,
      vector.copy().mult(distanceCoefficient)
    );
    const end = p5.Vector.add(start, vector.copy().mult(sizeOfLength));
    sketch.line(start.x, start.y, end.x, end.y);

    sketch.fill(hue, 80, 70);
    sketch.ellipse(start.x, start.y, 3, 3);
  }
}

export default function (sketch: p5) {
  sketch.setup = () => {
    sketch.createCanvas(window.innerWidth, window.innerHeight);
    for (let x = space; x <= window.innerWidth - space; x += space) {
      for (let y = space; y <= window.innerHeight - space; y += space) {
        points.push(new Point(new p5.Vector(x, y)));
      }
    }
  };

  sketch.windowResized = () => {
    sketch.createCanvas(window.innerWidth, window.innerHeight);
  };

  sketch.draw = () => {
    sketch.colorMode("hsb", 360, 100, 100, 1);

    sketch.background(300, 0, 93);
    points.forEach((point) => point.draw(sketch));
  };
}
