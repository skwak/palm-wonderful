module.exports = function(grunt) {
  grunt.initConfig({
    uglify: {
      build: {
        src: 'assets/js/main.js',
        dest: 'assets/js/main.min.js',
      }
    },

    watch: {
      css: {
        files: ['assets/css/*.css'],
      },
      js: {
        files: ['assets/js/*.js']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.registerTask('default', ['watch', 'uglify']);
};
