using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace Marketplace.Infrastructure.SignalR;

[Authorize]
public class ChatHub : Hub
{
    // Istemciden gelen mesaji, o an bagli olan TUM istemcilere gercek zamanli yayinlar.
    // Gonderenin adi JWT icindeki isim claim'inden alinir.
    public async Task SendMessage(string message)
    {
        var userName = Context.User?.Identity?.Name ?? "Bilinmeyen Kullanici";
        await Clients.All.SendAsync("ReceiveMessage", userName, message);
    }
}
