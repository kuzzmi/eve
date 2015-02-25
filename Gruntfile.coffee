'use strict'

module.exports = (grunt) ->

    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);

    grunt.initConfig
        watch: 
            tests: 
                files: [
                    'tests/**/*.js', 
                    'src/**/*.js'
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
                        '**/*.json',
                        '**/*.js'
                    ]
                }]

        clean:
            dist:
                files: [{
                    dot: true,
                    src: ['js/**/*']
                }]

    grunt.registerTask 'test', 'mochaTest'