var Palm = {
  transformOriginal: function() {
    // image path only works with CORS chrome plugin
    // remember to change this link once site has been published
    var palmPath = 'http://stephaniekwak.com/misc/palmtree.jpg';
    var mainCanvas = document.getElementById('palm-canvas');
    var context = mainCanvas.getContext('2d');

    // do not display this un-duotoned image in final result
    var palmImg = new Image();
    palmImg.onload = function() {
      context.canvas.width = window.innerWidth;
      context.canvas.height = window.innerHeight;
      context.drawImage(palmImg, 0, 0, context.canvas.width, context.canvas.height);
      var palmData = context.getImageData(0, 0, context.canvas.width, context.canvas.height);
      var duotoneData = Palm.duotoneImageData(palmData);
      context.putImageData(duotoneData, 0, 0);
    };
    palmImg.crossOrigin = 'Anonymous';
    palmImg.src = palmPath;
  },
  duotoneImageData: function(pixels) {
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
    return pixels;
  },
}

var ComplementaryColors = {
  // hard set it for now
  // var color1 = rgb(255, 0 ,0);
  // var color2 = rgb(0, 128, 0);
  color1: [255, 0, 0],
  color2: [0, 128, 0],
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

$(document).ready(function($) {
  Palm.transformOriginal();
});
