using Umbraco.Core;
using Umbraco.Web.Models.Trees;
using Umbraco.Web.Trees;

namespace MediaExporter
{
    public class Startup : ApplicationEventHandler
    {
        protected override void ApplicationStarting(UmbracoApplicationBase umbracoApplication,
            ApplicationContext applicationContext)
        {
            TreeControllerBase.MenuRendering += TreeControllerBaseOnMenuRendering;
        }

        private void TreeControllerBaseOnMenuRendering(TreeControllerBase sender, MenuRenderingEventArgs e)
        {
            if (sender.TreeAlias == "media" 
                && sender.Security.CurrentUser.UserType.Alias == "admin"
                && e.NodeId != "-1" && e.NodeId != "-21")
            {
                var menuItem = new MenuItem()
                {
                    Alias = "mediaExporter",
                    Name = "Export Media",
                    Icon = "zip",
                    SeperatorBefore = true
                };
                menuItem.LaunchDialogView("/App_Plugins/MediaExporter/Backoffice/Dialogs/dialog.html",
                    "Media Exporter");
                e.Menu.Items.Insert(e.Menu.Items.Count - 1, menuItem);
            }
            else if (e.NodeId == "-1")
            {
                var menuItem = new MenuItem()
                {
                    Alias =  "mediaExporter",
                    Name = "Export All Media",
                    Icon = "zip",
                    SeperatorBefore = true
                };
                menuItem.LaunchDialogView("/App_Plugins/MediaExporter/Backoffice/Dialogs/exportAll.html", "Media Exporter");
                e.Menu.Items.Insert(e.Menu.Items.Count - 1, menuItem);
            }
        }
    }
}