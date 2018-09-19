using System;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SpaServices.AngularCli;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using WebApplication2.Models;

namespace MoviesManagement
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
	        var connection = @"Data Source=(localdb)\ProjectsV13;AttachDbFilename=C:\Users\User\movies.mdf;Database=Movies; Trusted_Connection=Yes;";
	        services.AddMemoryCache();
			services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_1);
	        services.AddDbContext<MovieContext>(options => options.UseSqlServer(Configuration.GetConnectionString("MoviesDatabase")));
			services.AddResponseCaching();
            // In production, the Angular files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/dist";
            });
	        services.AddCors(o => o.AddPolicy("CorsPolicy", builder =>
	        {
		        builder.AllowAnyOrigin()
					.AllowAnyMethod()
			        .AllowAnyHeader().AllowCredentials();
	        }));
			services.AddSignalR();
	        services.AddSession(options =>
	        {
		        options.Cookie.Name = ".AdventureWorks.Session";
		        options.IdleTimeout = TimeSpan.FromSeconds(10);
	        });
		}

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env,MovieContext movieContext)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                app.UseHsts();
            }

		//	movieContext
			movieContext.Database.EnsureCreated();
		//	DbInit

			app.UseDefaultFiles();
			app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseSpaStaticFiles();
	        app.UseSession();
			app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller}/{action=Index}/{id?}");
            });
	        app.UseSignalR(routes =>
	        {
		        routes.MapHub<ChatHub>("/chat");
	        });
			app.UseCors("CorsPolicy");
			app.UseSpa(spa =>
			{
				// To learn more about options for serving an Angular SPA from ASP.NET Core,
				// see https://go.microsoft.com/fwlink/?linkid=864501

				spa.Options.SourcePath = "ClientApp";

				spa.UseSpaPrerendering(options =>
				{
					options.BootModulePath = $"{spa.Options.SourcePath}/dist-server/main.bundle.js";
					options.BootModuleBuilder = env.IsDevelopment()
						? new AngularCliBuilder(npmScript: "build:ssr")
						: null;
					options.ExcludeUrls = new[] { "/sockjs-node" };
				});

				//spa.UseSpaPrerendering(options =>
				//{
				//	options.BootModulePath = $"{spa.Options.SourcePath}/dist-server/main.bundle.js";
				//	options.BootModuleBuilder = env.IsDevelopment()
				//		? new AngularCliBuilder(npmScript: "build:ssr")
				//		: null;h
				//	options.ExcludeUrls = new[] { "/sockjs-node" };
				//});


				if (env.IsDevelopment())
				{
					//			spa.UseProxyToSpaDevelopmentServer("http://localhost:4200");
				//			spa.UseAngularCliServer(npmScript: "start");
					spa.UseProxyToSpaDevelopmentServer("http://localhost:4200");

				}
			});

		}
    }
}
