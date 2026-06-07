namespace Marketplace.Domain.Entities;

public class ArtisanSalesSettings : BaseEntity
{
    public Guid UserId { get; set; }
    public string CompanyTitle { get; set; } = string.Empty;
    public string TaxNumber { get; set; } = string.Empty;
    public string TaxOffice { get; set; } = string.Empty;
    public string AccountHolder { get; set; } = string.Empty;
    public string Iban { get; set; } = string.Empty;
    public string BankName { get; set; } = string.Empty;
    public string ShippingCompany { get; set; } = string.Empty;

    public AppUser? User { get; set; }
}
