using MediatR;

namespace Marketplace.Application.Features.Conversations;

public sealed record SendMessageCommand(SendMessageDto Message) : IRequest<Guid>;
public sealed record MakeOfferCommand(MakeOfferDto Offer) : IRequest<Guid>;
public sealed record RespondToOfferCommand(Guid Id, RespondToOfferDto Offer) : IRequest<bool>;
public sealed record GetMyConversationsQuery : IRequest<IReadOnlyList<ConversationListDto>>;
public sealed record GetConversationMessagesQuery(Guid ConversationId) : IRequest<IReadOnlyList<ConversationMessageDto>?>;
