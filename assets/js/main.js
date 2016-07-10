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
      Palm.imageData(palmData);
    };
    palmImg.crossOrigin = 'Anonymous';
    palmImg.src = palmPath;
  },
  imageData: function(pixels) {
    for (var i = 0; i < pixels.data.length; i+=4) {
      var brightness = Pixel.brightness(pixels.data[i], pixels.data[i+1], pixels.data[i+2]);
      console.log(brightness);
    }
  },
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
