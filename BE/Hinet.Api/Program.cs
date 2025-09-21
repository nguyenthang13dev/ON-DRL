using Hinet.Api;
using Hinet.Api.Core.Middleware;
using Hinet.Extensions;
using Hinet.Service.EmailService.Dto;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Options;
using Microsoft.OpenApi.Models;
using Serilog;

internal class Program
{
    private static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);
        builder.Configuration.UseAppSettings();
        builder.Services.UseConfigurationServices();
        builder.Services.AddMemoryCache();
        builder.Services.AddHttpClient();

        Log.Logger = new LoggerConfiguration()
        .WriteTo.File("Logs/log-.txt", rollingInterval: RollingInterval.Day)
        .Enrich.FromLogContext()
        .CreateLogger();
        builder.Host.UseSerilog();



        builder.Services.Configure<CompanyInfoDto>(
        builder.Configuration.GetSection("CompanyInfo"));

        builder.Services.AddSingleton(resolver =>
            resolver.GetRequiredService<IOptions<CompanyInfoDto>>().Value);

        builder.Services.AddTransient<ExceptionHandlingMiddleware>();
        //builder.Services.AddSwaggerGen(c =>
        //{
        //    c.SwaggerDoc("v1", new OpenApiInfo { Title = "ONDRL", Version = "v1" });
        //    c.CustomSchemaIds(type => type.FullName);
        //});
        builder.Services.AddSwaggerGen(option =>
        {
            option.SwaggerDoc("v1", new OpenApiInfo { Title = "ONDRL", Version = "v1" });
            option.CustomSchemaIds(type => type.FullName);
            option.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
            {
                In = ParameterLocation.Header,
                Description = "Please enter a valid token",
                Name = "Authorization",
                Type = SecuritySchemeType.Http,
                BearerFormat = "JWT",
                Scheme = "Bearer"
            });
            option.AddSecurityRequirement(new OpenApiSecurityRequirement
            {
                {
                    new OpenApiSecurityScheme
                    {
                        Reference = new OpenApiReference
                        {
                            Type=ReferenceType.SecurityScheme,
                            Id="Bearer"
                        }
                    },
                    new string[]{}
                }
            });
        });
        var app = builder.Build();

        app.UseCors(builder =>
        {
            builder.WithOrigins(AppSettings.AllowedOrigins.ToArray())
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials();
        });

        app.UseSwagger();
        app.UseSwaggerUI(c =>
        {
            c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");
        });
        app.UseDeveloperExceptionPage();

        //app.UseStaticFiles(new StaticFileOptions
        //{
        //    FileProvider = new PhysicalFileProvider(
        //           Path.Combine(builder.Environment.ContentRootPath, "wwwroot", "uploads")),
        //    RequestPath = "/uploads",
        //});

        app.UseStaticFiles(new StaticFileOptions
        {
            FileProvider = new PhysicalFileProvider(
        Path.Combine(builder.Environment.ContentRootPath, "wwwroot", "uploads")),
            RequestPath = "/uploads"
        });

        app.UseStaticFiles();

        app.UseAuthentication();
        app.UseAuthorization();
        app.UseMiddleware<ExceptionHandlingMiddleware>();

        app.UseHttpsRedirection();
        app.MapControllers();
        app.Run();
    }
}