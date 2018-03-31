angular.module("umbraco").controller("MediaExporter.Dialog.Controller",
    function($scope, mediaExporterResource) {

        var dialogOptions = $scope.dialogOptions;
        var node = dialogOptions.currentNode;

        $scope.busy = false;

        $scope.exportMedia = function() {
            $scope.busy = true;
            $scope.error = false;

            var nodeId = 0;
            if (node != null) {
                nodeId = node.id;
            }

            mediaExporterResource.exportMedia(nodeId)
                .then(function(resp) {
                        $scope.error = false;
                        $scope.success = true;
                        $scope.busy = false;

                        console.log(resp);

                        var file = new Blob([resp], { type: 'application/zip' });
                        var fileURL = URL.createObjectURL(file);
                        var downloadLink = angular.element('<a></a>');
                        downloadLink.attr('href', fileURL);
                        downloadLink.attr('download', 'Media');
                        downloadLink.attr('target', '_self');
                        downloadLink[0].click();
                        url.revokeObjectURL(fileURL);
                    },
                    function(err) {
                        $scope.success = false;
                        $scope.error = err;
                        $scope.busy = false;
                    });
        };
    });