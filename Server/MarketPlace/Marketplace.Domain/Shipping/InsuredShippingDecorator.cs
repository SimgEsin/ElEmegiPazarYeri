namespace Marketplace.Domain.Shipping;

// DECORATOR (yapisal) tasarim kalibi.
// Mevcut bir ShippingFeeCalculator'i SARMALAYIP, onun kodunu degistirmeden uzerine
// yeni bir davranis (sigorta/kasko bedeli) ekler. Decorator'in kendisi de ayni soyut
// tipten (ShippingFeeCalculator) turedigi icin, sarmaladigi nesnenin yerine seffafca
// kullanilabilir ve istenirse ust uste birden cok decorator zincirlenebilir.
public sealed class InsuredShippingDecorator : ShippingFeeCalculator
{
    private readonly ShippingFeeCalculator _inner;   // sarmalanan asil bilesen
    private readonly decimal _insuranceFee;

    public InsuredShippingDecorator(ShippingFeeCalculator inner, decimal insuranceFee = 25m)
    {
        _inner = inner;
        _insuranceFee = insuranceFee;
    }

    // Sarmalanan firmanin adini koruyup uzerine etiket ekler.
    public override string CompanyName => $"{_inner.CompanyName} (Sigortali)";

    // Once sarmalanan hesaplayicinin ucretini alir, sonra sigorta bedelini ekler.
    public override decimal CalculateFee(decimal orderSubtotal)
        => _inner.CalculateFee(orderSubtotal) + _insuranceFee;
}
