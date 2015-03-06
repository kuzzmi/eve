"use strict"

module.exports = (grunt) ->

    require("load-grunt-tasks")(grunt);
    require("time-grunt")(grunt);

    config =
        src: "src"
        dist: "js"

    grunt.initConfig
        watch:
            coffee:
                files: [
                    "#{config.src}/**/*.coffee"
                ]
                options:
                    interrupt: true
                tasks: ["newer:coffee:compile"]
            static:
                files: [
                    "#{config.src}/**/*.json",
                    "#{config.src}/**/*.html"
                ]
                tasks: ["newer:copy:static"]
            tests: 
                files: [
                    "tests/**/*.js"
                ]
                tasks: ["test"]
            
        mochaTest:
            test:
                options:
                    reporter: "html"
                src: ["tests/**/*.js"]

        coffee:
            compile:
                expand: true,
                flatten: false,
                cwd: "#{config.src}",
                src: ["**/*.coffee"],
                dest: "#{config.dist}/",
                ext: ".js"

        copy:
            static:
                files: [{
                    expand: true,
                    dot: true,
                    cwd: "#{config.src}/",
                    dest: "#{config.dist}/",
                    src: [
                        "**/*.json",
                        "**/*.html"
                    ]
                }]

        clean:
            src: 
                files: [{
                    dot: true,
                    src: ["#{config.src}/**/*.js"]
                }]
            dist:
                files: [{
                    dot: true,
                    src: ["#{config.dist}/**/*"]
                }]

    grunt.registerTask "default", [
        "clean", 
        "coffee", 
        "copy",
        # "concurrent:eve",
        "watch"
    ]

    grunt.registerTask "start", "execute:eve"
    grunt.registerTask "test", "mochaTest"