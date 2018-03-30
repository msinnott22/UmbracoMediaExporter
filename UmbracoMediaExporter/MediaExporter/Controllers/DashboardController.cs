using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using Newtonsoft.Json;
using umbraco.cms.businesslogic.Files;
using Umbraco.Core;
using Umbraco.Core.IO;
using Umbraco.Core.Models;
using Umbraco.Web;
using Umbraco.Web.Mvc;
using Umbraco.Web.WebApi;

namespace MediaExporter.Controllers
{
    [PluginController("MediaExporter")]
    public class DashboardController : UmbracoAuthorizedApiController
    {
        [HttpPost]
        public void ExportMedia(int nodeId)
        {
            var helper = new UmbracoHelper(UmbracoContext.Current);
            var mediaFolder = helper.TypedMedia(nodeId);
            var mediaService = Services.MediaService;
            var mediaFilesToZip = new List<string>();

            foreach (var mediaItem in mediaFolder.Children)
            {
                var media = mediaService.GetById(mediaItem.Id);
                var umbracoFileProp = media.Properties.First(p => p.Alias == "umbracoFile");
                var file = JsonConvert.DeserializeObject<UmbFile>(umbracoFileProp.Value.ToString());
                if (file != null)
                {
                    mediaFilesToZip.Add(file.src);
                }
            }

            var count = mediaFilesToZip.Count;
            //TODO: ZIP code needs to go here. Going to use SharpZipLib as it comes with Umbraco.
            //TODO: FastZip() method seems the way. 
        }
    }

    public class UmbFile
    {
        public string src { get; set; }
        public List<object> crops { get; set; }
    }
}