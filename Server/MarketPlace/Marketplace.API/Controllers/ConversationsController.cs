using Marketplace.Application.Features.Conversations;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Marketplace.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public sealed class ConversationsController : ControllerBase
{
    private readonly IMediator _mediator;

    public ConversationsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost("messages")]
    public async Task<IActionResult> SendMessage([FromBody] SendMessageCommand command, CancellationToken cancellationToken)
    {
        var conversationId = await _mediator.Send(command, cancellationToken);
        return Ok(conversationId);
    }

    [HttpPost("offers")]
    public async Task<IActionResult> MakeOffer([FromBody] MakeOfferCommand command, CancellationToken cancellationToken)
    {
        var offerId = await _mediator.Send(command, cancellationToken);
        return Ok(offerId);
    }

    [HttpPut("offers/{id:guid}/respond")]
    public async Task<IActionResult> RespondToOffer(Guid id, [FromBody] RespondToOfferDto offer, CancellationToken cancellationToken)
    {
        var updated = await _mediator.Send(new RespondToOfferCommand(id, offer), cancellationToken);
        return updated ? NoContent() : NotFound();
    }

    [HttpGet]
    public async Task<IActionResult> GetMyConversations(CancellationToken cancellationToken)
    {
        var conversations = await _mediator.Send(new GetMyConversationsQuery(), cancellationToken);
        return Ok(conversations);
    }

    [HttpGet("{id:guid}/messages")]
    public async Task<IActionResult> GetMessages(Guid id, CancellationToken cancellationToken)
    {
        var messages = await _mediator.Send(new GetConversationMessagesQuery(id), cancellationToken);
        return messages is null ? NotFound() : Ok(messages);
    }
}
