﻿function mediaExporterResource($http) {

    var apiRoot = "backoffice/MediaExporter/Dashboard/";

    return {

        exportMedia: function(nodeId) {
            return $http.post(apiRoot + "ExportMedia/?nodeId=" + nodeId, null, { responseType: 'arraybuffer' });
        },
        exportAllMedia: function() {
            return $http.post(apiRoot + "ExportAllMedia", null, { responseType: 'arraybuffer' });
        }
    };
}

angular.module('umbraco.resources').factory('mediaExporterResource', mediaExporterResource);