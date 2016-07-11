var Palm = {
  transformOriginal: function() {
    // image path only works with CORS chrome plugin
    // remember to change this link once site has been published
    // var palmPath = $('#palm-img').attr('src');
    var palmPath = 'http://stephaniekwak.com/misc/palmtree.jpg';
    var mainCanvas = document.getElementById('palm-canvas');
    var context = mainCanvas.getContext('2d');
    var palmImg = new Image();
    palmImg.onload = function() {
      context.canvas.width = window.innerWidth;
      context.canvas.height = window.innerHeight;
      context.drawImage(palmImg, 0, 0, context.canvas.width, context.canvas.height);
      var palmData = context.getImageData(0, 0, context.canvas.width, context.canvas.height);
      var duotoneData = Palm.setDuotone(palmData);
      Palm.currentImageData = duotoneData;
      context.putImageData(duotoneData, 0, 0);
    };
    palmImg.crossOrigin = 'Anonymous';
    palmImg.src = palmPath;
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
    Palm.duotoneImageDataArray = pixels.data.slice(0);
    return pixels;
  },

  // these transitions only work for green and red right now
  transitionToDarkerColor: function() {
    var darkerColor = ComplementaryColors.color1;
    var lighterColor = ComplementaryColors.color2;

    var balancedIncrement = darkerColor[0]/lighterColor[1];
    for (var i = 0; i < Palm.currentImageData.data.length; i += 4) {
      Palm.currentImageData.data[i] += balancedIncrement;
      Palm.currentImageData.data[i+1] -= balancedIncrement;
    }
    var mainCanvas = document.getElementById('palm-canvas');
    var context = mainCanvas.getContext('2d');
    context.putImageData(Palm.currentImageData, 0, 0);
  },

  transitionToDuotone: function() {
    var darkerColor = ComplementaryColors.color1;
    var lighterColor = ComplementaryColors.color2;
    var balancedIncrement = darkerColor[0]/lighterColor[1];

    for (var i = 0; i < Palm.currentImageData.data.length; i += 4) {
      if (Palm.currentImageData.data[i] !== Palm.duotoneImageDataArray[i] || Palm.currentImageData.data[i+1] !== Palm.duotoneImageDataArray[i+1]) {
        if (Palm.currentImageData.data[i] > Palm.duotoneImageDataArray[i]) {
          Palm.currentImageData.data[i] -= balancedIncrement;
        } else if (Palm.currentImageData.data[i] < Palm.duotoneImageDataArray[i]) {
          Palm.currentImageData.data[i] += balancedIncrement;
        }

        if (Palm.currentImageData.data[i+1] > Palm.duotoneImageDataArray[i+1]) {
          Palm.currentImageData.data[i+1] -= balancedIncrement;
        } else {
          Palm.currentImageData.data[i+1] += balancedIncrement;
        }
      }
    }
    var mainCanvas = document.getElementById('palm-canvas');
    var context = mainCanvas.getContext('2d');
    context.putImageData(Palm.currentImageData, 0, 0);
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
  // thinking left and right = modulate duotone effect
  // up and down = change complementary colors
  // for now, focus on left and right keys
  checkKey: function(event) {
    event.preventDefault();
    // 37 is left, 39 is right
    if (event.keyCode == 39) {
      Palm.transitionToDarkerColor();
    } else if (event.keyCode == 37) {
      Palm.transitionToDuotone();
    }
  }
}

$(document).ready(function($) {
  ComplementaryColors.setColors([255, 0, 0], [0, 128, 0]);
  Palm.transformOriginal();
  document.addEventListener('keydown', function(e) {
    Keyboard.checkKey(e);
  });
});
