using System.Configuration;
using Microsoft.AspNet.SignalR;
using Owin;

namespace Konvention.Adsembler.Web.Microsites
{
    public partial class Startup
    {
        public void ConfigureSignalR(IAppBuilder app)
        {
            string sqlConnectionString = ConfigurationManager.ConnectionStrings["ApplicationDbContext"].ConnectionString;;
            GlobalHost.DependencyResolver.UseSqlServer(sqlConnectionString);
            app.MapSignalR();
        }
    }
}