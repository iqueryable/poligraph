using System.Data.Entity;

namespace Konvention.Adsembler.Web.Microsites.Models
{
    public class ApplicationDbContext : DbContext
    {
        public DbSet<FeedItem> FeedItems { get; set; }

        public ApplicationDbContext() : base("ApplicationDbContext")
        {
        }

        public static ApplicationDbContext Create()
        {
            return new ApplicationDbContext();
        }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }
    }
}