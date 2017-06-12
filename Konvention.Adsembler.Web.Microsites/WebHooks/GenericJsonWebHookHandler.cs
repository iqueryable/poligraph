using System;
using System.Threading.Tasks;
using System.Web;
using Konvention.Adsembler.Web.Microsites.Models;
using Konvention.Adsembler.Web.Microsites.Models.Poligraph;
using Konvention.Adsembler.Web.Microsites.SignalR.PoligraphTicker;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.AspNet.WebHooks;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Konvention.Adsembler.Web.Microsites.WebHooks
{
    public class GenericJsonWebHookHandler : WebHookHandler
    {
        public GenericJsonWebHookHandler()
        {
            this.Receiver = "genericjson";
        }

        public override Task ExecuteAsync(string generator, WebHookHandlerContext context)
        {
            JObject data = context.GetDataOrDefault<JObject>();

            if (context.Id == "poligraph")
            {
                var item = new FeedItem();
                item.Date = Convert.ToDateTime(data.GetValue("date")).ToUniversalTime();
                item.Source = data.GetValue("source").ToString().Trim();
                item.Title = data.GetValue("title").ToString().Trim();
                item.Description = data.GetValue("description").ToString().Trim();
                item.Link = data.GetValue("link").ToString().Trim();
                item.IsLie = Helpers.IsLie(item.Description);

                using (var dbContext = HttpContext.Current.Request.GetOwinContext().Get<ApplicationDbContext>())
                {
                    dbContext.FeedItems.Add(item);
                    dbContext.SaveChanges();
                }

                var suppress = Convert.ToBoolean(data.GetValue("suppress"));
                if (!suppress && item.IsLie)
                {
                    var lie = new Lie
                    {
                        Source = item.Source,
                        Title = Helpers.GetTitle(item.Title),
                        Link = item.Link,
                        Time = Helpers.GetTime(item.Date)
                    };

                    PoligraphTicker.Instance.BroadcastLie(lie);
                }
            }

            return Task.FromResult(true);
        }
    }
}