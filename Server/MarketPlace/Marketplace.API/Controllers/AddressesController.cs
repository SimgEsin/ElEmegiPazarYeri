using Marketplace.Application.Features.Addresses.Commands.CreateAddress;
using Marketplace.Application.Features.Addresses.Commands.DeleteAddress;
using Marketplace.Application.Features.Addresses.Commands.UpdateAddress;
using Marketplace.Application.Features.Addresses.Queries.GetAddressById;
using Marketplace.Application.Features.Addresses.Queries.GetAllAddresses;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Marketplace.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public sealed class AddressesController : ControllerBase
{
    private readonly IMediator _mediator;

    public AddressesController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateAddressCommand command, CancellationToken cancellationToken)
    {
        var id = await _mediator.Send(command, cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id }, id);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
    {
        var addresses = await _mediator.Send(new GetAllAddressesQuery(), cancellationToken);
        return Ok(addresses);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
    {
        var address = await _mediator.Send(new GetAddressByIdQuery(id), cancellationToken);
        return address is null ? NotFound() : Ok(address);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateAddressDto address, CancellationToken cancellationToken)
    {
        var updated = await _mediator.Send(new UpdateAddressCommand(id, address), cancellationToken);
        return updated ? NoContent() : NotFound();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var deleted = await _mediator.Send(new DeleteAddressCommand(id), cancellationToken);
        return deleted ? NoContent() : NotFound();
    }
}
