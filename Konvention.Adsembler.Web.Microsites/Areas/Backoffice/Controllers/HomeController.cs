using System.Web.Mvc;
using Konvention.Adsembler.Web.Microsites.Areas.Backoffice.Filters;

namespace Konvention.Adsembler.Web.Microsites.Areas.Backoffice.Controllers
{
    [BasicAuthenticationFilter]
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }
    }
}