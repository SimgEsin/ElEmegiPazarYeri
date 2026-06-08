using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Marketplace.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddAgreementStageAndDelivery : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "FinalProductImageUrl",
                table: "Offers",
                type: "nvarchar(1000)",
                maxLength: 1000,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FinalProductNote",
                table: "Offers",
                type: "nvarchar(2000)",
                maxLength: 2000,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ShippingTrackingInfo",
                table: "Offers",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Stage",
                table: "Offers",
                type: "int",
                nullable: false,
                defaultValue: 0);

            // Stage alani eklenmeden once kabul edilmis teklifler (Status = Accepted)
            // yeni surec alaniyla tutarsiz kalir; bunlari uretim asamasina (InProduction) tasiriz.
            migrationBuilder.Sql("UPDATE Offers SET Stage = 1 WHERE Status = 1 AND Stage = 0;");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FinalProductImageUrl",
                table: "Offers");

            migrationBuilder.DropColumn(
                name: "FinalProductNote",
                table: "Offers");

            migrationBuilder.DropColumn(
                name: "ShippingTrackingInfo",
                table: "Offers");

            migrationBuilder.DropColumn(
                name: "Stage",
                table: "Offers");
        }
    }
}
