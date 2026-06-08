namespace Marketplace.Domain.Shipping;

// FACADE (yapisal) tasarim kalibi.
// Kargo alt sistemini (Factory + Decorator + ucret hesaplama) TEK ve BASIT bir arayuz
// arkasina gizler. Cagiran kod; hangi somut hesaplayicinin uretildigini, decorator'in
// nasil sarildigini veya hesaplamanin nasil yapildigini bilmek zorunda kalmaz.
// Karmasik alt sistemle olan etkilesim tek bir metoda indirgenir.
public sealed class ShippingService
{
    // Tek giris noktasi: firma adi + sepet tutari + sigorta tercihi ver, sonucu al.
    public decimal GetShippingFee(string companyName, decimal orderSubtotal, bool insured = false)
    {
        // 1) Factory ile dogru kargo hesaplayicisini uret.
        ShippingFeeCalculator calculator = ShippingFeeCalculatorFactory.Create(companyName);

        // 2) Sigorta isteniyorsa Decorator ile sar.
        if (insured)
        {
            calculator = new InsuredShippingDecorator(calculator);
        }

        // 3) Ucreti hesapla ve don.
        return calculator.CalculateFee(orderSubtotal);
    }
}
