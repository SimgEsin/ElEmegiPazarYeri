using MediatR;

namespace Marketplace.Application.Features.Admin;

public sealed record GetAdminAnalyticsQuery : IRequest<AdminAnalyticsDto>;
