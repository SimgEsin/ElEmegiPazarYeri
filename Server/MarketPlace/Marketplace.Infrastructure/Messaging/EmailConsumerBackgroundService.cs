using System.Text;
using System.Text.Json;
using Marketplace.Application.Common.Models;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;

namespace Marketplace.Infrastructure.Messaging;

public sealed class EmailConsumerBackgroundService : BackgroundService
{
    private readonly IRabbitMqConnection _connection;
    private readonly IEmailSender _emailSender;
    private readonly RabbitMqOptions _options;
    private readonly ILogger<EmailConsumerBackgroundService> _logger;
    private IChannel? _channel;

    public EmailConsumerBackgroundService(
        IRabbitMqConnection connection,
        IEmailSender emailSender,
        IOptions<RabbitMqOptions> options,
        ILogger<EmailConsumerBackgroundService> logger)
    {
        _connection = connection;
        _emailSender = emailSender;
        _options = options.Value;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await StartConsumingAsync(stoppingToken);
                return;
            }
            catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested)
            {
                return;
            }
            catch (Exception exception)
            {
                _logger.LogError(exception, "E-posta tüketicisi RabbitMQ'ya bağlanamadı, 10 sn sonra yeniden denenecek.");
                await Task.Delay(TimeSpan.FromSeconds(10), stoppingToken);
            }
        }
    }

    private async Task StartConsumingAsync(CancellationToken stoppingToken)
    {
        var connection = await _connection.GetConnectionAsync(stoppingToken);
        _channel = await connection.CreateChannelAsync(cancellationToken: stoppingToken);

        await _channel.QueueDeclareAsync(
            queue: _options.EmailQueueName,
            durable: true,
            exclusive: false,
            autoDelete: false,
            arguments: null,
            cancellationToken: stoppingToken);

        await _channel.BasicQosAsync(0, 10, false, stoppingToken);

        var consumer = new AsyncEventingBasicConsumer(_channel);
        consumer.ReceivedAsync += OnMessageReceivedAsync;

        await _channel.BasicConsumeAsync(
            queue: _options.EmailQueueName,
            autoAck: false,
            consumer: consumer,
            cancellationToken: stoppingToken);

        _logger.LogInformation("E-posta tüketicisi '{Queue}' kuyruğunu dinliyor.", _options.EmailQueueName);
    }

    private async Task OnMessageReceivedAsync(object sender, BasicDeliverEventArgs eventArgs)
    {
        var channel = _channel;
        if (channel is null)
        {
            return;
        }

        try
        {
            var json = Encoding.UTF8.GetString(eventArgs.Body.Span);
            var message = JsonSerializer.Deserialize<EmailMessage>(json);

            if (message is not null)
            {
                await _emailSender.SendAsync(message);
            }

            await channel.BasicAckAsync(eventArgs.DeliveryTag, multiple: false);
        }
        catch (Exception exception)
        {
            _logger.LogError(exception, "E-posta gönderilemedi, mesaj kuyruğa geri bırakılmadı.");
            // requeue: false -> sürekli başarısız olan mesaj kuyruğu kilitlemesin.
            await channel.BasicNackAsync(eventArgs.DeliveryTag, multiple: false, requeue: false);
        }
    }

    public override async Task StopAsync(CancellationToken cancellationToken)
    {
        if (_channel is not null)
        {
            await _channel.CloseAsync(cancellationToken);
            await _channel.DisposeAsync();
        }

        await base.StopAsync(cancellationToken);
    }
}
