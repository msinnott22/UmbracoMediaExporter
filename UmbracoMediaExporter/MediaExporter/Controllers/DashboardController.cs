using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using Ionic.Zip;
using MediaExporter.Models;
using Newtonsoft.Json;
using Umbraco.Web;
using Umbraco.Web.Mvc;
using Umbraco.Web.WebApi;

namespace MediaExporter.Controllers
{
    [PluginController("MediaExporter")]
    public class DashboardController : UmbracoAuthorizedApiController
    {
        [HttpPost]
        public HttpResponseMessage ExportMedia(int nodeId)
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
                    var filePath = HttpContext.Current.Server.MapPath(file.src);
                    mediaFilesToZip.Add(filePath);
                }
            }

            using (ZipFile zip = new ZipFile())
            {
                zip.AddFiles(mediaFilesToZip, false, "");
                return ZipContentResult(zip);
            }
        }

        private HttpResponseMessage ZipContentResult(ZipFile zipFile)
        {
            var pushStreamContent = new PushStreamContent(((stream, content, context) =>
            {
                zipFile.Save(stream);
                stream.Close();
            }), "application/zip");

            return new HttpResponseMessage(HttpStatusCode.OK) {Content = pushStreamContent};
        }
    }
}