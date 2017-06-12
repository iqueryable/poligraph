using System;
using System.Drawing.Design;

namespace Konvention.Adsembler.Web.Microsites.Models.Poligraph
{
    public static class Helpers
    {
        public static double GetTime(DateTime date)
        {
            var start = new DateTime(2017, 1, 20);
            var localDate = new DateTimeOffset(date).ToOffset(TimeSpan.FromHours(-4)).DateTime;
            return Math.Floor((localDate - start).TotalMinutes);
        }

        public static string GetTitle(string title)
        {
            if (title.StartsWith("Donald Trump - "))
            {
                title = title.Replace("Donald Trump - ", string.Empty);
            }
            return title;
        }

        public static bool IsLie(string description)
        {
            if (description.StartsWith("The Truth-o-Meter says: Full Flop")
                || description.StartsWith("The Truth-o-Meter says: Pants on Fire")
                || description.StartsWith("The Truth-o-Meter says: False")
                || description.StartsWith("The Truth-o-Meter says: Mostly False")
                || description.StartsWith("The Truth-o-Meter says: Half-True"))
            {
                return true;
            }

            return false;
        }
    }
}