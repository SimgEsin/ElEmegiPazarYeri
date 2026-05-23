using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace Marketplace.Infrastructure.SignalR;

[Authorize]
public class ChatHub : Hub
{
}
