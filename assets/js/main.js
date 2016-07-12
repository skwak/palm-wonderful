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
      var lighterColorBrightnessPercentage = brightness/255;
      var darkerColorBrightnessPercentage  = 1 - lighterColorBrightnessPercentage;
      var redRbg = [darkerColorBrightnessPercentage * ComplementaryColors.color1[0], 0, 0];
      var greenRbg = [0, lighterColorBrightnessPercentage * ComplementaryColors.color2[1], 0];
      var finalRgb = ComplementaryColors.duotoneColorRgb(redRbg, greenRbg);
      pixels.data[i] = finalRgb[0];
      pixels.data[i+1] = finalRgb[1];
      pixels.data[i+2] = finalRgb[2];
    }
    var pixelDataArr = Array.prototype.slice.call(pixels.data);
    Picture.duotoneImageDataArray = new Uint8ClampedArray(pixelDataArr);

    return pixels;
  },

  transition: function(type, context, canvas) {
    var darkerColor = ComplementaryColors.color1;
    var lighterColor = ComplementaryColors.color2;
    var balancedIncrement = darkerColor[0]/lighterColor[1];

    switch (type) {
      case 'dark':
      // If darkening (going to red), then loop through the pixels and
      // increment the red (by a 'balanced increment' so that the effect isn’t super slow)
      // and subtract any green.
        for (var i = 0; i < Picture.currentImageData.data.length; i += 4) {
          Picture.currentImageData.data[i] += balancedIncrement;
          Picture.currentImageData.data[i+1] -= balancedIncrement;
        }
        context.putImageData(Picture.currentImageData, 0, 0);
        break;

      case 'duotone':
      //If going to the duotone, loop through the current pixels (in this case, since was
      // brute forcing the image to green and red, this loop just looks at the first two elements
      // of each [ r, g, b, alpha]. If a current pixel is not the same as the corresponding duotone pixel,
      // then decrease any red and increase the green using that balanced increment.
        for (var i = 0; i < Picture.currentImageData.data.length; i += 4) {
          if (Picture.currentImageData.data[i] !== Picture.duotoneImageDataArray[i] || Picture.currentImageData.data[i+1] !== Picture.duotoneImageDataArray[i+1]) {
            if (Picture.currentImageData.data[i] > Picture.duotoneImageDataArray[i]) {
              Picture.currentImageData.data[i] -= balancedIncrement;
            } else if (Picture.currentImageData.data[i] < Picture.duotoneImageDataArray[i]) {
              Picture.currentImageData.data[i] += balancedIncrement;
            }

            if (Picture.currentImageData.data[i+1] > Picture.duotoneImageDataArray[i+1]) {
              Picture.currentImageData.data[i+1] -= balancedIncrement;
            } else if (Picture.currentImageData.data[i+1] < Picture.duotoneImageDataArray[i+1])  {
              Picture.currentImageData.data[i+1] += balancedIncrement;
            }
          }
        }
        context.putImageData(Picture.currentImageData, 0, 0);
        break;
      }
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
  checkKey: function(event, context, canvas) {
    event.preventDefault();
    if (event.keyCode == 39) {
      Picture.transition('dark', context, canvas);
    } else if (event.keyCode == 37) {
      Picture.transition('duotone', context, canvas);
    }
  }
}

$(document).ready(function($) {
  var palmPath = $('#palm-img').attr('src');
  var mainCanvas = document.getElementById('palm-canvas');
  var context = mainCanvas.getContext('2d');
  var palmImg = new Image();
  ComplementaryColors.setColors([255, 0, 0], [0, 128, 0]);
  Picture.transformOriginal(context, palmImg, palmPath);
  document.addEventListener('keydown', function(e) {
    Keyboard.checkKey(e, context, mainCanvas);
  });
});
