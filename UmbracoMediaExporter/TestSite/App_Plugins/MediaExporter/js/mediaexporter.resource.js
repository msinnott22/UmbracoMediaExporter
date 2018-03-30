function mediaExporterResource($http) {

    var apiRoot = "backoffice/MediaExporter/Dashboard/";

    return {

        exportMedia: function(nodeId) {
            return $http.post(apiRoot + "ExportMedia", nodeId);
        }
    };
}

angular.module('umbraco.resources').factory('mediaExporterResource', mediaExporterResource);