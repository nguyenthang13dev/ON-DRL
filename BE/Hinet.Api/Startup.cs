using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Hinet.Model.Entities;
using Hinet.Service.Core.Mapper;
using Hinet.Service.Common.Service;
using Hinet.Repository;
using Hinet.Model;
using Hinet.Extensions;
using Microsoft.OpenApi.Models;
using MongoDB.Driver;
using Hinet.Api.Filter;
using OfficeOpenXml;
using Hangfire;
using Hangfire.MemoryStorage;
using Hinet.Service.Common.TelegramNotificationService;
using Hinet.Service.QLNhanSu.NS_NhanSuService;

namespace Hinet.Api
{
    public static class Startup
    {

        public static void UseConfigurationServices(this IServiceCollection services)
        {

            services.AddControllers();
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            services.AddEndpointsApiExplorer();
            services.AddSwaggerGen(opts =>
            {
                opts.AddSecurityDefinition(JwtBearerDefaults.AuthenticationScheme, new OpenApiSecurityScheme()
                {
                    Name = "Authorization",
                    In = ParameterLocation.Header,
                    Type = SecuritySchemeType.ApiKey,
                    Scheme = "Bearer"
                });

                opts.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type =ReferenceType.SecurityScheme,
                                Id = JwtBearerDefaults.AuthenticationScheme,

                            }
                        }, new string[]{ }
                    }
                });
            });

            //services.AddSignalR();
            services.Configure<FormOptions>(options => { options.MultipartBodyLengthLimit = 1048576000; });

            services.AddHangfire(config =>
                 config.UseMemoryStorage()); // hoặc UseSqlServerStorage(...)
            services.AddHangfireServer();

            services.AddDbContext<HinetContext>(options =>
            {
                var connectionString = AppSettings.Connections.PostgreSQLConnection;
                options.UseNpgsql(connectionString, b => b.MigrationsAssembly("Hinet.Model"));
            });

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


            services.AddDependencyInjection();

            services.AddIdentity<AppUser, AppRole>()
                 .AddEntityFrameworkStores<HinetContext>()
                 .AddDefaultTokenProviders();
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
                     RequireExpirationTime = true,
                     IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(AppSettings.AuthSetting.Key)),
                     ValidateIssuerSigningKey = true,
                 };
             });
            //services.AddStackExchangeRedisCache(options =>
            //{
            //    options.Configuration = AppSettings.ConnectionStrings.DistCacheConnectionString;
            //    options.InstanceName = "Hinet_";
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

                 // User settings.
                 options.User.AllowedUserNameCharacters =
                 "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._@+";
                 options.User.RequireUniqueEmail = true;

                 //SignIn settings
                 options.SignIn.RequireConfirmedEmail = true;
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
            services.AddScoped<ITelegramNotificationService, TelegramNotificationService>();
        }

        private static void AddDependencyInjection(this IServiceCollection services)
        {

            services.AddScoped<IMapper, Mapper>();
            services.AddScoped<DbContext, HinetContext>();
            services.AddScoped<LogActionFilter>();
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




            // Register IMongoRepository<> implementations
            services.AddScoped(typeof(IMongoRepository<>), typeof(MongoRepository<>));
            var mongoRepositoryTypes = typeof(IMongoRepository<>).Assembly.GetTypes()
                 .Where(x => !string.IsNullOrEmpty(x.Namespace) && x.Namespace.StartsWith("Hinet.Repository") && x.Name.EndsWith("MongoRepository"));
            foreach (var intf in mongoRepositoryTypes.Where(t => t.IsInterface))
            {
                var impl = mongoRepositoryTypes.FirstOrDefault(c => c.IsClass && intf.Name.Substring(1) == c.Name);
                if (impl != null) services.AddScoped(intf, impl);
            }

            // Register IMongoService<> implementations
            services.AddScoped(typeof(IMongoService<>), typeof(MongoService<>));
            var mongoServiceTypes = typeof(IMongoService<>).Assembly.GetTypes()
                 .Where(x => !string.IsNullOrEmpty(x.Namespace) && x.Namespace.StartsWith("Hinet.Service") && x.Name.EndsWith("MongoService"));
            foreach (var intf in mongoServiceTypes.Where(t => t.IsInterface))
            {
                var impl = mongoServiceTypes.FirstOrDefault(c => c.IsClass && intf.Name.Substring(1) == c.Name);
                if (impl != null) services.AddScoped(intf, impl);
            }
        }
    }

}
