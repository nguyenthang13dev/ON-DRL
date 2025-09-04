using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using MongoDB.Bson;
using MongoDB.Driver.Linq;
using Hinet.Extensions;
using Hinet.Model.Entities;
using Hinet.Model;
using Hinet.Repository;
using Hinet.Service.Common.Service;
using System.Text;
using MongoDB.Bson.Serialization.Serializers;
using MongoDB.Bson.Serialization;
using MongoDB.Driver;
using Hinet.Service.Core.Mapper;

namespace Hinet.Api
{
    public static class Startup2
    {
        public static void UseConfigurationServices(this IServiceCollection services)
        {
            services.AddControllers();
         
            //services.AddSignalR();
            services.Configure<FormOptions>(options => { options.MultipartBodyLengthLimit = 1048576000; });

            BsonSerializer.RegisterSerializer(new GuidSerializer(GuidRepresentation.Standard));
            services.AddSingleton<IMongoClient, MongoClient>(sp =>
            {
                var connectionString = AppSettings.Connections.MongoDBConnection.ConnectionString;
                var settings = MongoClientSettings.FromConnectionString(connectionString);
                return new MongoClient(settings);
            });
            services.AddScoped(sp =>
            {
                var client = sp.GetRequiredService<IMongoClient>();
                var httpContextAccessor = sp.GetRequiredService<IHttpContextAccessor>();
                return new HinetMongoContext(client, AppSettings.Connections.MongoDBConnection.DatabaseName, httpContextAccessor);
            });

            services.AddIdentity<AppUser, AppRole>()
                    .AddMongoDbStores<AppUser, AppRole, Guid>(
                        AppSettings.Connections.MongoDBConnection.ConnectionString,
                        AppSettings.Connections.MongoDBConnection.DatabaseName
                        )
                    .AddDefaultTokenProviders();


            services.AddDependencyInjection();
            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters()
                {
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    //ValidAudience = builder.Configuration.GetSetting().AuthSettings.Audience,
                    //ValidIssuer = builder.Configuration.GetSetting().AuthSettings.Issuer,
                    RequireExpirationTime = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(AppSettings.AuthSetting.Key)),
                    ValidateIssuerSigningKey = true,
                };
            });
            //services.AddDistributedSqlServerCache(options =>
            //{
            //    options.ConnectionString = AppSettings.Connections.DistCacheConnectionString;
            //    options.SchemaName = "dbo";
            //    options.TableName = "DistributedSqlServerCache";
            //});

            services.Configure<IdentityOptions>(options =>
            {
                // Password settings.
                options.Password.RequireDigit = false;
                options.Password.RequireLowercase = false;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequireUppercase = false;
                options.Password.RequiredLength = 6;
                options.Password.RequiredUniqueChars = 0;

                // Lockout settings.
                options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromSeconds(AppSettings.AuthSetting.SecondsExpires);
                options.Lockout.MaxFailedAccessAttempts = 5;
                options.Lockout.AllowedForNewUsers = true;


            });

            services.ConfigureApplicationCookie(options =>
            {
                // Cookie settings
                options.Cookie.HttpOnly = true;
                options.ExpireTimeSpan = TimeSpan.FromSeconds(AppSettings.AuthSetting.SecondsExpires);
                options.LoginPath = "/Identity/Account/Login";
                options.AccessDeniedPath = "/Identity/Account/AccessDenied";
                options.SlidingExpiration = true;
            });

            //services.AddAuthentication()
            //     .AddGoogle(options =>
            //     {
            //         options.ClientId = AppSettings.ExternalAuth.GoogleAuth.ClientId;
            //         options.ClientSecret = AppSettings.ExternalAuth.GoogleAuth.ClientSecret;
            //         options.CallbackPath = "/google";
            //     });
        }

        private static void AddDependencyInjection(this IServiceCollection services)
        {
            services.AddScoped(typeof(IMapper), typeof(Mapper));
            services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
            var repositoryTypes = typeof(IRepository<>).Assembly.GetTypes()
                 .Where(x => !string.IsNullOrEmpty(x.Namespace) && x.Namespace.StartsWith("Hinet.Repository") && x.Name.EndsWith("Repository"));
            foreach (var intf in repositoryTypes.Where(t => t.IsInterface))
            {
                var impl = repositoryTypes.FirstOrDefault(c => c.IsClass && intf.Name.Substring(1) == c.Name);
                if (impl != null) services.AddScoped(intf, impl);
            }

            services.AddScoped(typeof(IService<>), typeof(Service<>));
            var serviceTypes = typeof(IService<>).Assembly.GetTypes()
                 .Where(x => !string.IsNullOrEmpty(x.Namespace) && x.Namespace.StartsWith("Hinet.Service") && x.Name.EndsWith("Service"));
            foreach (var intf in serviceTypes.Where(t => t.IsInterface))
            {
                var impl = serviceTypes.FirstOrDefault(c => c.IsClass && intf.Name.Substring(1) == c.Name);
                if (impl != null) services.AddScoped(intf, impl);
            }
        }
    }
}
