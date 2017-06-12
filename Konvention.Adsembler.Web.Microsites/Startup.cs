using System;
using System.Threading.Tasks;
using Konvention.Adsembler.Web.Microsites.Models;
using Microsoft.Owin;
using Owin;

[assembly: OwinStartup(typeof(Konvention.Adsembler.Web.Microsites.Startup))]

namespace Konvention.Adsembler.Web.Microsites
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            app.CreatePerOwinContext(ApplicationDbContext.Create);

            ConfigureSignalR(app);
        }
    }
}
