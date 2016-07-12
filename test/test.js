QUnit.test( "Pixel module", function( assert ) {
  assert.ok( Pixel.brightness(1, 2, 3) == 2, "Brightness of pixel RGB(1, 2, 3) returns average of 2" );
});
