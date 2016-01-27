module.exports = function (grunt) {
    grunt.initConfig({
    	copy: {
        	main: {
        		files: [
		      		{
		      			expand: true,
		      			src: 'dist/angular-wysiwyg-grid-complete.min.js', 
		      			dest: 'sample/', 
		      			filter: 'isFile',
		      			flatten: true
		      		},
		      		{
		      			expand: true,
		      			src: 'dist/angular-wysiwyg-grid-complete.min.css', 
		      			dest: 'sample/', 
		      			filter: 'isFile',
		      			flatten: true
		      		}
				]
			}
		},
		cssmin: {
            options: {
                shorthandCompacting: false,
                roundingPrecision: -1,
                keepSpecialComments: 0,
                noAdvanced: true,
                rebase: true
            },
            appFull: {
                files: {
                    'dist/angular-wysiwyg-grid-complete.min.css': [
                        // plugins
                        "bower_components/bootstrap/dist/css/bootstrap.css",
                        "bower_components/font-awesome/css/font-awesome.css",
                        "bower_components/grid-editor/dist/grideditor-font-awesome.css",
                        "bower_components/grid-editor/dist/grideditor.css",
                        "src/css/angular-wysiwyg-grid.css"
                    ]
                }
            },
            app: {
            	files: {
                    'dist/angular-wysiwyg-grid.min.css': [
                        "src/css/angular-wysiwyg-grid.css"
                    ]
                }
            }
       	},
		uglify: {
			appFull: {
				files: {
					'dist/angular-wysiwyg-grid-complete.min.js': 
					[
						'bower_components/jquery/dist/jquery.js',
						'bower_components/jquery-ui/jquery-ui.js',
						'bower_components/bootstrap/dist/js/bootstrap.js',
						'bower_components/grid-editor/dist/jquery.grideditor.js',
						'bower_components/angular/angular.js',
						'src/js/angular-wysiwyg-grid.js'
					]
				}
			},
			app: {
				files: {
					'dist/angular-wysiwyg-grid.min.js': 
					[
						'src/js/angular-wysiwyg-grid.js'
					]
				}
			}
		}
    });

    grunt.registerTask("default", ["uglify", "cssmin", "copy"]);

	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-uglify');
};