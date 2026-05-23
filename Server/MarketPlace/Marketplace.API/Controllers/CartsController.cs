using Marketplace.Application.Features.Carts;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Marketplace.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public sealed class CartsController : ControllerBase
{
    private readonly IMediator _mediator;

    public CartsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("me")]
    public async Task<IActionResult> GetMyCart(CancellationToken cancellationToken)
    {
        var cart = await _mediator.Send(new GetMyCartQuery(), cancellationToken);
        return Ok(cart);
    }

    [HttpPost("items")]
    public async Task<IActionResult> AddToCart([FromBody] AddToCartCommand command, CancellationToken cancellationToken)
    {
        var cartItemId = await _mediator.Send(command, cancellationToken);
        return Ok(cartItemId);
    }

    [HttpDelete("items/{itemId:guid}")]
    public async Task<IActionResult> RemoveFromCart(Guid itemId, CancellationToken cancellationToken)
    {
        var removed = await _mediator.Send(new RemoveFromCartCommand(itemId), cancellationToken);
        return removed ? NoContent() : NotFound();
    }
}
