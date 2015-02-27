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

                options:
                  interrupt: true

                tasks: ['coffee:compile', 'execute']
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

        execute:
            eve:
                src: ['js/eve.js']

        concurrent:
            eve: ['watch']                

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
                        '**/*.html'
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

    grunt.registerTask 'default', [
        'clean', 
        'coffee', 
        'copy',
        # 'concurrent:eve',
        # 'watch'
    ]

    grunt.registerTask 'start', 'execute:eve'
    grunt.registerTask 'test', 'mochaTest'