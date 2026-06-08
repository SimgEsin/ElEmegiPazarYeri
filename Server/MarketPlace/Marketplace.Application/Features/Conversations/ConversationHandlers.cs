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
                && entity.Type == dto.Type
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
                Type = dto.Type,
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

        if (dto.EstimatedDeliveryDays <= 0)
        {
            throw new InvalidOperationException("Tahmini teslim suresi 0'dan buyuk olmalidir.");
        }

        if (string.IsNullOrWhiteSpace(dto.ProductDetails))
        {
            throw new InvalidOperationException("Urun detaylari bos olamaz.");
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
            EstimatedDeliveryDays = dto.EstimatedDeliveryDays,
            ProductDetails = dto.ProductDetails.Trim(),
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
                EstimatedDeliveryDays = offer.EstimatedDeliveryDays,
                ProductDetails = offer.ProductDetails,
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
    private readonly INotificationService _notificationService;

    public RespondToOfferCommandHandler(
        IMarketplaceDbContext dbContext,
        ICurrentUserService currentUserService,
        INotificationService notificationService)
    {
        _dbContext = dbContext;
        _currentUserService = currentUserService;
        _notificationService = notificationService;
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

        if (request.Offer.IsAccepted)
        {
            offer.Status = OfferStatus.Accepted;
            offer.Stage = AgreementStage.InProduction;
        }
        else
        {
            offer.Status = OfferStatus.Rejected;
            offer.Stage = AgreementStage.None;
        }

        offer.UpdatedAt = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync(cancellationToken);

        if (request.Offer.IsAccepted)
        {
            await _notificationService.SendNotificationAsync(
                offer.Conversation.ArtisanId.ToString(),
                "Mutabakat saglandi. Uretime baslayabilirsiniz.",
                new
                {
                    OfferId = offer.Id,
                    ConversationId = offer.ConversationId,
                    Stage = offer.Stage
                });
        }

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

public sealed class SubmitFinalProductCommandHandler : IRequestHandler<SubmitFinalProductCommand, bool>
{
    private readonly IMarketplaceDbContext _dbContext;
    private readonly ICurrentUserService _currentUserService;
    private readonly INotificationService _notificationService;

    public SubmitFinalProductCommandHandler(
        IMarketplaceDbContext dbContext,
        ICurrentUserService currentUserService,
        INotificationService notificationService)
    {
        _dbContext = dbContext;
        _currentUserService = currentUserService;
        _notificationService = notificationService;
    }

    public async Task<bool> Handle(SubmitFinalProductCommand request, CancellationToken cancellationToken)
    {
        var userId = GetCurrentUserId(_currentUserService);

        if (string.IsNullOrWhiteSpace(request.FinalProduct.Note))
        {
            throw new InvalidOperationException("Urunun son hali icin aciklama bos olamaz.");
        }

        var offer = await _dbContext.Offers
            .Include(entity => entity.Conversation)
            .FirstOrDefaultAsync(entity => entity.Id == request.OfferId && !entity.IsDeleted, cancellationToken);

        if (offer is null)
        {
            return false;
        }

        if (offer.Conversation is null || offer.Conversation.ArtisanId != userId)
        {
            throw new UnauthorizedAccessException("Sadece satici urunun son halini gonderebilir.");
        }

        if (offer.Status != OfferStatus.Accepted || offer.Stage != AgreementStage.InProduction)
        {
            throw new InvalidOperationException("Bu asamada urunun son hali gonderilemez.");
        }

        offer.FinalProductNote = request.FinalProduct.Note.Trim();
        offer.FinalProductImageUrl = string.IsNullOrWhiteSpace(request.FinalProduct.ImageUrl)
            ? null
            : request.FinalProduct.ImageUrl.Trim();
        offer.Stage = AgreementStage.AwaitingApproval;
        offer.UpdatedAt = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync(cancellationToken);

        await _notificationService.SendNotificationAsync(
            offer.Conversation.BuyerId.ToString(),
            "Saticiniz urunun son halini paylasti. Onayinizi bekliyor.",
            new
            {
                OfferId = offer.Id,
                ConversationId = offer.ConversationId,
                Stage = offer.Stage
            });

        return true;
    }

    private static Guid GetCurrentUserId(ICurrentUserService currentUserService)
    {
        if (Guid.TryParse(currentUserService.UserId, out var userId))
        {
            return userId;
        }

        throw new UnauthorizedAccessException("Kullanici bilgisi bulunamadi.");
    }
}

public sealed class ApproveFinalProductCommandHandler : IRequestHandler<ApproveFinalProductCommand, bool>
{
    private readonly IMarketplaceDbContext _dbContext;
    private readonly ICurrentUserService _currentUserService;
    private readonly INotificationService _notificationService;

    public ApproveFinalProductCommandHandler(
        IMarketplaceDbContext dbContext,
        ICurrentUserService currentUserService,
        INotificationService notificationService)
    {
        _dbContext = dbContext;
        _currentUserService = currentUserService;
        _notificationService = notificationService;
    }

    public async Task<bool> Handle(ApproveFinalProductCommand request, CancellationToken cancellationToken)
    {
        var userId = GetCurrentUserId(_currentUserService);

        var offer = await _dbContext.Offers
            .Include(entity => entity.Conversation)
            .FirstOrDefaultAsync(entity => entity.Id == request.OfferId && !entity.IsDeleted, cancellationToken);

        if (offer is null)
        {
            return false;
        }

        if (offer.Conversation is null || offer.Conversation.BuyerId != userId)
        {
            throw new UnauthorizedAccessException("Sadece alici son hali onaylayabilir.");
        }

        if (offer.Stage != AgreementStage.AwaitingApproval)
        {
            throw new InvalidOperationException("Onaylanacak bir son urun gonderimi yok.");
        }

        offer.Stage = AgreementStage.Approved;
        offer.UpdatedAt = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync(cancellationToken);

        await _notificationService.SendNotificationAsync(
            offer.Conversation.ArtisanId.ToString(),
            "Alici urunun son halini onayladi. Kargoya verebilirsiniz.",
            new
            {
                OfferId = offer.Id,
                ConversationId = offer.ConversationId,
                Stage = offer.Stage
            });

        return true;
    }

    private static Guid GetCurrentUserId(ICurrentUserService currentUserService)
    {
        if (Guid.TryParse(currentUserService.UserId, out var userId))
        {
            return userId;
        }

        throw new UnauthorizedAccessException("Kullanici bilgisi bulunamadi.");
    }
}

public sealed class RequestRevisionCommandHandler : IRequestHandler<RequestRevisionCommand, bool>
{
    private readonly IMarketplaceDbContext _dbContext;
    private readonly ICurrentUserService _currentUserService;
    private readonly INotificationService _notificationService;

    public RequestRevisionCommandHandler(
        IMarketplaceDbContext dbContext,
        ICurrentUserService currentUserService,
        INotificationService notificationService)
    {
        _dbContext = dbContext;
        _currentUserService = currentUserService;
        _notificationService = notificationService;
    }

    public async Task<bool> Handle(RequestRevisionCommand request, CancellationToken cancellationToken)
    {
        var userId = GetCurrentUserId(_currentUserService);

        var offer = await _dbContext.Offers
            .Include(entity => entity.Conversation)
            .FirstOrDefaultAsync(entity => entity.Id == request.OfferId && !entity.IsDeleted, cancellationToken);

        if (offer is null)
        {
            return false;
        }

        if (offer.Conversation is null || offer.Conversation.BuyerId != userId)
        {
            throw new UnauthorizedAccessException("Sadece alici revizyon isteyebilir.");
        }

        if (offer.Stage != AgreementStage.AwaitingApproval)
        {
            throw new InvalidOperationException("Bu asamada revizyon istenemez.");
        }

        offer.Stage = AgreementStage.InProduction;
        offer.FinalProductNote = null;
        offer.FinalProductImageUrl = null;
        offer.UpdatedAt = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync(cancellationToken);

        await _notificationService.SendNotificationAsync(
            offer.Conversation.ArtisanId.ToString(),
            "Alici revizyon talep etti. Urun yeniden uretim asamasinda.",
            new
            {
                OfferId = offer.Id,
                ConversationId = offer.ConversationId,
                Stage = offer.Stage
            });

        return true;
    }

    private static Guid GetCurrentUserId(ICurrentUserService currentUserService)
    {
        if (Guid.TryParse(currentUserService.UserId, out var userId))
        {
            return userId;
        }

        throw new UnauthorizedAccessException("Kullanici bilgisi bulunamadi.");
    }
}

public sealed class MarkShippedCommandHandler : IRequestHandler<MarkShippedCommand, bool>
{
    private readonly IMarketplaceDbContext _dbContext;
    private readonly ICurrentUserService _currentUserService;
    private readonly INotificationService _notificationService;

    public MarkShippedCommandHandler(
        IMarketplaceDbContext dbContext,
        ICurrentUserService currentUserService,
        INotificationService notificationService)
    {
        _dbContext = dbContext;
        _currentUserService = currentUserService;
        _notificationService = notificationService;
    }

    public async Task<bool> Handle(MarkShippedCommand request, CancellationToken cancellationToken)
    {
        var userId = GetCurrentUserId(_currentUserService);

        var offer = await _dbContext.Offers
            .Include(entity => entity.Conversation)
            .FirstOrDefaultAsync(entity => entity.Id == request.OfferId && !entity.IsDeleted, cancellationToken);

        if (offer is null)
        {
            return false;
        }

        if (offer.Conversation is null || offer.Conversation.ArtisanId != userId)
        {
            throw new UnauthorizedAccessException("Sadece satici kargoya verebilir.");
        }

        if (offer.Stage != AgreementStage.Approved)
        {
            throw new InvalidOperationException("Kargolama icin once alicinin onayi gerekir.");
        }

        offer.ShippingTrackingInfo = string.IsNullOrWhiteSpace(request.Shipping.TrackingInfo)
            ? null
            : request.Shipping.TrackingInfo.Trim();
        offer.Stage = AgreementStage.Shipped;
        offer.UpdatedAt = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync(cancellationToken);

        await _notificationService.SendNotificationAsync(
            offer.Conversation.BuyerId.ToString(),
            "Siparisiniz kargoya verildi.",
            new
            {
                OfferId = offer.Id,
                ConversationId = offer.ConversationId,
                Stage = offer.Stage
            });

        return true;
    }

    private static Guid GetCurrentUserId(ICurrentUserService currentUserService)
    {
        if (Guid.TryParse(currentUserService.UserId, out var userId))
        {
            return userId;
        }

        throw new UnauthorizedAccessException("Kullanici bilgisi bulunamadi.");
    }
}

public sealed class MarkDeliveredCommandHandler : IRequestHandler<MarkDeliveredCommand, bool>
{
    private readonly IMarketplaceDbContext _dbContext;
    private readonly ICurrentUserService _currentUserService;
    private readonly INotificationService _notificationService;

    public MarkDeliveredCommandHandler(
        IMarketplaceDbContext dbContext,
        ICurrentUserService currentUserService,
        INotificationService notificationService)
    {
        _dbContext = dbContext;
        _currentUserService = currentUserService;
        _notificationService = notificationService;
    }

    public async Task<bool> Handle(MarkDeliveredCommand request, CancellationToken cancellationToken)
    {
        var userId = GetCurrentUserId(_currentUserService);

        var offer = await _dbContext.Offers
            .Include(entity => entity.Conversation)
            .FirstOrDefaultAsync(entity => entity.Id == request.OfferId && !entity.IsDeleted, cancellationToken);

        if (offer is null)
        {
            return false;
        }

        if (offer.Conversation is null || offer.Conversation.BuyerId != userId)
        {
            throw new UnauthorizedAccessException("Sadece alici teslim aldigini onaylayabilir.");
        }

        if (offer.Stage != AgreementStage.Shipped)
        {
            throw new InvalidOperationException("Teslim onayi icin siparisin kargoda olmasi gerekir.");
        }

        offer.Stage = AgreementStage.Delivered;
        offer.UpdatedAt = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync(cancellationToken);

        await _notificationService.SendNotificationAsync(
            offer.Conversation.ArtisanId.ToString(),
            "Alici siparisi teslim aldigini onayladi. Mutabakat tamamlandi.",
            new
            {
                OfferId = offer.Id,
                ConversationId = offer.ConversationId,
                Stage = offer.Stage
            });

        return true;
    }

    private static Guid GetCurrentUserId(ICurrentUserService currentUserService)
    {
        if (Guid.TryParse(currentUserService.UserId, out var userId))
        {
            return userId;
        }

        throw new UnauthorizedAccessException("Kullanici bilgisi bulunamadi.");
    }
}

public sealed class GetConversationMessagesQueryHandler : IRequestHandler<GetConversationMessagesQuery, IReadOnlyList<ConversationMessageDto>?>
{
    private readonly IMarketplaceDbContext _dbContext;
    private readonly ICurrentUserService _currentUserService;

    public GetConversationMessagesQueryHandler(IMarketplaceDbContext dbContext, ICurrentUserService currentUserService)
    {
        _dbContext = dbContext;
        _currentUserService = currentUserService;
    }

    public async Task<IReadOnlyList<ConversationMessageDto>?> Handle(GetConversationMessagesQuery request, CancellationToken cancellationToken)
    {
        if (!Guid.TryParse(_currentUserService.UserId, out var userId))
        {
            throw new UnauthorizedAccessException("Kullanici bilgisi bulunamadi.");
        }

        var conversation = await _dbContext.Conversations
            .AsNoTracking()
            .FirstOrDefaultAsync(entity => entity.Id == request.ConversationId && !entity.IsDeleted, cancellationToken);

        if (conversation is null || (conversation.BuyerId != userId && conversation.ArtisanId != userId))
        {
            return null;
        }

        return await _dbContext.ConversationMessages
            .AsNoTracking()
            .Where(message => message.ConversationId == request.ConversationId && !message.IsDeleted)
            .OrderBy(message => message.SentAt)
            .Select(message => new ConversationMessageDto
            {
                Id = message.Id,
                SenderId = message.SenderId,
                SenderRole = message.SenderRole,
                Content = message.Content,
                SentAt = message.SentAt
            })
            .ToListAsync(cancellationToken);
    }
}

public sealed class GetMyAgreementsQueryHandler : IRequestHandler<GetMyAgreementsQuery, IReadOnlyList<AgreementDto>>
{
    private readonly IMarketplaceDbContext _dbContext;
    private readonly ICurrentUserService _currentUserService;

    public GetMyAgreementsQueryHandler(IMarketplaceDbContext dbContext, ICurrentUserService currentUserService)
    {
        _dbContext = dbContext;
        _currentUserService = currentUserService;
    }

    public async Task<IReadOnlyList<AgreementDto>> Handle(GetMyAgreementsQuery request, CancellationToken cancellationToken)
    {
        if (!Guid.TryParse(_currentUserService.UserId, out var userId))
        {
            return Array.Empty<AgreementDto>();
        }

        return await _dbContext.Offers
            .AsNoTracking()
            .Where(offer => !offer.IsDeleted
                && offer.Conversation != null
                && !offer.Conversation.IsDeleted
                && (offer.Conversation.BuyerId == userId || offer.Conversation.ArtisanId == userId))
            .OrderByDescending(offer => offer.UpdatedAt ?? offer.CreatedAt)
            .Select(offer => new AgreementDto
            {
                Id = offer.Id,
                ConversationId = offer.ConversationId,
                ProductId = offer.Conversation!.ProductId,
                ProductName = offer.Conversation.Product != null ? offer.Conversation.Product.Name : string.Empty,
                ProductSlug = offer.Conversation.Product != null ? offer.Conversation.Product.Slug : string.Empty,
                CounterpartyName = offer.Conversation.BuyerId == userId
                    ? (offer.Conversation.ArtisanProfile != null ? offer.Conversation.ArtisanProfile.DisplayName : string.Empty)
                    : (offer.Conversation.Buyer != null ? offer.Conversation.Buyer.FullName : string.Empty),
                ProposedPrice = offer.ProposedPrice,
                EstimatedDeliveryDays = offer.EstimatedDeliveryDays,
                ProductDetails = offer.ProductDetails,
                Status = offer.Status,
                Stage = offer.Stage,
                FinalProductNote = offer.FinalProductNote,
                FinalProductImageUrl = offer.FinalProductImageUrl,
                ShippingTrackingInfo = offer.ShippingTrackingInfo,
                UpdatedAt = offer.UpdatedAt ?? offer.CreatedAt
            })
            .ToListAsync(cancellationToken);
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
            .Include(entity => entity.Buyer)
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
                BuyerDisplayName = conversation.Buyer?.FullName ?? string.Empty,
                ArtisanId = conversation.ArtisanId,
                ArtisanProfileId = conversation.ArtisanProfileId,
                ArtisanDisplayName = conversation.ArtisanProfile?.DisplayName ?? string.Empty,
                Type = conversation.Type,
                LastMessage = lastMessage?.Content ?? lastMessage?.MessageText,
                LastMessageAt = lastMessage?.SentAt ?? conversation.LastMessageAt,
                ActiveOffer = activeOffer is null
                    ? null
                    : new OfferSummaryDto
                    {
                        Id = activeOffer.Id,
                        ProposedPrice = activeOffer.ProposedPrice,
                        EstimatedDeliveryDays = activeOffer.EstimatedDeliveryDays,
                        ProductDetails = activeOffer.ProductDetails,
                        Status = activeOffer.Status,
                        Stage = activeOffer.Stage,
                        FinalProductNote = activeOffer.FinalProductNote,
                        FinalProductImageUrl = activeOffer.FinalProductImageUrl,
                        ShippingTrackingInfo = activeOffer.ShippingTrackingInfo
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
