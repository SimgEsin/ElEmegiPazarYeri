using Marketplace.Application.Interfaces;
using Marketplace.Infrastructure.Authentication;
using Marketplace.Infrastructure.Services;
using Marketplace.Infrastructure.SignalR;
using Microsoft.Extensions.DependencyInjection;

namespace Marketplace.Infrastructure;

public static class InfrastructureServiceRegistration
{
    public static IServiceCollection AddInfrastructureServices(this IServiceCollection services)
    {
        services.AddHttpContextAccessor();
        services.AddSignalR();
        services.AddScoped<ICurrentUserService, CurrentUserService>();
        services.AddScoped<IJwtProvider, JwtProvider>();
        services.AddScoped<INotificationService, NotificationService>();

        return services;
    }
}
