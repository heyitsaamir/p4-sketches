import p5 from "p5";

const G = 6;
const c = 30;
const dt = 0.1;

class Photon {
  public velocity: p5.Vector;
  private history: p5.Vector[];
  constructor(public sketch: p5, public position: p5.Vector) {
    this.velocity = new p5.Vector(-c, 0);
    this.history = [];
  }

  show() {
    this.sketch.strokeWeight(4);
    this.sketch.stroke(0, 0, 0);
    this.history.forEach((pos) => {
      this.sketch.point(pos.x, pos.y);
    });
    this.sketch.stroke(255, 0, 0);
    this.sketch.point(this.position.x, this.position.y);
  }

  update() {
    const deltaV = this.velocity.copy();
    deltaV.mult(dt);
    this.position.add(deltaV);
    this.history.push(this.position.copy());
    if (this.history.length >= 500) {
      this.history.shift();
    }
  }

  applyForce(acceleration: p5.Vector) {
    this.velocity.add(acceleration);
    this.velocity.setMag(c);
  }
}

class Blackhole {
  public rs: number;
  constructor(private p5: p5, public position: p5.Vector, public mass: number) {
    this.rs = (2 * G * this.mass) / (c * c);
  }

  show() {
    // Event horizon
    this.p5.fill(0);
    this.p5.ellipse(this.position.x, this.position.y, this.rs, this.rs);

    // Accretion disk (3Rs)
    this.p5.noFill();
    this.p5.stroke(0, 100);
    this.p5.strokeWeight(32);
    this.p5.ellipse(
      this.position.x,
      this.position.y,
      this.rs * 3 + 16,
      this.rs * 3 + 16
    );

    // Unstable photon ring (1.5Rs)
    this.p5.noFill();
    this.p5.stroke(255, 150, 0, 100);
    this.p5.strokeWeight(32);
    this.p5.ellipse(
      this.position.x,
      this.position.y,
      this.rs * 1.5 + 16,
      this.rs * 1.5 + 16
    );
  }

  public pull(photon: Photon) {
    const vector = p5.Vector.sub(this.position, photon.position);
    const r = vector.mag();
    const force = (G * this.mass) / (r * r);
    vector.setMag(force);

    return vector;
  }
}

let blackHole: Blackhole;
let particles: Photon[] = [];

export default function (sketch: p5) {
  sketch.setup = () => {
    sketch.ellipseMode("radius");
    sketch.createCanvas(window.innerWidth, window.innerHeight);
    blackHole = new Blackhole(sketch, new p5.Vector(0, 0), 6000);

    const maxDistanceThatWillGetCaptured = blackHole.rs * 2.6;
    const startWidth = window.innerWidth / 2 - 20;
    for (
      let y = -window.innerHeight / 2;
      y <= window.innerHeight / 2;
      y += 30
    ) {
      particles.push(new Photon(sketch, new p5.Vector(startWidth, y)));
    }
  };

  sketch.windowResized = () => {
    sketch.createCanvas(window.innerWidth, window.innerHeight);
  };

  sketch.draw = () => {
    sketch.background(255);
    sketch.push();
    sketch.translate(sketch.width / 2, sketch.height / 2);
    blackHole.show();

    particles.forEach((p) => {
      const force = blackHole.pull(p);
      p.applyForce(force);

      p.update();
      p.show();
    });

    sketch.pop();
  };
}
