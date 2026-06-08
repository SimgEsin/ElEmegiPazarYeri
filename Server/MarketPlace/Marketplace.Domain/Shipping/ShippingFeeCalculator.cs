namespace Marketplace.Domain.Shipping;

// Kargo ucreti hesaplama stratejisi icin SOYUT taban sinif.
// Tek basina ornegi olusturulamaz (abstract); her kargo firmasi bundan turetilir.
public abstract class ShippingFeeCalculator
{
    // SOYUT OZELLIK: her alt sinif kendi firma adini vermek zorunda.
    public abstract string CompanyName { get; }

    // SOYUT METOT: ucretin NASIL hesaplandigi govdesi yoktur; her alt sinif kendi kuralini yazar.
    public abstract decimal CalculateFee(decimal orderSubtotal);

    // ORTAK (paylasilan) davranis: tum firmalar icin gecerli ucretsiz kargo esigi.
    // Alt siniflar bu hazir mantigi tekrar yazmadan kullanir (kalitim + kod tekrarini onleme).
    public bool QualifiesForFreeShipping(decimal orderSubtotal) => orderSubtotal >= 1000m;
}

// Soyut metodu KENDI kuralina gore ezen (override) somut firma 1.
public sealed class YurticiKargoFeeCalculator : ShippingFeeCalculator
{
    public override string CompanyName => "Yurtici Kargo";

    public override decimal CalculateFee(decimal orderSubtotal)
        => QualifiesForFreeShipping(orderSubtotal) ? 0m : 49.90m;
}

// Soyut metodu FARKLI bir kuralla ezen (override) somut firma 2.
public sealed class ArasKargoFeeCalculator : ShippingFeeCalculator
{
    public override string CompanyName => "Aras Kargo";

    public override decimal CalculateFee(decimal orderSubtotal)
        => QualifiesForFreeShipping(orderSubtotal) ? 0m : 39.90m;
}
