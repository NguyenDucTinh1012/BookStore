using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace BookStoreApi.Models
{
    [Table("OrderDetails")]
    public class OrderDetail
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int OrderDetailId { get; set; }

        // Khóa ngoại đến Orders
        public int OrderId { get; set; }

        // Khóa ngoại đến Books
        public int BookId { get; set; }

        // Số lượng sách đặt mua
        public int Quantity { get; set; }

        // Đơn giá tại thời điểm đặt hàng
        [Column(TypeName = "decimal(18,2)")]
        public decimal UnitPrice { get; set; }

        // Quan hệ N - 1 với Order
        [ForeignKey(nameof(OrderId))]
        public Order? Order { get; set; }

        // Quan hệ N - 1 với Book
        [ForeignKey(nameof(BookId))]
        public Book? Book { get; set; }
    }
}
