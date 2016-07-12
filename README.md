
# palm wonderful &#127796;

## link:
 https://s3-us-west-2.amazonaws.com/palmwonderful/index.html

## Used...
 * S3: to store static final files
 * Uglify: to minify js file for production
 * Grunt: to watch for changes and run the Uglify task
 * npm: for development dependencies
 * QUnit for unit testing


## Some thoughts
* I interpreted "brightness" as the average of R, G, B of RGB for simplicity's sake, but I think perceived brightness might be a better/more interesting way to determine brightness.

* If I had more time, would improve the code so that the code resembled more of a library. That way, someone could use the library, put in some choices (image selection, colors for the duotone, user interaction), and then render the duotone and transition. I would also parameterize most everything and hide some of the logic so that not everything is accessible.

* If I had more time, would also be interested in including another kind of user interaction so that the transition effect would work in a browser in mobile.

## links I looked at for reference
* http://www.mattkandler.com/blog/duotone-image-filter-javascript-rails
* https://www.quora.com/What-is-the-reasoning-behind-these-three-different-formulae-to-calculate-the-brightness-from-an-RGB-image
* http://stackoverflow.com/questions/596216/formula-to-determine-brightness-of-rgb-color
* http://computergraphics.stackexchange.com/questions/1587/actual-vs-perceived-brightness-of-rgb-colour
* https://robots.thoughtbot.com/closer-look-color-lightness
* https://en.wikipedia.org/wiki/Complementary_colors
