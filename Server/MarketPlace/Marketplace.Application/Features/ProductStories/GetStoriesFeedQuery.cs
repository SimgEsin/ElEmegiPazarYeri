using MediatR;

namespace Marketplace.Application.Features.ProductStories;

public sealed record GetStoriesFeedQuery : IRequest<IReadOnlyList<StoryFeedDto>>;
