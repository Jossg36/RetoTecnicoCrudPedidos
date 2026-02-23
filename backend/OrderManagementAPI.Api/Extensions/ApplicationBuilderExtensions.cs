using Microsoft.EntityFrameworkCore;
using OrderManagementAPI.Api.Middleware;
using OrderManagementAPI.Infrastructure.Data;
using Serilog;

namespace OrderManagementAPI.Api.Extensions;

public static class ApplicationBuilderExtensions
{
    public static void UseApplicationPipeline(this WebApplication app)
    {
        // Habilitar Swagger en desarrollo con configuración profesional
        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger(options =>
            {
                options.RouteTemplate = "api-docs/{documentName}/swagger.json";
            });

            app.UseSwaggerUI(options =>
            {
                options.SwaggerEndpoint("/api-docs/v1/swagger.json", "Order Management API v1.0.0");
                
                // Configuración visual y de UX
                options.RoutePrefix = string.Empty;  // Documentación en raíz (localhost:5001)
                options.DocumentTitle = "📦 Order Management API - Swagger Documentation";
                options.DisplayRequestDuration();
                options.EnableDeepLinking();
                options.EnableTryItOutByDefault();
                options.ShowExtensions();
                
                // Configuración avanzada
                options.ConfigObject.AdditionalItems["persistAuthorization"] = true;
                options.ConfigObject.DefaultModelsExpandDepth = 1;
                options.ConfigObject.DefaultModelExpandDepth = 2;
                options.ConfigObject.DocExpansion = Swashbuckle.AspNetCore.SwaggerUI.DocExpansion.List;
            });
        }

        // HTTPS redirect
        app.UseHttpsRedirection();

        // Request logging
        app.UseRequestLogging();

        // Global exception handling
        app.UseGlobalExceptionHandler();

        // CORS
        app.UseCors("AllowReactApp");

        // Authentication and Authorization
        app.UseAuthentication();
        app.UseAuthorization();

        // Routes
        app.MapControllers();
        app.MapHealthChecks("/health");
    }

    public static async Task ApplyDatabaseMigrationsAsync(this WebApplication app)
    {
        using var scope = app.Services.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
        
        try
        {
            Log.Information("[MIGRACIONES] Aplicando migraciones de base de datos...");
            await dbContext.Database.MigrateAsync();
            Log.Information("[OK] Migraciones completadas");

            await DatabaseSeeder.SeedAsync(dbContext, logger);
        }
        catch (Exception ex)
        {
            Log.Error(ex, "[ERROR] Migraciones fallidas: {Message}", ex.Message);
            throw;
        }
    }
}
