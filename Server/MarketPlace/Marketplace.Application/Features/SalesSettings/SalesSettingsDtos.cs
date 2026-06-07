namespace Marketplace.Application.Features.SalesSettings;

public sealed class SalesSettingsDto
{
    public Guid Id { get; init; }
    public string CompanyTitle { get; init; } = string.Empty;
    public string TaxNumber { get; init; } = string.Empty;
    public string TaxOffice { get; init; } = string.Empty;
    public string AccountHolder { get; init; } = string.Empty;
    public string Iban { get; init; } = string.Empty;
    public string BankName { get; init; } = string.Empty;
    public string ShippingCompany { get; init; } = string.Empty;
}

public sealed class UpsertSalesSettingsDto
{
    public string CompanyTitle { get; init; } = string.Empty;
    public string TaxNumber { get; init; } = string.Empty;
    public string TaxOffice { get; init; } = string.Empty;
    public string AccountHolder { get; init; } = string.Empty;
    public string Iban { get; init; } = string.Empty;
    public string BankName { get; init; } = string.Empty;
    public string ShippingCompany { get; init; } = string.Empty;
}
