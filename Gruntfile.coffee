'use strict'

module.exports = (grunt) ->

    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);

    grunt.initConfig
        watch:
            src: 
                files: [
                    'coffee/**/*.coffee'
                ]
                tasks: ['coffee:compile']
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
                cwd: 'coffee/',
                src: ['**/*.coffee'],
                dest: 'js/',
                ext: '.js'

        copy:
            dist:
                files: [{
                    expand: true,
                    dot: true,
                    cwd: 'coffee/',
                    dest: 'js/',
                    src: [
                        '**/*.json'
                    ]
                }]

        clean:
            src: 
                files: [{
                    dot: true,
                    src: ['coffee/**/*.js']
                }]
            dist:
                files: [{
                    dot: true,
                    src: ['js/**/*']
                }]

    grunt.registerTask 'default', ['clean', 'coffee', 'copy']
    grunt.registerTask 'test', 'mochaTest'