namespace Marketplace.Domain.Shipping;

// FACTORY (Simple Factory / Factory Method) tasarim kalibi.
// Amac: dogru ShippingFeeCalculator alt sinifinin olusturulma kararini TEK bir yerde toplamak.
// Cagiran taraf somut sinif adlarini (YurticiKargoFeeCalculator vb.) bilmez; sadece firma adini verir,
// hangi nesnenin uretilecegine bu fabrika karar verir. Yeni bir kargo firmasi eklemek icin
// yalnizca burayi guncellemek yeterlidir (nesne uretim mantigi merkezilesir).
public static class ShippingFeeCalculatorFactory
{
    public static ShippingFeeCalculator Create(string companyName) => companyName switch
    {
        "Yurtici Kargo" => new YurticiKargoFeeCalculator(),
        "Aras Kargo" => new ArasKargoFeeCalculator(),
        _ => throw new ArgumentException($"Bilinmeyen kargo firmasi: {companyName}", nameof(companyName))
    };
}
