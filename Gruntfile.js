module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! V<%= pkg.version %> <%= grunt.template.today("dd-MM-yyyy HH:MM:ss Z") %> */',
        compress: true,
        drop_console: true
      },
      all: {
        files: [{
            expand: true,
            cwd: 'js/',
            src: ['*.js', '!*.min.js'],
            dest: 'js/',
            ext: '.min.js'
        }]
      }
    },
    cssmin: {
      options: {
        banner: '/*! V<%= pkg.version %> <%= grunt.template.today("dd-MM-yyyy HH:MM:ss Z") %> */',
      },
      all: {
        expand: true,
        cwd: 'css/',
        src: ['*.css', '!*.min.css'],
        dest: 'css/',
        ext: '.min.css'
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Load the plugin that provides the "CSS minify" task.
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  // Default task(s).
  grunt.registerTask('default', ['cssmin','uglify']);

};