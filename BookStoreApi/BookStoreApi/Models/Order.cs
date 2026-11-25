using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace BookStoreApi.Models
{
    [Table("Orders")]
    public class Order
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int OrderId { get; set; }

        // Người dùng đặt hàng
        [Required]
        [StringLength(450)]
        public string UserId { get; set; } = string.Empty;

        // Thông tin người nhận
        [Required]
        [StringLength(150)]
        public string ReceiverName { get; set; } = string.Empty;

        [Required]
        [StringLength(15)]
        public string Phone { get; set; } = string.Empty;

        [Required]
        [StringLength(300)]
        public string Address { get; set; } = string.Empty;

        // Thời gian đặt hàng
        public DateTime OrderDate { get; set; }

        // Tổng tiền đơn hàng
        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalAmount { get; set; }

        // 0: Pending
        // 1: Confirmed
        // 2: Shipping
        // 3: Completed
        // 4: Cancelled
        public int Status { get; set; } = 0;

        // Quan hệ 1 - N với OrderDetail
        public ICollection<OrderDetail> OrderDetails { get; set; }
            = new List<OrderDetail>();
    }
}
