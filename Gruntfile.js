module.exports = function(grunt) {

    var pkg = grunt.file.readJSON("package.json");
    var projectRoot = "UmbracoMediaExporter/" + pkg.name + "/";
    var assembly = grunt.file.readJSON(projectRoot + "Properties/AssemblyInfo.json");
    var version = assembly.informationalVersion ? assembly.informationalVersion : assembly.version;

    grunt.initConfig({
        pkg: pkg,
        clean:  ["Releases/temp"],
        copy: {
            binary: {
                files: [
                    {
                        expand: true,
                        cwd: projectRoot + "bin/",
                        src: [
                            pkg.name + ".dll",
                            pkg.name + ".xml"
                        ],
                        dest: "Releases/temp/bin/"
                    }
                ]
            },
            resources: {
                files: [
                    {
                        expand: true,
                        cwd: projectRoot + "App_Plugins/" + pkg.name + "/",
                        src: ["**/*.*"],
                        dest: "Releases/temp/App_Plugins/" + pkg.name + "/"
                    }
                ]
            },
            nuget: {
                files: [
                    {
                        expand: true,
                        cwd: "Release/nuget/",
                        src: [pkg.name + "." + version + ".nupkg"],
                        dest: "C:/nugetfeed/"
                    }
                ]
            }
        },
        zip: {
            release: {
                cwd: "Releases/temp/",
                src: [
                    "Releases/temp/*.*"
                ],
                dest: "releases/github/" + pkg.name + '.v' + version + ".zip"
            }
        },
        umbracoPackage: {
            dist: {
                src: "Releases/temp/",
                dest: "releases/umbraco",
                options: {
                    name: pkg.name,
                    version: version,
                    url: pkg.url,
                    license: pkg.license,
                    licenseUrl: pkg.license,
                    author: pkg.author.name,
                    authorUrl: pkg.author.url,
                    readme: pkg.readme,
                    outputName: pkg.name + ".v" + version + ".zip"                    
                }
            }
        },
        nugetpack: {
            dist: {
                src: "UmbracoMediaExporter/" + pkg.name + "/" + pkg.name + ".csproj",
                dest: "releases/nuget/"
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-nuget');
    grunt.loadNpmTasks('grunt-zip');
    grunt.loadNpmTasks('grunt-umbraco-package');

    grunt.registerTask('release', ['clean', 'copy:binary', 'copy:resources', 'zip', 'umbracoPackage', 'nugetpack', 'clean', 'copy:nuget']);
    grunt.registerTask('default', ['release']);
};