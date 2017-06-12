using System.Data.Entity;

namespace Konvention.Adsembler.Web.Microsites.Models
{
    public class MicrositesInitializer : CreateDatabaseIfNotExists<ApplicationDbContext>
    {
        protected override void Seed(ApplicationDbContext context)
        {
        }
    }
}