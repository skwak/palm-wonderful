module.exports = function(grunt) {
  grunt.initConfig({
    watch: {
      css: {
        files: ['assets/css/*.css'],
      },
      js: {
        files: ['assets/js/*.js'],
        tasks: ['uglify:dev']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.registerTask('default', ['watch']);

};
