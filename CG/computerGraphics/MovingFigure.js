const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const workArea = document.getElementById('triangle');
var workAreaTriangleCTX = workArea.getContext('2d');
const paintBtn = document.getElementById('paintBtn');

function drawGrid(){
    cellsNumberX = 13;
    cellsNumberY = 8;
    workAreaTriangleCTX.strokeStyle = "black";
    lineX = workArea.width / cellsNumberX;
    lineY = workArea.height / cellsNumberY;

    var buf = 0;
    for (var i = 0; i <= cellsNumberX; i++) {
        workAreaTriangleCTX.beginPath();
        workAreaTriangleCTX.moveTo(buf, 0);
        workAreaTriangleCTX.lineTo(buf, workArea.height);
        workAreaTriangleCTX.stroke();
        workAreaTriangleCTX.font = '15px Rokkit';
        workAreaTriangleCTX.strokeText(buf, buf + 5, 14);
        buf +=lineX;
        buf = parseInt(buf, 10);
    }
    buf = 0;
    for (var j = 0; j <= cellsNumberY; j++) {
        workAreaTriangleCTX.beginPath();
        workAreaTriangleCTX.moveTo(0, buf);
        workAreaTriangleCTX.lineTo(workArea.width, buf);
        workAreaTriangleCTX.stroke();
        workAreaTriangleCTX.font = '15px Rokkit';
        workAreaTriangleCTX.strokeText(buf, 5, buf - 5);
        buf +=lineY;
        buf = parseInt(buf, 10);
    }
}

workArea.onclick = function(){
    drawGrid();
};

class Point{
    constructor(X, Y){
        this.X = X;
        this.Y = Y;
    }
    isEqual(point) {
        return (point.X == this.X) && (point.Y == this.Y);
    }
}

var points = new Array(3);
var rotationMatrix = new Array(2);
var scaleMatrix = new Array(2);
var tempCentre = new Point(0, 0);
var curIndex = 1;
var i = 0;
var angleToMove;
var scaleOn;
var typeRotate;
var savedPoints;
var isStop = 0;

function drawTriangle(A, B, C) {
    workAreaTriangleCTX.clearRect(0, 0, workArea.width, workArea.height);
    drawGrid();

    workAreaTriangleCTX.beginPath();
    workAreaTriangleCTX.moveTo(A.X, A.Y);
    workAreaTriangleCTX.lineTo(B.X, B.Y);
    workAreaTriangleCTX.lineTo(C.X, C.Y);
    workAreaTriangleCTX.closePath();
    workAreaTriangleCTX.lineWidth=2;
    workAreaTriangleCTX.strokeStyle = "black";
    workAreaTriangleCTX.stroke();
    workAreaTriangleCTX.font = '20px Rokkit';
    workAreaTriangleCTX.strokeText('A', A.X - 5, A.Y - 5);
    workAreaTriangleCTX.strokeText('B', B.X - 12, B.Y - 5);
    workAreaTriangleCTX.strokeText('C', C.X + 5, C.Y - 5);
}

function randomInteger(min, max) {
  let rand = min - 0.5 + Math.random() * (max - min + 1);
  return Math.round(rand);
}

startBtn.addEventListener("click", ()=>{
    var deg = 360;
    var koef = document.getElementById('scale1').value;//randomInteger(document.getElementById('scale1').value, document.getElementById('scale2').value);
    var pointIndex = parseInt(document.getElementById('vertex').value);

    isStop = 0;
    move(deg, koef, 'against', pointIndex);

});

paintBtn.addEventListener("click", ()=>{
    var x = parseInt(document.getElementById('coorAX').value);
    var y = parseInt(document.getElementById('coorAY').value);
    if(isNaN(x) || isNaN(y)) return;
    points[0] = new Point(x, y);

    x = parseInt(document.getElementById('coorBX').value);
    y = parseInt(document.getElementById('coorBY').value);
    if(isNaN(x)  || isNaN(y)) return;
    points[1] = new Point(x, y);

    x = parseInt(document.getElementById('coorCX').value);
    y = parseInt(document.getElementById('coorCY').value);
    if(isNaN(x)  || isNaN(y)) return;
    points[2] = new Point(x, y);
    drawTriangle(points[0], points[1], points[2]);
});


function rotate(deg , type) {
        rotationMatrix = [
            [ Math.cos(deg * Math.PI / 180),  Math.sin(deg* Math.PI / 180) ],
            [ (-1)*Math.sin(deg* Math.PI / 180), Math.cos(deg* Math.PI / 180) ]
        ];

    var point = [ [points[0].X], [points[0].Y] ];

    point = multiplyMatrix( rotationMatrix, point );

    points[0].X = point[0][0];
    points[0].Y = point[1][0];

    var point = [ [points[1].X], [points[1].Y] ];

    point = multiplyMatrix( rotationMatrix, point );

    points[1].X = point[0][0];
    points[1].Y = point[1][0];

    var point = [ [points[2].X], [points[2].Y] ];

    point = multiplyMatrix( rotationMatrix, point );

    points[2].X = point[0][0];
    points[2].Y = point[1][0];
}

function scaleBy(koef) {
        scaleMatrix = [
            [ koef,  0],
            [ 0, koef]
        ];

    var point = [ [points[0].X], [points[0].Y] ];
    point = multiplyMatrix( scaleMatrix, point );

    points[0].X = point[0][0];
    points[0].Y = point[1][0];

    var point = [ [points[1].X], [points[1].Y] ];

    point = multiplyMatrix( scaleMatrix, point );

    points[1].X = point[0][0];
    points[1].Y = point[1][0];

    var point = [ [points[2].X], [points[2].Y] ];

    point = multiplyMatrix( scaleMatrix, point );

    points[2].X = point[0][0];
    points[2].Y = point[1][0];
}

function animate() {
    if (i < angleToMove && isStop === 0) {
        points[0] = new Point(savedPoints[0].X, savedPoints[0].Y);
        points[1] = new Point(savedPoints[1].X, savedPoints[1].Y);
        points[2] = new Point(savedPoints[2].X, savedPoints[2].Y);
        translateFromZeroToPoint(curIndex);
        rotate(i, typeRotate);
        scaleBy(1 - scaleOn * (i + 1));
        translateFromPointToZero();

        drawTriangle(points[0], points[1], points[2]);
        i++;
        window.requestAnimationFrame(animate);
    } else {
    stopBtn.style.visibility = "hidden";
    startBtn.style.visibility = "visible";
  }
}

function multiplyMatrix(A,B)
{
    var rowsA = A.length, colsA = A[0].length,
        rowsB = B.length, colsB = B[0].length,
    C = [];

    if (colsA != rowsB) return false;

    for (var i = 0; i < rowsA; i++) C[ i ] = [];
    for (var k = 0; k < colsB; k++)
     { for (var i = 0; i < rowsA; i++)
        { var t = 0;
          for (var j = 0; j < rowsB; j++)
              t += A[ i ][j]*B[j][k];
          C[ i ][k] = t;
          console.log(t);

        }
     }
    return C;
}

function translateFromZeroToPoint(pointInd){

    tempCentre.X = points[pointInd - 1].X;
    tempCentre.Y = points[pointInd - 1].Y;

    for(var i = 0; i < 3; i++ ){
        points[i].X = points[i].X - tempCentre.X;
        points[i].Y = points[i].Y - tempCentre.Y;
    }

}

function translateFromPointToZero() {

    for(var i = 0; i < 3; i++ ){
        points[i].X = points[i].X + tempCentre.X;
        points[i].Y = points[i].Y + tempCentre.Y;
    }
    tempCentre.X = 0;
    tempCentre.Y = 0;
}

function move(angle, scale, type, pointIndex){
    savedPoints = [
        new Point(points[0].X, points[0].Y ),
        new Point(points[1].X, points[1].Y),
        new Point(points[2].X, points[2].Y)];
    curIndex = pointIndex;
    scaleOn = (1 - scale) / 360;
    typeRotate = type;
    i = 0;
    angleToMove = angle;

    animate();
}

startBtn.addEventListener("click", ()=>{
  startBtn.style.visibility = "hidden";
  stopBtn.style.visibility = "visible";
});

stopBtn.addEventListener("click", ()=>{
  stopBtn.style.visibility = "hidden";
  startBtn.style.visibility = "visible";
  isStop = 1;
});

const btnDownload = document.getElementById('downloadBtn');
const inputUp = document.getElementById('fileupload');

function saveImage(image) {
      var link = document.createElement("a");
      link.setAttribute("href", image.src);
      link.setAttribute("download", "processed_image");
      link.click();
}

btnDownload.addEventListener("click", ()=>{
  var image = ReImg.fromCanvas(document.getElementById('triangle')).toPng();
  saveImage(image);
});

inputUp.addEventListener('change', function() {
  if (this.files && this.files[0]) {
    img.src = URL.createObjectURL(this.files[0]);
  }
});
