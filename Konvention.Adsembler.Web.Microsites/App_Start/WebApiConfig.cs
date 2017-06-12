using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;

namespace Konvention.Adsembler.Web.Microsites
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            // Web API configuration and services

            // Web API routes
            config.MapHttpAttributeRoutes();

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );

            // Load Slack receiver
            config.InitializeReceiveSlackWebHooks();
            config.InitializeReceiveGenericJsonWebHooks();
        }
    }
}
