'use strict'

module.exports = (grunt) ->

    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);

    appConfig =
        src:  'src',
        dist: 'js'

    grunt.initConfig
        root: appConfig

        watch:
            coffee: 
                files: [
                    '<%= root.src =>/**/*.coffee'
                ]
                options:
                    interrupt: true
                tasks: ['newer:coffee:compile']
            static:
                files: [
                    '<%= root.src =>/**/*.json',
                    '<%= root.src =>/**/*.html'
                ]
                tasks: ['newer:copy:static']
            tests: 
                files: [
                    'tests/**/*.js'
                ]
                tasks: ['test']
            
        mochaTest:
            test:
                options:
                    reporter: 'spec'
                src: ['tests/**/*.js']

        coffee:
            compile:
                expand: true,
                flatten: false,
                cwd: '<%= root.src =>/eve/',
                src: ['**/*.coffee'],
                dest: '<%= root.dist =>/',
                ext: '.js'

        copy:
            static:
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= root.src =>/',
                    dest: 'js/',
                    src: [
                        '**/*.json',
                        '**/*.html'
                    ]
                }]

        clean:
            src: 
                files: [{
                    dot: true,
                    src: ['<%= root.src =>/**/*.js']
                }]
            dist:
                files: [{
                    dot: true,
                    src: ['<%= root.dist =>/**/*']
                }]

    grunt.registerTask 'default', [
        'clean', 
        'coffee', 
        'copy',
        # 'concurrent:eve',
        'watch'
    ]

    grunt.registerTask 'start', 'execute:eve'
    grunt.registerTask 'test', 'mochaTest'