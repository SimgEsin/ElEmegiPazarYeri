using Marketplace.Application.Features.Orders;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Marketplace.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public sealed class OrdersController : ControllerBase
{
    private readonly IMediator _mediator;

    public OrdersController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost("checkout")]
    public async Task<IActionResult> Checkout(CancellationToken cancellationToken)
    {
        var orderId = await _mediator.Send(new CheckoutCartCommand(), cancellationToken);
        return Ok(orderId);
    }

    [HttpGet("me")]
    public async Task<IActionResult> GetMyOrders(CancellationToken cancellationToken)
    {
        var orders = await _mediator.Send(new GetMyOrdersQuery(), cancellationToken);
        return Ok(orders);
    }

    [HttpPost("{id:guid}/cancellation-request")]
    public async Task<IActionResult> RequestCancellation(Guid id, [FromBody] RequestOrderCancellationDto request, CancellationToken cancellationToken)
    {
        var updated = await _mediator.Send(new RequestOrderCancellationCommand(id, request.Reason), cancellationToken);
        return updated ? NoContent() : NotFound();
    }

    [HttpGet("artisan")]
    public async Task<IActionResult> GetArtisanOrders(CancellationToken cancellationToken)
    {
        var orders = await _mediator.Send(new GetArtisanOrdersQuery(), cancellationToken);
        return Ok(orders);
    }

    [HttpPut("{id:guid}/status")]
    public async Task<IActionResult> UpdateStatus(Guid id, [FromBody] UpdateOrderStatusDto request, CancellationToken cancellationToken)
    {
        var updated = await _mediator.Send(new UpdateOrderStatusCommand(id, request.Status), cancellationToken);
        return updated ? NoContent() : NotFound();
    }
}
