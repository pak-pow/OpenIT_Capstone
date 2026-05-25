using System.ComponentModel.DataAnnotations;

namespace Kaagapay.Api.Dtos;

public class BarangayDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
}

public class BarangayCreateDto
{
    [Required]
    public string Name { get; set; } = string.Empty;
}

public class BarangayUpdateDto
{
    [Required]
    public string Name { get; set; } = string.Empty;
}
