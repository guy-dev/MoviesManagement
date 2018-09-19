using Microsoft.EntityFrameworkCore.Migrations;

namespace MoviesManagement.Migrations
{
    public partial class fixlala : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "dada",
                table: "Movies");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "dada",
                table: "Movies",
                nullable: true);
        }
    }
}
