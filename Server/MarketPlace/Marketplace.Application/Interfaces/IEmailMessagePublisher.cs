using Marketplace.Application.Common.Models;

namespace Marketplace.Application.Interfaces;

public interface IEmailMessagePublisher
{
    Task PublishAsync(EmailMessage message, CancellationToken cancellationToken = default);
}
