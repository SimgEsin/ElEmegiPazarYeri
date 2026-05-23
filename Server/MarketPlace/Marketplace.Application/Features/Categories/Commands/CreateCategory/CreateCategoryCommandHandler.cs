using MediatR;
using Marketplace.Application.Common.Interfaces;
using Marketplace.Domain.Entities;

namespace Marketplace.Application.Features.Categories.Commands.CreateCategory;

public sealed class CreateCategoryCommandHandler : IRequestHandler<CreateCategoryCommand, Guid>
{
    private readonly IMarketplaceDbContext _dbContext;

    public CreateCategoryCommandHandler(IMarketplaceDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<Guid> Handle(CreateCategoryCommand request, CancellationToken cancellationToken)
    {
        var dto = request.Category;

        var category = new Category
        {
            Slug = dto.Slug,
            Name = dto.Name,
            Description = dto.Description,
            Mood = dto.Mood,
            ImageUrl = dto.ImageUrl
        };

        await _dbContext.Categories.AddAsync(category, cancellationToken);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return category.Id;
    }
}
