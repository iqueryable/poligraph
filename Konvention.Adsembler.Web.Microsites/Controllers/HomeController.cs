using System;
using System.Web;
using System.Web.Mvc;
using Konvention.Adsembler.Web.Microsites.Models;
using Microsoft.AspNet.Identity.Owin;

namespace Konvention.Adsembler.Web.Microsites.Controllers
{
    public class HomeController : Controller
    {
        // GET: Home
        public ActionResult Index()
        {
            
            return Content("Hello world!");
        }
    }
}