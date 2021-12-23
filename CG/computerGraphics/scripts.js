
const canvas1 = document.getElementById('canvasID');
const ctx1 = canvas1.getContext('2d');
const ctx = window.canvas.getContext('2d');
function KochBuilder() {
let a = document.getElementById("itnumber").value;
if(a==="" || a%1!==0)
{
  alert("Enter only an integer number");
}
else
{

  let iteration = document.getElementById("itnumber").value-1, time = 1;

/* ###  ###  ###  ###  ###  ### ###  ###  ### */

ctx.clearRect(0, 0, canvas.width, canvas.height);
ctx1.clearRect(0, 0, canvas1.width, canvas1.height);


class VonKochClass {
  constructor() {
    // canvas width: 600px, height: 400px
    this.middle = 200, this.length = 200, this.init = 0,
    this.start = 0, this.end = 600, this.degrees = [-60, 120, -60];
  }
  line(ctx1) {
    ctx1.save();

    ctx1.beginPath();
    ctx1.moveTo(this.start, this.middle);
    ctx1.lineTo(this.end, this.middle);

    ctx1.lineWidth = 2;
    ctx1.stroke();
    ctx1.closePath();
    ctx1.restore();
  }
  shape(ctx1) { // we use the shape: __/\__ has patern
    // note: -174 intersection point between 2 segments of 200px
    ctx1.beginPath();

    ctx1.moveTo(this.start, this.init);
    ctx1.lineTo(this.length, this.init);
    ctx1.lineTo(this.length + (this.length/2), -174);
    ctx1.lineTo(this.length * 2, this.init);
    ctx1.lineTo(this.end, this.init);

    ctx1.lineWidth = 2;
    ctx1.stroke();
    ctx1.closePath();
  }
  loopThree(ctx1) {
    for (let i = 0; i < 3; i++) {
      this.begin(ctx1, 600, -200, this.degrees[i]);
      this.loopOne(ctx1);
      this.loopTwo(ctx1);
    }
  }
  loopTwo(ctx1) {
    for (let i = 0; i < 3; i++) {
      this.begin(ctx1, 600, -200, this.degrees[i]);
      this.loopOne(ctx1);
    }
  }
  loopOne(ctx1) {
    for (let i = 0; i < 3; i++) {
      this.begin(ctx1, 600, -200, this.degrees[i]);
    }
  }
  startup(ctx1, iter) {
    this.begin(ctx1, 0, iter, 0);
    this.loopOne(ctx1);
  }
  begin(ctx1, x, y, degrees) {
      ctx1.translate(x, (200 * Math.pow(3, y) ));
      ctx1.rotate((Math.PI/180)* degrees);
      this.shape(ctx1);
  }
}

const VonKochCurve = new VonKochClass();


function fractal(iter, time) {
  setTimeout(() => {
    ctx1.clearRect(0, 0, canvas.width, canvas.height);
    ctx1.save();
    ctx1.scale(1/ Math.pow(3, iter), 1/ Math.pow(3, iter));

    if (iter == 0) VonKochCurve.begin(ctx1, 0, iter, 0);

    else if (iter == 1) {
      VonKochCurve.startup(ctx1, iter);
    }
    else if (iter == 2) {
      VonKochCurve.startup(ctx1, iter);
      VonKochCurve.loopTwo(ctx1);
    }
    else if (iter == 3) {
      VonKochCurve.startup(ctx1, iter);
      VonKochCurve.loopTwo(ctx1);
      VonKochCurve.loopThree(ctx1);
    }

    ctx1.restore();
  }, (time * 2000));
}


VonKochCurve.line(ctx1);


for (let i = 0; i < iteration; i++) {
  fractal(i, time);
  time +=1;
}

}
  document.getElementById("itnumber").innerHTML="0";
}








function DragonBuilder() {
  console.clear();
ctx1.clearRect(0, 0, canvas1.width, canvas1.height);
ctx.clearRect(0, 0, window.canvas.width, window.canvas.height);
  let dragonIterator = document.getElementById("itnumber").value;


  function line(startx, starty, endx, endy) {
    ctx.beginPath();
    ctx.moveTo(startx, starty);
    ctx.lineTo(endx, endy);
    ctx.stroke();
  }

  function drawLines(pointArray) {
    ctx.beginPath();
    ctx.moveTo(pointArray[0][0], pointArray[0][1]);
    for (let i = 1; i < pointArray.length; i++) {
      const nextPoint = pointArray[i];
      ctx.lineTo(nextPoint[0],nextPoint[1]);
    }
    ctx.stroke();
  }

  //dragon curve utils
  const cos45 = Math.cos(Math.PI / 4);
  const sin45 = Math.sin(Math.PI / 4);
  const cos135 = Math.cos(-Math.PI / 4);
  const sin135 = Math.sin(-Math.PI / 4);
  const sqrt2 = Math.sqrt(2);
  const length = (p1, p2) => {
    return Math.sqrt(Math.pow(p2[0] - p1[0],2) + Math.pow(p2[1] - p1[1],2));
  }

  let DRAGON_POINTS_SEQUENCE = [];

  function dragon(points, order = 1) {
    if (order === 0) {
      drawLines(points);
    } else {
      let newPointsArray = [];
      for (let i = 0; i < points.length - 1; i++) {
        if (i % 2 === 0 ) {
          // console.log("even: ", [points[i], points[i + 1]]);
          // console.log(f1(points[i], points[i + 1]))
          newPointsArray.push(f1(points[i], points[i + 1]));
        } else if (i % 2 === 1) {
          // console.log("odd: ", [points[i], points[i + 1]]);
          // console.log(f2(points[i], points[i + 1]))
          newPointsArray.push(f2(points[i], points[i + 1]));
        }
      }

      let newPoints = []
      // console.log("points: ", points);
      // console.log("new points: ", newPointsArray);
      for (let i = 0; i < newPointsArray.length; i++) {
        newPoints.push(points[i])
        newPoints.push(newPointsArray[i]);
      }
      newPoints.push(points[points.length-1]);

      // console.log("result", newPoints);

      order--;

      DRAGON_POINTS_SEQUENCE.push(newPoints);

      dragon(newPoints, order);
    }
  }

  function f1(p1, p2) {
    const refVector = [
      (p2[0]-p1[0]) / sqrt2,
      (p2[1]-p1[1]) / sqrt2,
    ];

    let newV = [
      refVector[0] * cos45 - refVector[1] * sin45,
      refVector[0] * sin45 + refVector[1] * cos45
    ];

    newV = [ newV[0]+ p1[0], newV[1] + p1[1] ];

    return newV;
  }

  function f2(p1, p2) {
    const refVector = [
      (p2[0]-p1[0]) / sqrt2,
      (p2[1]-p1[1]) / sqrt2,
    ];

    let newV = [
      refVector[0] * cos45 - refVector[1] * -sin45,
      refVector[0] * -sin45 + refVector[1] * cos45
    ];

    newV = [ newV[0] + p1[0], newV[1] + p1[1] ];

    return newV;
  }

  // Engage!

  let points = [[250,250],[700,250]];
  dragon(points, 0);

  window.itnumber.addEventListener('change', (event) => {
    ctx.clearRect(0, 0, window.canvas.width, window.canvas.height);
    DRAGON_POINTS_SEQUENCE = [];
    dragon(points, event.target.value);
    console.log(DRAGON_POINTS_SEQUENCE);
  });

  // Dragon points sequence is to collect the points of each iteration up to the selected iteration
  console.log(DRAGON_POINTS_SEQUENCE);

}

function saveImage(image) {
    var link = document.createElement("a");

    link.setAttribute("href", image.src);
    link.setAttribute("download", "Fractal");
    link.click();
}

  save.addEventListener("click", ()=>{
  var image = ReImg.fromCanvas(document.getElementById('canvas')).toPng();
  saveImage(image);

  })


  saveKochFr.addEventListener("click", ()=>{
  var image = ReImg.fromCanvas(document.getElementById('canvasID')).toPng();
  saveImage(image);

  })
