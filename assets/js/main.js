var Picture = {
  transformOriginal: function(context, img, imagePath) {
    img.onload = function() {
      context.canvas.width = window.innerWidth;
      context.canvas.height = window.innerHeight;
      context.drawImage(img, 0, 0, context.canvas.width, context.canvas.height);
      var imgData = context.getImageData(0, 0, context.canvas.width, context.canvas.height);
      var duotoneData = Picture.setDuotone(imgData);
      Picture.currentImageData = duotoneData;
      context.putImageData(duotoneData, 0, 0);
    };
    img.crossOrigin = 'Anonymous';
    img.src = imagePath;
  },

  setDuotone: function(pixels) {
    for (var i = 0; i < pixels.data.length; i+=4) {
      var brightness = Pixel.brightness(pixels.data[i], pixels.data[i+1], pixels.data[i+2]);
      var firstColorBrightnessPercentage = brightness/255;
      var secondColorPercentage = 1 - firstColorBrightnessPercentage;
      var redRbg = [firstColorBrightnessPercentage * ComplementaryColors.color1[0], 0, 0];
      var greenRbg = [0, secondColorPercentage * ComplementaryColors.color2[1], 0];
      var finalRgb = ComplementaryColors.duotoneColorRgb(redRbg, greenRbg);
      pixels.data[i] = finalRgb[0];
      pixels.data[i+1] = finalRgb[1];
      pixels.data[i+2] = finalRgb[2];
    }
    Picture.duotoneImageDataArray = pixels.data.slice(0);
    return pixels;
  },

  // these transitions only work for green and red right now
  transitionToDarkerColor: function() {
    var darkerColor = ComplementaryColors.color1;
    var lighterColor = ComplementaryColors.color2;

    var balancedIncrement = darkerColor[0]/lighterColor[1];
    for (var i = 0; i < Picture.currentImageData.data.length; i += 4) {
      Picture.currentImageData.data[i] += balancedIncrement;
      Picture.currentImageData.data[i+1] -= balancedIncrement;
    }
    var mainCanvas = document.getElementById('palm-canvas');
    var context = mainCanvas.getContext('2d');
    context.putImageData(Picture.currentImageData, 0, 0);
  },

  transitionToDuotone: function() {
    var darkerColor = ComplementaryColors.color1;
    var lighterColor = ComplementaryColors.color2;
    var balancedIncrement = darkerColor[0]/lighterColor[1];

    for (var i = 0; i < Picture.currentImageData.data.length; i += 4) {
      if (Picture.currentImageData.data[i] !== Picture.duotoneImageDataArray[i] || Picture.currentImageData.data[i+1] !== Picture.duotoneImageDataArray[i+1]) {
        if (Picture.currentImageData.data[i] > Picture.duotoneImageDataArray[i]) {
          Picture.currentImageData.data[i] -= balancedIncrement;
        } else if (Picture.currentImageData.data[i] < Picture.duotoneImageDataArray[i]) {
          Picture.currentImageData.data[i] += balancedIncrement;
        }

        if (Picture.currentImageData.data[i+1] > Picture.duotoneImageDataArray[i+1]) {
          Picture.currentImageData.data[i+1] -= balancedIncrement;
        } else {
          Picture.currentImageData.data[i+1] += balancedIncrement;
        }
      }
    }
    var mainCanvas = document.getElementById('palm-canvas');
    var context = mainCanvas.getContext('2d');
    context.putImageData(Picture.currentImageData, 0, 0);
  }
}

var ComplementaryColors = {
  setColors: function(color1Arr, color2Arr) {
    ComplementaryColors.color1 = color1Arr;
    ComplementaryColors.color2 = color2Arr;
  },

  duotoneColorRgb: function(firstRgbArr, secondRgbArr) {
    var newColorRgb = [];
    for(var i in firstRgbArr) {
      var val = firstRgbArr[i] + secondRgbArr[i];
      newColorRgb.push(val);
    }
    return newColorRgb;
  }
}

var Pixel = {
  brightness: function(r, g, b) {
    var avg = (r + g + b )/3;
    return avg;
  }
}

var Keyboard = {
  checkKey: function(event) {
    event.preventDefault();
    if (event.keyCode == 39) {
      Picture.transitionToDarkerColor();
    } else if (event.keyCode == 37) {
      Picture.transitionToDuotone();
    }
  }
}

$(document).ready(function($) {
  // var palmPath = $('#palm-img').attr('src');
  var palmPath = 'http://stephaniekwak.com/misc/palmtree.jpg';
  var mainCanvas = document.getElementById('palm-canvas');
  var context = mainCanvas.getContext('2d');
  var palmImg = new Image();

  ComplementaryColors.setColors([255, 0, 0], [0, 128, 0]);
  Picture.transformOriginal(context, palmImg, palmPath);
  document.addEventListener('keydown', function(e) {
    Keyboard.checkKey(e);
  });
});
