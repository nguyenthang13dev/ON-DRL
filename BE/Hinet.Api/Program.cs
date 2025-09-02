using Hangfire;
using Hinet.Api;
using Hinet.Api.Core.Middleware;
using Hinet.Api.Middleware;
using Hinet.Extensions;
using Hinet.Service.Common.TelegramNotificationService;
using Hinet.Service.EmailService.Dto;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.OpenApi.Models;
using Serilog;
using System.Text.Json;

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


        //builder.WebHost.ConfigureKestrel(options =>
        //{
        //    options.ListenAnyIP(8784); // Dùng cổng không bị trùng
        //});

        builder.Services.Configure<CompanyInfoDto>(
    builder.Configuration.GetSection("CompanyInfo"));

        builder.Services.AddSingleton(resolver =>
            resolver.GetRequiredService<IOptions<CompanyInfoDto>>().Value);
        builder.Services.AddScoped<ITelegramNotificationService, TelegramNotificationService>();

        builder.Services.AddTransient<ExceptionHandlingMiddleware>();
        //builder.Services.AddTransient<ApiPermissionsMiddleware>();
        builder.Services.AddSwaggerGen(c =>
        {
            c.SwaggerDoc("v1", new OpenApiInfo { Title = "Quản Lý Doanh Nghiệp", Version = "v1" });

            // Tùy chỉnh tên Schema tránh trùng lặp
            c.CustomSchemaIds(type => type.FullName);
        });

        var app = builder.Build();

        app.UseCors(builder =>
        {
            builder.WithOrigins(AppSettings.AllowedOrigins.ToArray())
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials();
        });

        app.UseHangfireDashboard();
        app.UseHangfireServer();
        app.UseSwagger();
        app.UseSwaggerUI(c =>
        {
            c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");
        });
        app.UseDeveloperExceptionPage();
        //app.UseMiddleware<LoggingMiddleware>();

        app.UseStaticFiles(new StaticFileOptions
        {
            FileProvider = new PhysicalFileProvider(
                   Path.Combine(builder.Environment.ContentRootPath, "wwwroot", "uploads")),
            RequestPath = "/uploads",
        });
        app.UseStaticFiles();

        app.UseAuthentication();
        app.UseAuthorization();
        app.UseMiddleware<ExceptionHandlingMiddleware>();
        //app.UseMiddleware<ApiPermissionsMiddleware>();

        app.UseExceptionHandler(errorApp =>
        {
            errorApp.Run(async context =>
            {
                context.Response.StatusCode = 500;
                context.Response.ContentType = "application/json";

                var exceptionHandlerPathFeature = context.Features.Get<IExceptionHandlerPathFeature>();
                var error = exceptionHandlerPathFeature?.Error;

                var result = JsonSerializer.Serialize(new { error = error?.Message, stackTrace = error?.StackTrace });
                await context.Response.WriteAsync(result);
            });
        });
        app.UseHttpsRedirection();
        app.MapControllers();
        app.Run();
    }
}