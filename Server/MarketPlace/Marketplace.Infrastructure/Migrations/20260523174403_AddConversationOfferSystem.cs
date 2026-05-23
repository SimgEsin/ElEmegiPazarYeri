using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Marketplace.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddConversationOfferSystem : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ConversationMessages_Conversations_ConversationId",
                table: "ConversationMessages");

            migrationBuilder.AddColumn<Guid>(
                name: "ArtisanProfileId",
                table: "Conversations",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Content",
                table: "ConversationMessages",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "SentAt",
                table: "ConversationMessages",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.CreateTable(
                name: "Offers",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ConversationId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ProposedPrice = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Offers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Offers_Conversations_ConversationId",
                        column: x => x.ConversationId,
                        principalTable: "Conversations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Conversations_ArtisanProfileId",
                table: "Conversations",
                column: "ArtisanProfileId");

            migrationBuilder.CreateIndex(
                name: "IX_Offers_ConversationId",
                table: "Offers",
                column: "ConversationId");

            migrationBuilder.AddForeignKey(
                name: "FK_ConversationMessages_Conversations_ConversationId",
                table: "ConversationMessages",
                column: "ConversationId",
                principalTable: "Conversations",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Conversations_ArtisanProfiles_ArtisanProfileId",
                table: "Conversations",
                column: "ArtisanProfileId",
                principalTable: "ArtisanProfiles",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ConversationMessages_Conversations_ConversationId",
                table: "ConversationMessages");

            migrationBuilder.DropForeignKey(
                name: "FK_Conversations_ArtisanProfiles_ArtisanProfileId",
                table: "Conversations");

            migrationBuilder.DropTable(
                name: "Offers");

            migrationBuilder.DropIndex(
                name: "IX_Conversations_ArtisanProfileId",
                table: "Conversations");

            migrationBuilder.DropColumn(
                name: "ArtisanProfileId",
                table: "Conversations");

            migrationBuilder.DropColumn(
                name: "Content",
                table: "ConversationMessages");

            migrationBuilder.DropColumn(
                name: "SentAt",
                table: "ConversationMessages");

            migrationBuilder.AddForeignKey(
                name: "FK_ConversationMessages_Conversations_ConversationId",
                table: "ConversationMessages",
                column: "ConversationId",
                principalTable: "Conversations",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
