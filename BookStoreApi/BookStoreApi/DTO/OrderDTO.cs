using System.ComponentModel.DataAnnotations;

namespace BookStoreApi.DTO
{
    // DTO đặt hàng
    public class OrderCreateDTO
    {
        [Required(ErrorMessage = "Tên người nhận không được để trống")]
        [StringLength(150)]
        public string ReceiverName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Số điện thoại không được để trống")]
        [StringLength(15)]
        public string Phone { get; set; } = string.Empty;

        [Required(ErrorMessage = "Địa chỉ không được để trống")]
        [StringLength(300)]
        public string Address { get; set; } = string.Empty;

        [Required(ErrorMessage = "Đơn hàng phải có ít nhất một sản phẩm")]
        [MinLength(1)]
        public List<OrderItemCreateDTO> Items { get; set; }
            = new List<OrderItemCreateDTO>();
    }

    // DTO từng sản phẩm trong đơn hàng
    public class OrderItemCreateDTO
    {
        [Range(1, int.MaxValue, ErrorMessage = "Mã sách không hợp lệ")]
        public int BookId { get; set; }

        [Range(1, int.MaxValue, ErrorMessage = "Số lượng phải lớn hơn 0")]
        public int Quantity { get; set; }
    }

    // DTO cập nhật đơn hàng
    public class OrderUpdateDTO
    {
        [Range(0, 4, ErrorMessage = "Trạng thái đơn hàng không hợp lệ")]
        public int Status { get; set; }
    }

    // DTO trả về thông tin đơn hàng
    public class OrderResponseDTO
    {
        public int OrderId { get; set; }

        public string UserId { get; set; } = string.Empty;

        public string ReceiverName { get; set; } = string.Empty;

        public string Phone { get; set; } = string.Empty;

        public string Address { get; set; } = string.Empty;

        public DateTime OrderDate { get; set; }

        public decimal TotalAmount { get; set; }

        public int Status { get; set; }

        public List<OrderItemResponseDTO> Items { get; set; }
            = new List<OrderItemResponseDTO>();
    }

    // DTO chi tiết từng sản phẩm trong đơn hàng
    public class OrderItemResponseDTO
    {
        public int OrderDetailId { get; set; }

        public int BookId { get; set; }

        public string BookTitle { get; set; } = string.Empty;

        public string? ImageUrl { get; set; }

        public int Quantity { get; set; }

        public decimal UnitPrice { get; set; }

        public decimal SubTotal => Quantity * UnitPrice;
    }
}
