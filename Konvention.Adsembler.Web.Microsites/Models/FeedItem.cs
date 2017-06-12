using System;
using Newtonsoft.Json;

namespace Konvention.Adsembler.Web.Microsites.Models
{
    public class FeedItem
    {
        public int Id { get; set; }
        public DateTime Date { get; set; }
        public string Source { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Link { get; set; }
        public bool IsLie { get; set; }
    }
}