module.exports = function(grunt) {

    var pkg = grunt.file.readJSON("package.json");
    var projectRoot = "UmbracoMediaExporter/" + pkg.name + "/";
    var assembly = grunt.file.readJSON(projectRoot + "Properties/AssemblyInfo.json");
    var version = assembly.informationalVersion ? assembly.informationVersion : assembly.version;

    grunt.initConfig({
        pkg: pkg,
        clean: {
            files: [
                "Releases/temp/*.*"
            ]
        },
        copy: {
            release: {
                files: [
                    {
                        expand: true,
                        cwd: projectRoot + "bin/Release/",
                        src: [
                            pkg.name + ".dll",
                            pkg.name + ".xml"
                        ],
                        dest: "Releases/temp/bin/"
                    }
                ]
            }
        },
        nugetpack: {
            dist: {
                src: "UmbracoMediaExporter/" + pkg.name + "/" + pkg.name + ".csproj",
                dest: "releases/nuget/"
            }
        },
        zip: {
            release: {
                cwd: "files/",
                src: [
                    "files/**/*.*"
                ],
                dest: "releases/github/" + pkg.name + '.v' + version + ".zip"
            }
        },
        umbracoPackage: {
            release: {
                src: "Releases/temp/",
                dest: "releases/umbraco",
                options: {
                    name: pkg.name,
                    version: version,
                    url: pkg.url,
                    license: pkg.license.name,
                    licenseUrl: pkg.license.url,
                    author: pkg.author.name,
                    authorUrl: pkg.author.url,
                    readme: pkg.readme,
                    outputName: pkg.name + ".v" + version + ".zip"
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-nuget');
    grunt.loadNpmTasks('grunt-zip');
    grunt.loadNpmTasks('grunt-umbraco.package');

    grunt.registerTask('release', ['clean', 'copy', 'zip', 'umbracoPackage', 'nugetpack', 'clean']);
    grunt.registerTask('default', ['release']);
};