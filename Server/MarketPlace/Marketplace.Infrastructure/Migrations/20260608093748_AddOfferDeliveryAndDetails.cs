using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Marketplace.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddOfferDeliveryAndDetails : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Mevcut teklifler yeni zorunlu alanlar (teslim suresi ve urun detaylari)
            // olmadan olusturuldugu icin yeni veri yapisiyla uyumsuz; once temizlenir.
            migrationBuilder.Sql("DELETE FROM Offers;");

            migrationBuilder.AddColumn<int>(
                name: "EstimatedDeliveryDays",
                table: "Offers",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "ProductDetails",
                table: "Offers",
                type: "nvarchar(2000)",
                maxLength: 2000,
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EstimatedDeliveryDays",
                table: "Offers");

            migrationBuilder.DropColumn(
                name: "ProductDetails",
                table: "Offers");
        }
    }
}
