using System.ComponentModel.DataAnnotations;

namespace BookStoreApi.DTO
{
    
        // DTO thêm danh mục
        public class CategoryCreateDTO
        {
            [Required(ErrorMessage = "Tên danh mục không được để trống")]
            [StringLength(100)]
            public string CategoryName { get; set; } = string.Empty;

            [StringLength(500)]
            public string? Description { get; set; }
        }

        // DTO cập nhật danh mục
        public class CategoryUpdateDTO
        {
            [Required(ErrorMessage = "Tên danh mục không được để trống")]
            [StringLength(100)]
            public string CategoryName { get; set; } = string.Empty;

            [StringLength(500)]
            public string? Description { get; set; }

            public bool IsActive { get; set; }
        }

        // DTO hiển thị danh mục
        public class CategoryResponseDTO
        {
            public int CategoryId { get; set; }

            public string CategoryName { get; set; } = string.Empty;

            public string? Description { get; set; }

            public bool IsActive { get; set; }

            public DateTime CreatedAt { get; set; }
        }
    }

