using MediatR;
using Marketplace.Application.Common.Interfaces;
using Marketplace.Application.Interfaces;
using Marketplace.Domain.Entities;
using Marketplace.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace Marketplace.Application.Features.Conversations;

public sealed class SendMessageCommandHandler : IRequestHandler<SendMessageCommand, Guid>
{
    private readonly IMarketplaceDbContext _dbContext;
    private readonly ICurrentUserService _currentUserService;
    private readonly INotificationService _notificationService;

    public SendMessageCommandHandler(
        IMarketplaceDbContext dbContext,
        ICurrentUserService currentUserService,
        INotificationService notificationService)
    {
        _dbContext = dbContext;
        _currentUserService = currentUserService;
        _notificationService = notificationService;
    }

    public async Task<Guid> Handle(SendMessageCommand request, CancellationToken cancellationToken)
    {
        var senderId = GetCurrentUserId();
        var dto = request.Message;

        if (string.IsNullOrWhiteSpace(dto.Content))
        {
            throw new InvalidOperationException("Mesaj bos olamaz.");
        }

        var product = await _dbContext.Products
            .FirstOrDefaultAsync(entity => entity.Id == dto.ProductId && !entity.IsDeleted, cancellationToken);

        if (product is null)
        {
            throw new InvalidOperationException("Urun bulunamadi.");
        }

        var artisanProfile = await _dbContext.ArtisanProfiles
            .FirstOrDefaultAsync(entity => entity.Id == dto.ArtisanProfileId && !entity.IsDeleted, cancellationToken);

        if (artisanProfile is null)
        {
            throw new InvalidOperationException("Satici profili bulunamadi.");
        }

        var senderIsArtisan = senderId == artisanProfile.UserId;

        var conversationsQuery = _dbContext.Conversations
            .Where(entity => entity.ProductId == dto.ProductId
                && entity.ArtisanProfileId == dto.ArtisanProfileId
                && !entity.IsDeleted
                && entity.Status == ConversationStatus.Open);

        conversationsQuery = senderIsArtisan
            ? conversationsQuery.Where(entity => entity.ArtisanId == senderId)
            : conversationsQuery.Where(entity => entity.BuyerId == senderId);

        var conversation = await conversationsQuery
            .OrderByDescending(entity => entity.LastMessageAt ?? entity.CreatedAt)
            .FirstOrDefaultAsync(cancellationToken);

        if (conversation is null)
        {
            if (senderIsArtisan)
            {
                throw new InvalidOperationException("Alici olmadan konusma baslatilamaz.");
            }

            conversation = new Conversation
            {
                ProductId = dto.ProductId,
                BuyerId = senderId,
                ArtisanId = artisanProfile.UserId,
                ArtisanProfileId = dto.ArtisanProfileId,
                Subject = product.Name,
                Status = ConversationStatus.Open
            };

            await _dbContext.Conversations.AddAsync(conversation, cancellationToken);
        }

        var sentAt = DateTime.UtcNow;
        var senderRole = senderId == conversation.ArtisanId ? MessageSenderRole.Artisan : MessageSenderRole.Buyer;

        var message = new ConversationMessage
        {
            ConversationId = conversation.Id,
            SenderId = senderId,
            SenderRole = senderRole,
            Content = dto.Content,
            MessageText = dto.Content,
            SentAt = sentAt
        };

        conversation.LastMessageAt = sentAt;

        if (senderRole == MessageSenderRole.Buyer)
        {
            conversation.UnreadCountArtisan++;
        }
        else
        {
            conversation.UnreadCountBuyer++;
        }

        await _dbContext.ConversationMessages.AddAsync(message, cancellationToken);
        await _dbContext.SaveChangesAsync(cancellationToken);

        var receiverId = senderRole == MessageSenderRole.Buyer
            ? conversation.ArtisanId
            : conversation.BuyerId;

        await _notificationService.SendNotificationAsync(
            receiverId.ToString(),
            "Yeni mesajiniz var.",
            new
            {
                ConversationId = conversation.Id,
                ProductId = conversation.ProductId,
                SenderId = senderId,
                Content = dto.Content,
                SentAt = sentAt
            });

        return conversation.Id;
    }

    private Guid GetCurrentUserId()
    {
        if (Guid.TryParse(_currentUserService.UserId, out var userId))
        {
            return userId;
        }

        throw new UnauthorizedAccessException("Kullanici bilgisi bulunamadi.");
    }
}

public sealed class MakeOfferCommandHandler : IRequestHandler<MakeOfferCommand, Guid>
{
    private readonly IMarketplaceDbContext _dbContext;
    private readonly ICurrentUserService _currentUserService;
    private readonly INotificationService _notificationService;

    public MakeOfferCommandHandler(
        IMarketplaceDbContext dbContext,
        ICurrentUserService currentUserService,
        INotificationService notificationService)
    {
        _dbContext = dbContext;
        _currentUserService = currentUserService;
        _notificationService = notificationService;
    }

    public async Task<Guid> Handle(MakeOfferCommand request, CancellationToken cancellationToken)
    {
        var userId = GetCurrentUserId();
        var dto = request.Offer;

        if (dto.ProposedPrice <= 0)
        {
            throw new InvalidOperationException("Teklif tutari 0'dan buyuk olmalidir.");
        }

        var conversation = await _dbContext.Conversations
            .FirstOrDefaultAsync(entity => entity.Id == dto.ConversationId && !entity.IsDeleted, cancellationToken);

        if (conversation is null)
        {
            throw new InvalidOperationException("Konusma bulunamadi.");
        }

        if (conversation.ArtisanId != userId)
        {
            throw new UnauthorizedAccessException("Sadece satici teklif yapabilir.");
        }

        var offer = new Offer
        {
            ConversationId = conversation.Id,
            ProposedPrice = dto.ProposedPrice,
            Status = OfferStatus.Pending
        };

        await _dbContext.Offers.AddAsync(offer, cancellationToken);
        await _dbContext.SaveChangesAsync(cancellationToken);

        await _notificationService.SendNotificationAsync(
            conversation.BuyerId.ToString(),
            "Yeni bir teklif aldiniz.",
            new
            {
                OfferId = offer.Id,
                ConversationId = conversation.Id,
                ProposedPrice = offer.ProposedPrice,
                Status = offer.Status
            });

        return offer.Id;
    }

    private Guid GetCurrentUserId()
    {
        if (Guid.TryParse(_currentUserService.UserId, out var userId))
        {
            return userId;
        }

        throw new UnauthorizedAccessException("Kullanici bilgisi bulunamadi.");
    }
}

public sealed class RespondToOfferCommandHandler : IRequestHandler<RespondToOfferCommand, bool>
{
    private readonly IMarketplaceDbContext _dbContext;
    private readonly ICurrentUserService _currentUserService;

    public RespondToOfferCommandHandler(IMarketplaceDbContext dbContext, ICurrentUserService currentUserService)
    {
        _dbContext = dbContext;
        _currentUserService = currentUserService;
    }

    public async Task<bool> Handle(RespondToOfferCommand request, CancellationToken cancellationToken)
    {
        var userId = GetCurrentUserId();

        var offer = await _dbContext.Offers
            .Include(entity => entity.Conversation)
            .FirstOrDefaultAsync(entity => entity.Id == request.Id && !entity.IsDeleted, cancellationToken);

        if (offer is null)
        {
            return false;
        }

        if (offer.Id != request.Offer.OfferId)
        {
            throw new InvalidOperationException("Teklif bilgisi uyusmuyor.");
        }

        if (offer.Conversation is null || offer.Conversation.BuyerId != userId)
        {
            throw new UnauthorizedAccessException("Sadece alici teklife yanit verebilir.");
        }

        offer.Status = request.Offer.IsAccepted ? OfferStatus.Accepted : OfferStatus.Rejected;
        offer.UpdatedAt = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync(cancellationToken);
        return true;
    }

    private Guid GetCurrentUserId()
    {
        if (Guid.TryParse(_currentUserService.UserId, out var userId))
        {
            return userId;
        }

        throw new UnauthorizedAccessException("Kullanici bilgisi bulunamadi.");
    }
}

public sealed class GetMyConversationsQueryHandler : IRequestHandler<GetMyConversationsQuery, IReadOnlyList<ConversationListDto>>
{
    private readonly IMarketplaceDbContext _dbContext;
    private readonly ICurrentUserService _currentUserService;

    public GetMyConversationsQueryHandler(IMarketplaceDbContext dbContext, ICurrentUserService currentUserService)
    {
        _dbContext = dbContext;
        _currentUserService = currentUserService;
    }

    public async Task<IReadOnlyList<ConversationListDto>> Handle(GetMyConversationsQuery request, CancellationToken cancellationToken)
    {
        var userId = GetCurrentUserId();

        var conversations = await _dbContext.Conversations
            .AsNoTracking()
            .Include(entity => entity.Product)
                .ThenInclude(product => product!.ProductImages)
            .Include(entity => entity.ArtisanProfile)
            .Include(entity => entity.Messages)
            .Include(entity => entity.Offers)
            .Where(entity => !entity.IsDeleted && (entity.BuyerId == userId || entity.ArtisanId == userId))
            .OrderByDescending(entity => entity.LastMessageAt ?? entity.CreatedAt)
            .ToListAsync(cancellationToken);

        return conversations.Select(conversation =>
        {
            var lastMessage = conversation.Messages
                .Where(message => !message.IsDeleted)
                .OrderByDescending(message => message.SentAt)
                .FirstOrDefault();

            var activeOffer = conversation.Offers
                .Where(offer => !offer.IsDeleted && offer.Status == OfferStatus.Pending)
                .OrderByDescending(offer => offer.CreatedAt)
                .FirstOrDefault();

            return new ConversationListDto
            {
                Id = conversation.Id,
                ProductId = conversation.ProductId,
                ProductName = conversation.Product?.Name ?? string.Empty,
                ProductImageUrl = conversation.Product?.ProductImages
                    .Where(image => !image.IsDeleted)
                    .OrderBy(image => image.SortOrder)
                    .Select(image => image.Url)
                    .FirstOrDefault(),
                BuyerId = conversation.BuyerId,
                ArtisanId = conversation.ArtisanId,
                ArtisanProfileId = conversation.ArtisanProfileId,
                ArtisanDisplayName = conversation.ArtisanProfile?.DisplayName ?? string.Empty,
                LastMessage = lastMessage?.Content ?? lastMessage?.MessageText,
                LastMessageAt = lastMessage?.SentAt ?? conversation.LastMessageAt,
                ActiveOffer = activeOffer is null
                    ? null
                    : new OfferSummaryDto
                    {
                        Id = activeOffer.Id,
                        ProposedPrice = activeOffer.ProposedPrice,
                        Status = activeOffer.Status
                    }
            };
        }).ToList();
    }

    private Guid GetCurrentUserId()
    {
        if (Guid.TryParse(_currentUserService.UserId, out var userId))
        {
            return userId;
        }

        throw new UnauthorizedAccessException("Kullanici bilgisi bulunamadi.");
    }
}
