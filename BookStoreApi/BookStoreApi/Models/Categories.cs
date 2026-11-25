using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace BookStoreApi.Models
{
    public class Categories
    {
        [Table("Categories")]
        public class Category
        {
            [Key]
            [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
            public int CategoryId { get; set; }

            [Required]
            [StringLength(100)]
            public string CategoryName { get; set; } = string.Empty;

            [StringLength(500)]
            public string? Description { get; set; }

            public bool IsActive { get; set; } = true;

            public DateTime CreatedAt { get; set; } = DateTime.Now;

            // Quan hệ 1 - N với Book
            public ICollection<Book> Books { get; set; }
                = new List<Book>();
        }

    }
}
