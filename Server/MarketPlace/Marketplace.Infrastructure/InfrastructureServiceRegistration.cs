using Marketplace.Application.Interfaces;
using Marketplace.Infrastructure.Authentication;
using Marketplace.Infrastructure.Messaging;
using Marketplace.Infrastructure.Services;
using Marketplace.Infrastructure.SignalR;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Marketplace.Infrastructure;

public static class InfrastructureServiceRegistration
{
    public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddHttpContextAccessor();
        services.AddSignalR();
        services.AddScoped<ICurrentUserService, CurrentUserService>();
        services.AddScoped<IJwtProvider, JwtProvider>();
        services.AddScoped<INotificationService, NotificationService>();

        services.Configure<RabbitMqOptions>(configuration.GetSection(RabbitMqOptions.SectionName));
        services.Configure<SmtpOptions>(configuration.GetSection(SmtpOptions.SectionName));

        services.AddSingleton<IRabbitMqConnection, RabbitMqConnection>();
        services.AddSingleton<IEmailSender, SmtpEmailSender>();
        services.AddSingleton<IEmailMessagePublisher, RabbitMqEmailPublisher>();
        services.AddHostedService<EmailConsumerBackgroundService>();

        return services;
    }
}
