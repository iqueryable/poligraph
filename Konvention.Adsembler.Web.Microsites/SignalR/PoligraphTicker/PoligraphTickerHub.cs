using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Konvention.Adsembler.Web.Microsites.Models;
using Konvention.Adsembler.Web.Microsites.Models.Poligraph;
using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.Identity.Owin;

namespace Konvention.Adsembler.Web.Microsites.SignalR.PoligraphTicker
{
    public class PoligraphTickerHub : Hub
    {
        private readonly PoligraphTicker _poligraphTicker;

        public PoligraphTickerHub() : this(PoligraphTicker.Instance) { }

        public PoligraphTickerHub(PoligraphTicker poligraphTicker)
        {
            _poligraphTicker = poligraphTicker;
        }

        public Setup GetSetup()
        {
            var now = new DateTimeOffset(DateTime.UtcNow).ToOffset(TimeSpan.FromHours(-4)).DateTime;

            List<Lie> lies;
            using (var dbContext = new ApplicationDbContext())
            {
                var items = dbContext.FeedItems.Where(c => c.IsLie).OrderBy(c => c.Date).ToList();
                lies = items.Select(c => new Lie
                {
                    Source = c.Source,
                    Title = Helpers.GetTitle(c.Title),
                    Link = c.Link,
                    Time = Helpers.GetTime(c.Date)
                }).ToList();
            }

            var setup = new Setup();
            setup.Minutes = Helpers.GetTime(now);
            setup.Lies = lies;
            return setup;
        }
    }
}