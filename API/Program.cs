using System;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Domain;

namespace API
{
    public class Program
    {
        public static void Main(string[] args)
        {
            // Build a host
            var host = CreateHostBuilder(args).Build();

            // Get a service scope
            using(var scope = host.Services.CreateScope())
            {
                // Get a service provider
                var services = scope.ServiceProvider;

                try
                {
                    // Get data context from services
                    var context = services.GetRequiredService<DataContext>();
                    // Get user management service
                    var userManager = services.GetRequiredService<UserManager<AppUser>>();
                    // Run pending migration and create db if db doesn't exists
                    context.Database.Migrate();
                    // Seeding the data
                    Seed.SeedData(context, userManager).Wait();
                }    
                catch(Exception ex)
                {
                    // Catch and logg errors
                    var logger = services.GetRequiredService<ILogger<Program>>();
                    logger.LogError(ex, "An error occured during migration");
                }      
            }

            // Run the application
            host.Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });
    }
}
