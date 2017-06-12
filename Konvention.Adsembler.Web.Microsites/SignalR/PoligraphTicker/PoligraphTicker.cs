using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Konvention.Adsembler.Web.Microsites.Models.Poligraph;
using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;

namespace Konvention.Adsembler.Web.Microsites.SignalR.PoligraphTicker
{
    public class PoligraphTicker
    {
        private static readonly Lazy<PoligraphTicker> _instance = new Lazy<PoligraphTicker>(() => new PoligraphTicker(GlobalHost.ConnectionManager.GetHubContext<PoligraphTickerHub>().Clients));


        private PoligraphTicker(IHubConnectionContext<dynamic> clients)
        {
            Clients = clients;
        }

        public static PoligraphTicker Instance
        {
            get
            {
                return _instance.Value;
            }
        }

        private IHubConnectionContext<dynamic> Clients
        {
            get;
            set;
        }


        public void BroadcastLie(Lie lie)
        {
            Clients.All.addLie(lie);
        }
    }
}