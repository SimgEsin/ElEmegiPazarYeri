using Marketplace.Domain.Enums;

namespace Marketplace.Domain.OrderWorkflow;

// STATE (davranissal) tasarim kalibi.
// Siparisin her durumu ayri bir sinifla temsil edilir ve gecis kurallari
// (hangi durumdan hangisine gidilebilecegi) her durumun KENDI icinde tanimlanir.
// Boylece dagilmis "if (status == ...)" kontrolleri yerine, davranis duruma gore
// polimorfik olarak calisir; gecersiz gecisler kaynaginda engellenir.
public abstract class OrderState
{
    public abstract OrderStatus Status { get; }

    // Siparisi bir sonraki asamaya ilerletir. Gecersizse hata firlatir.
    public abstract OrderState Next();

    // Siparisi iptal etmeye calisir. Bazi durumlarda izin verilmez.
    public abstract OrderState Cancel();
}

public sealed class PendingState : OrderState
{
    public override OrderStatus Status => OrderStatus.Pending;
    public override OrderState Next() => new ConfirmedState();
    public override OrderState Cancel() => new CancelledState();
}

public sealed class ConfirmedState : OrderState
{
    public override OrderStatus Status => OrderStatus.Confirmed;
    public override OrderState Next() => new PreparingState();
    public override OrderState Cancel() => new CancelledState();
}

public sealed class PreparingState : OrderState
{
    public override OrderStatus Status => OrderStatus.Preparing;
    public override OrderState Next() => new ShippedState();
    public override OrderState Cancel() => new CancelledState();
}

public sealed class ShippedState : OrderState
{
    public override OrderStatus Status => OrderStatus.Shipped;
    public override OrderState Next() => new DeliveredState();

    // Kargolanmis siparis artik iptal edilemez.
    public override OrderState Cancel()
        => throw new InvalidOperationException("Kargolanmis siparis iptal edilemez.");
}

public sealed class DeliveredState : OrderState
{
    public override OrderStatus Status => OrderStatus.Delivered;

    // Teslim edilmis siparis son durumdur; ileri tasinamaz.
    public override OrderState Next()
        => throw new InvalidOperationException("Siparis zaten teslim edildi.");

    public override OrderState Cancel()
        => throw new InvalidOperationException("Teslim edilmis siparis iptal edilemez.");
}

public sealed class CancelledState : OrderState
{
    public override OrderStatus Status => OrderStatus.Cancelled;

    public override OrderState Next()
        => throw new InvalidOperationException("Iptal edilmis siparis islenemez.");

    public override OrderState Cancel()
        => throw new InvalidOperationException("Siparis zaten iptal edilmis.");
}
