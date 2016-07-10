var Palm = {
  original: function() {
    // image path only works with CORS chrome plugin
    // remember to change this link once site has been published
    var palmPath = 'http://stephaniekwak.com/misc/palmtree.jpg';
    var mainCanvas = document.getElementById('palm-canvas');
    var context = mainCanvas.getContext('2d');

    // do not display this un-duotoned image in final result
    var palmImg = new Image();
    palmImg.crossOrigin = 'Anonymous';
    palmImg.src = palmPath;
    palmImg.onload = function() {
      context.canvas.width = window.innerWidth;
      context.canvas.height = window.innerHeight;
      context.drawImage(palmImg, 0, 0, context.canvas.width, context.canvas.height);
    };
  }
}

$(document).ready(function($) {
  Palm.original();
});
