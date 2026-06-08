using MediatR;

namespace Marketplace.Application.Features.Conversations;

public sealed record SendMessageCommand(SendMessageDto Message) : IRequest<Guid>;
public sealed record MakeOfferCommand(MakeOfferDto Offer) : IRequest<Guid>;
public sealed record RespondToOfferCommand(Guid Id, RespondToOfferDto Offer) : IRequest<bool>;
public sealed record SubmitFinalProductCommand(Guid OfferId, SubmitFinalProductDto FinalProduct) : IRequest<bool>;
public sealed record ApproveFinalProductCommand(Guid OfferId) : IRequest<bool>;
public sealed record RequestRevisionCommand(Guid OfferId) : IRequest<bool>;
public sealed record MarkShippedCommand(Guid OfferId, MarkShippedDto Shipping) : IRequest<bool>;
public sealed record MarkDeliveredCommand(Guid OfferId) : IRequest<bool>;
public sealed record GetMyConversationsQuery : IRequest<IReadOnlyList<ConversationListDto>>;
public sealed record GetConversationMessagesQuery(Guid ConversationId) : IRequest<IReadOnlyList<ConversationMessageDto>?>;
public sealed record GetMyAgreementsQuery : IRequest<IReadOnlyList<AgreementDto>>;
