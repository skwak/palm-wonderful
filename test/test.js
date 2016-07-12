QUnit.test( 'Pixel module', function( assert ) {
  assert.ok( Pixel.brightness(1, 2, 3) == 2, 'Brightness of pixel RGB(1, 2, 3) returns average of 2' );
});

QUnit.test( 'Picture module', function( assert ) {
  ComplementaryColors.setColors([255, 0, 0], [0, 128, 0]);
  var testImage = new ImageData(1, 1);
  testImage.data = new Uint8ClampedArray([255, 0, 0, 0]);
  // testImage.data = new Uint8ClampedArray([]);
  assert.ok( testImage.data.length == 4, 'Image pixel data length is 4' );
  assert.ok( typeof Picture.setDuotone(testImage) == 'object', 'Duotoned image returns object');
});
