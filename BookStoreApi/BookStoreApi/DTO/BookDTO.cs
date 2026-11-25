using System.ComponentModel.DataAnnotations;

namespace BookStoreApi.DTO
{
    // DTO thêm sách
    public class BookCreateDTO
    {
        [Required(ErrorMessage = "Tên sách không được để trống")]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;

        [Required(ErrorMessage = "Tên tác giả không được để trống")]
        [StringLength(150)]
        public string Author { get; set; } = string.Empty;

        public string? Description { get; set; }

        [Required]
        [Range(0.01, 999999999)]
        public decimal Price { get; set; }

        [Range(0, int.MaxValue)]
        public int Stock { get; set; }

        [StringLength(500)]
        public string? ImageUrl { get; set; }

        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "Vui lòng chọn danh mục")]
        public int CategoryId { get; set; }
    }

    // DTO cập nhật sách
    public class BookUpdateDTO
    {
        [Required(ErrorMessage = "Tên sách không được để trống")]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;

        [Required(ErrorMessage = "Tên tác giả không được để trống")]
        [StringLength(150)]
        public string Author { get; set; } = string.Empty;

        public string? Description { get; set; }

        [Range(0.01, 999999999)]
        public decimal Price { get; set; }

        [Range(0, int.MaxValue)]
        public int Stock { get; set; }

        [StringLength(500)]
        public string? ImageUrl { get; set; }

        [Range(1, int.MaxValue)]
        public int CategoryId { get; set; }

        public bool IsActive { get; set; }
    }

    // DTO hiển thị sách
    public class BookResponseDTO
    {
        public int BookId { get; set; }

        public string Title { get; set; } = string.Empty;

        public string Author { get; set; } = string.Empty;

        public string? Description { get; set; }

        public decimal Price { get; set; }

        public int Stock { get; set; }

        public string? ImageUrl { get; set; }

        public int CategoryId { get; set; }

        public string? CategoryName { get; set; }

        public bool IsActive { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime? UpdatedAt { get; set; }
    }
}
