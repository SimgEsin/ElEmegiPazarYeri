using Marketplace.Domain.Enums;

namespace Marketplace.Application.Common.Models;

public static class EmailTemplates
{
    public static EmailMessage OrderCreatedForBuyer(string to, string? name, string orderNo, decimal total) =>
        new()
        {
            To = to,
            ToName = name,
            Subject = $"Siparişiniz alındı — {orderNo}",
            Body = Wrap($"<p>Merhaba {name},</p>" +
                        $"<p><strong>{orderNo}</strong> numaralı siparişiniz başarıyla oluşturuldu.</p>" +
                        $"<p>Toplam tutar: <strong>{total:N2} ₺</strong></p>" +
                        "<p>Siparişiniz hazırlanmaya başlandığında sizi bilgilendireceğiz.</p>")
        };

    public static EmailMessage OrderCreatedForArtisan(string to, string? name, string orderNo) =>
        new()
        {
            To = to,
            ToName = name,
            Subject = $"Yeni siparişiniz var — {orderNo}",
            Body = Wrap($"<p>Merhaba {name},</p>" +
                        $"<p><strong>{orderNo}</strong> numaralı yeni bir sipariş aldınız.</p>" +
                        "<p>Siparişi panelinizden görüntüleyip hazırlamaya başlayabilirsiniz.</p>")
        };

    public static EmailMessage OrderStatusUpdated(string to, string? name, string orderNo, OrderStatus status) =>
        new()
        {
            To = to,
            ToName = name,
            Subject = $"Sipariş durumu güncellendi — {orderNo}",
            Body = Wrap($"<p>Merhaba {name},</p>" +
                        $"<p><strong>{orderNo}</strong> numaralı siparişinizin durumu " +
                        $"<strong>{DescribeStatus(status)}</strong> olarak güncellendi.</p>")
        };

    public static EmailMessage OrderCancellationRequested(string to, string? name, string orderNo, string reason) =>
        new()
        {
            To = to,
            ToName = name,
            Subject = $"İptal talebi alındı — {orderNo}",
            Body = Wrap($"<p>Merhaba {name},</p>" +
                        $"<p><strong>{orderNo}</strong> numaralı siparişiniz için bir iptal talebi oluşturuldu.</p>" +
                        $"<p>İptal nedeni: <em>{reason}</em></p>")
        };

    public static EmailMessage WelcomeRegistration(string to, string? name) =>
        new()
        {
            To = to,
            ToName = name,
            Subject = "El Emeği Pazar Yeri'ne hoş geldiniz",
            Body = Wrap($"<p>Merhaba {name},</p>" +
                        "<p>Kaydınız başarıyla oluşturuldu. Aramıza hoş geldiniz!</p>" +
                        "<p>Keyifli alışverişler dileriz.</p>")
        };

    public static EmailMessage WorkshopApplicationReceived(string to, string? name) =>
        new()
        {
            To = to,
            ToName = name,
            Subject = "Atölye başvurunuz alındı",
            Body = Wrap($"<p>Merhaba {name},</p>" +
                        "<p>Atölye başvurunuz başarıyla alındı. En kısa sürede değerlendirip sizinle iletişime geçeceğiz.</p>")
        };

    private static string DescribeStatus(OrderStatus status) => status switch
    {
        OrderStatus.Pending => "beklemede",
        OrderStatus.Confirmed => "onaylandı",
        OrderStatus.Preparing => "hazırlanıyor",
        OrderStatus.Shipped => "kargoya verildi",
        OrderStatus.Delivered => "teslim edildi",
        OrderStatus.Cancelled => "iptal edildi",
        _ => status.ToString()
    };

    private static string Wrap(string content) =>
        "<div style=\"font-family:Arial,sans-serif;font-size:14px;color:#333;line-height:1.6\">" +
        content +
        "<hr style=\"border:none;border-top:1px solid #eee;margin:16px 0\"/>" +
        "<p style=\"font-size:12px;color:#999\">El Emeği Pazar Yeri</p>" +
        "</div>";
}
