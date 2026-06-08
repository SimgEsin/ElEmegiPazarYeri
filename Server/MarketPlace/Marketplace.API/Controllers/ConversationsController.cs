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

    [HttpPut("offers/{id:guid}/final-product")]
    public async Task<IActionResult> SubmitFinalProduct(Guid id, [FromBody] SubmitFinalProductDto finalProduct, CancellationToken cancellationToken)
    {
        var updated = await _mediator.Send(new SubmitFinalProductCommand(id, finalProduct), cancellationToken);
        return updated ? NoContent() : NotFound();
    }

    [HttpPut("offers/{id:guid}/approve-final")]
    public async Task<IActionResult> ApproveFinalProduct(Guid id, CancellationToken cancellationToken)
    {
        var updated = await _mediator.Send(new ApproveFinalProductCommand(id), cancellationToken);
        return updated ? NoContent() : NotFound();
    }

    [HttpPut("offers/{id:guid}/request-revision")]
    public async Task<IActionResult> RequestRevision(Guid id, CancellationToken cancellationToken)
    {
        var updated = await _mediator.Send(new RequestRevisionCommand(id), cancellationToken);
        return updated ? NoContent() : NotFound();
    }

    [HttpPut("offers/{id:guid}/ship")]
    public async Task<IActionResult> MarkShipped(Guid id, [FromBody] MarkShippedDto shipping, CancellationToken cancellationToken)
    {
        var updated = await _mediator.Send(new MarkShippedCommand(id, shipping), cancellationToken);
        return updated ? NoContent() : NotFound();
    }

    [HttpPut("offers/{id:guid}/deliver")]
    public async Task<IActionResult> MarkDelivered(Guid id, CancellationToken cancellationToken)
    {
        var updated = await _mediator.Send(new MarkDeliveredCommand(id), cancellationToken);
        return updated ? NoContent() : NotFound();
    }

    [HttpGet]
    public async Task<IActionResult> GetMyConversations(CancellationToken cancellationToken)
    {
        var conversations = await _mediator.Send(new GetMyConversationsQuery(), cancellationToken);
        return Ok(conversations);
    }

    [HttpGet("agreements")]
    public async Task<IActionResult> GetMyAgreements(CancellationToken cancellationToken)
    {
        var agreements = await _mediator.Send(new GetMyAgreementsQuery(), cancellationToken);
        return Ok(agreements);
    }

    [HttpGet("{id:guid}/messages")]
    public async Task<IActionResult> GetMessages(Guid id, CancellationToken cancellationToken)
    {
        var messages = await _mediator.Send(new GetConversationMessagesQuery(id), cancellationToken);
        return messages is null ? NotFound() : Ok(messages);
    }
}
