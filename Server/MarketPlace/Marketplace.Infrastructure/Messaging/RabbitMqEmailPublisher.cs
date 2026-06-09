using System.Text;
using System.Text.Json;
using Marketplace.Application.Common.Models;
using Marketplace.Application.Interfaces;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using RabbitMQ.Client;

namespace Marketplace.Infrastructure.Messaging;

public sealed class RabbitMqEmailPublisher : IEmailMessagePublisher
{
    private readonly IRabbitMqConnection _connection;
    private readonly RabbitMqOptions _options;
    private readonly ILogger<RabbitMqEmailPublisher> _logger;

    public RabbitMqEmailPublisher(
        IRabbitMqConnection connection,
        IOptions<RabbitMqOptions> options,
        ILogger<RabbitMqEmailPublisher> logger)
    {
        _connection = connection;
        _options = options.Value;
        _logger = logger;
    }

    public async Task PublishAsync(EmailMessage message, CancellationToken cancellationToken = default)
    {
        try
        {
            var connection = await _connection.GetConnectionAsync(cancellationToken);
            await using var channel = await connection.CreateChannelAsync(cancellationToken: cancellationToken);

            await channel.QueueDeclareAsync(
                queue: _options.EmailQueueName,
                durable: true,
                exclusive: false,
                autoDelete: false,
                arguments: null,
                cancellationToken: cancellationToken);

            var body = JsonSerializer.SerializeToUtf8Bytes(message);

            var properties = new BasicProperties
            {
                Persistent = true,
                ContentType = "application/json"
            };

            await channel.BasicPublishAsync(
                exchange: string.Empty,
                routingKey: _options.EmailQueueName,
                mandatory: false,
                basicProperties: properties,
                body: body,
                cancellationToken: cancellationToken);
        }
        catch (Exception exception)
        {
            // E-posta kuyruğa yazılamazsa asıl işlem (sipariş, kayıt vb.) bozulmamalı.
            _logger.LogError(exception, "E-posta mesajı RabbitMQ kuyruğuna yayınlanamadı. Alıcı: {To}", message.To);
        }
    }
}
