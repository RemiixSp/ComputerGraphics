var slider_g = document.getElementById("range_g");
var output_satur = document.getElementById("value_satur");

const btnUpload = document.getElementById('upload');
const btnDownload = document.getElementById('downloadBtn');
const inputUp = document.getElementById('fileupload');
const modelRadio = document.getElementById('radioGroup');

const canvasProcessed = document.getElementById('img_processed');
var ctxP = canvasProcessed.getContext('2d');
const canvasOriginal = document.getElementById('img_original');
var ctxO = canvasOriginal.getContext('2d');

var img = new Image();

var output_r = document.getElementById('value_r');
var output_g = document.getElementById('value_g');
var output_b = document.getElementById('value_b');
var output_h = document.getElementById('value_h');
var output_s = document.getElementById('value_s');
var output_v = document.getElementById('value_v');

const pixelDiv = document.getElementById('pixel');

output_satur.innerHTML = slider_g.value + "%";

slider_g.oninput = function() {
  output_satur.innerHTML = this.value + "%";
  changeSaturaion();
}

btnUpload.addEventListener("click", ()=>{
$('#fileupload').trigger("click");
});

inputUp.addEventListener('change', function() {
  if (this.files && this.files[0]) {
    img.src = URL.createObjectURL(this.files[0]);
  }
});

var isLoad = 0;

img.onload = function() {
  //ctxO.clearRect(0, 0, canvasOriginal.width, canvasOriginal.height);
  drawCtxOImage();
  ctxP.clearRect(0, 0, canvasProcessed.width, canvasProcessed.height);
  //ctxO.drawImage(img,0,0);
	ctxP.drawImage(img,0,0);
  isLoad = 1;
};

function drawCtxOImage() {
  ctxO.clearRect(0, 0, canvasOriginal.width, canvasOriginal.height);
  ctxO.drawImage(img,0,0);
};

var x = 0;
var y = 0;

function RGBtoHSV(r, g, b) {
  r /= 255, g /= 255, b /= 255;

  var max = Math.max(r, g, b), min = Math.min(r, g, b);
  var h, s, v = max;

  var d = max - min;
  s = max == 0 ? 0 : d / max;

  if (max == min) {
    h = 0; // achromatic
  } else {
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }

    h /= 6;
  }

  return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      v: Math.round(v * 100)
  };
}

canvasProcessed.addEventListener("click", function(e) {
  x = e.clientX - canvasProcessed.offsetLeft;
  y = e.clientY - canvasProcessed.offsetTop;
  if(isLoad === 1){
    var data = ctxP.getImageData(x,y, 1, 1).data;

    output_r.innerHTML = data[0];
    output_g.innerHTML = data[1];
    output_b.innerHTML = data[2];
    function getRandomColor() {
      var color = [];
      color.push(data[0]);
      color.push(data[1]);
      color.push(data[2]);
      return 'rgb('+color.join(', ')+')';
    }
    output_h.innerHTML = RGBtoHSV(data[0],data[1],data[2]).h;
    output_s.innerHTML = RGBtoHSV(data[0],data[1],data[2]).s;
    output_v.innerHTML = RGBtoHSV(data[0],data[1],data[2]).v;
  };
})

canvasOriginal.addEventListener("click", function(e) {
  x = e.clientX - canvasOriginal.offsetLeft;
  y = e.clientY - canvasOriginal.offsetTop;
  if(isLoad === 1){
    var data = ctxP.getImageData(x,y, 1, 1).data;
    output_r.innerHTML = data[0];
    output_g.innerHTML = data[1];
    output_b.innerHTML = data[2];
    function getRandomColor() {
      var color = [];
      color.push(data[0]);
      color.push(data[1]);
      color.push(data[2]);
      return 'rgb('+color.join(', ')+')';
    }
    output_h.innerHTML = RGBtoHSV(data[0],data[1],data[2]).h;
    output_s.innerHTML = RGBtoHSV(data[0],data[1],data[2]).s;
    output_v.innerHTML = RGBtoHSV(data[0],data[1],data[2]).v;
  };
})

function HSVtoRGB(h, s, v) {
    var r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}

function changeSaturaion() {
  var imageData;
  var indexR = 0;
  var indexS = 0;
  var indexV = 0;
  var rgbTemp = {};
  var pixelColors = [0,0];

  imageData = ctxO.getImageData(0, 0, canvasOriginal.width, canvasOriginal.height);
  for (var i = 0; i < canvasProcessed.width*canvasProcessed.height; i++) {
      var tmpHSV = RGBtoHSV(imageData.data[indexR],imageData.data[indexS + 1],imageData.data[indexV + 2]);
      pixelColors[0] = tmpHSV.h;
      pixelColors[1] = tmpHSV.v;

      if(pixelColors[0] > 355 || pixelColors[0] < 10) {
        var tmpRGB = HSVtoRGB(pixelColors[0]/360,slider_g.value/100,pixelColors[1]/100);
        imageData.data[indexR] = tmpRGB.r;
        imageData.data[indexS + 1] = tmpRGB.g;
        imageData.data[indexV + 2] = tmpRGB.b;
      }
      indexR += 4;
      indexS += 4;
      indexV += 4;
    }
      ctxP.putImageData(imageData, 0, 0);
  }

function saveImage(image) {
      var link = document.createElement("a");
      link.setAttribute("href", image.src);
      link.setAttribute("download", "processed_image");
      link.click();
}


btnDownload.addEventListener("click", ()=>{
  var image = ReImg.fromCanvas(document.getElementById('img_processed')).toPng();
  saveImage(image);
});
