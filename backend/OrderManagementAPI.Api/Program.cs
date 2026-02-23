using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using FluentValidation;
using Serilog;
using OrderManagementAPI.Application.Interfaces;
using OrderManagementAPI.Application.Validators.Auth;
using OrderManagementAPI.Application.Validators.Orders;
using OrderManagementAPI.Infrastructure.Data;
using OrderManagementAPI.Infrastructure.Security;
using OrderManagementAPI.Infrastructure.Services;
using OrderManagementAPI.Infrastructure.Mapping;
using OrderManagementAPI.Api.Middleware;
using OrderManagementAPI.Api.Extensions;

var builder = WebApplication.CreateBuilder(args);

Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Information()
    .WriteTo.Console()
    .WriteTo.File("logs/app-.txt", rollingInterval: RollingInterval.Day)
    .CreateLogger();

builder.Host.UseSerilog();

builder.Services.AddControllers();
builder.Services.AddApplicationServices(builder.Configuration);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "http://localhost:5173")
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
    });
});

builder.Services.AddHealthChecks();

var app = builder.Build();

await app.ApplyDatabaseMigrationsAsync();
app.UseApplicationPipeline();
app.Run();
