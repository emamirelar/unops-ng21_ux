using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using UNOPS.PAO.DataAccess.Context;
using UNOPS.PAO.DataAccess.Interfaces;
using UNOPS.PAO.DataAccess.Services;
using UNOPS.PAO.UNOPSDataAccess.Context;

namespace UNOPS.PAO.UNOPSDataAccess.Seed
{
    public class SeedRunner
    {
        public static async Task Main(string[] args)
        {
            // Build configuration
            IConfiguration configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                .Build();

            // Get connection string
            string connectionString = configuration.GetConnectionString("DbContext")
                ?? throw new InvalidOperationException("Connection string 'DbContext' not found.");

            string schema = configuration.GetConnectionString("DbSchema") ?? "public";

            // Create DbContext
            var options = new DbContextOptionsBuilder<UNOPSAppDbContext>()
                .UseNpgsql(connectionString)
                .Options;

            // Create DbContextSchema
            var dbContextSchema = new DbContextSchema(schema);

            // Create a dummy UserResolverService for seeding (we don't need real user resolution during seeding)
            var dummyUserResolver = new UserResolverService<int>(null!, null!);
            using var context = new UNOPSAppDbContext(
                (DbContextOptions<UNOPSAppDbContext>)options,
                dummyUserResolver,
                dbContextSchema);

            // Minimal service provider so seeders (e.g. OfficeMasterDataSeeder) can resolve IConfiguration
            using var serviceProvider = new ServiceCollection()
                .AddSingleton(configuration)
                .BuildServiceProvider();

            // Seed data using new generic configuration-driven system
            Console.WriteLine("Running all configured seed steps...");
            await GenericSeedRunner.ExecuteConfiguredSeedsAsync(context, serviceProvider, configuration);
            Console.WriteLine("All seed steps completed successfully.");

            Console.WriteLine("All configuration data seeding complete!");
        }
    }
} 