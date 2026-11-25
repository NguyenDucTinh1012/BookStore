using BookStoreApi.BLL;
using BookStoreApi.DTO;
using BookStoreApi.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BookStoreApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly OrderBLL _orderBLL;

        public OrdersController(OrderBLL orderBLL)
        {
            _orderBLL = orderBLL;
        }

        // =========================================
        // 1. GET: api/orders
        // Lấy tất cả đơn hàng
        // Dành cho Admin
        // =========================================
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var orders = await _orderBLL.GetAllAsync();

            var result = orders.Select(MapToResponse);

            return Ok(result);
        }

        // =========================================
        // 2. GET: api/orders/{id}
        // Lấy đơn hàng theo ID
        // =========================================
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var order = await _orderBLL.GetByIdAsync(id);

                if (order == null)
                {
                    return NotFound(new
                    {
                        message = "Không tìm thấy đơn hàng."
                    });
                }

                return Ok(MapToResponse(order));
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // =========================================
        // 3. GET: api/orders/my-orders
        // Lịch sử đơn hàng của người dùng
        // =========================================
        [HttpGet("my-orders")]
        public async Task<IActionResult> GetMyOrders()
        {
            // Tạm thời dùng UserId giả lập để kiểm tra API.
            // Khi tích hợp Identity/JWT, lấy UserId từ Claims.
            string userId = "TEST_USER_ID";

            var orders = await _orderBLL.GetByUserIdAsync(userId);

            var result = orders.Select(MapToResponse);

            return Ok(result);
        }

        // =========================================
        // 4. POST: api/orders
        // Tạo đơn hàng mới
        // =========================================
        [HttpPost]
        public async Task<IActionResult> Create(
            [FromBody] OrderCreateDTO dto)
        {
            try
            {
                // Tạm thời dùng UserId giả lập.
                // Không nhận UserId từ frontend.
                string userId = "TEST_USER_ID";

                // Chuyển DTO thành OrderDetail Entity
                var orderDetails = dto.Items.Select(item =>
                    new OrderDetail
                    {
                        BookId = item.BookId,
                        Quantity = item.Quantity
                    }).ToList();

                var order = await _orderBLL.CreateAsync(
                    userId,
                    dto.ReceiverName,
                    dto.Phone,
                    dto.Address,
                    orderDetails
                );

                return CreatedAtAction(
                    nameof(GetById),
                    new { id = order.OrderId },
                    MapToResponse(order)
                );
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // =========================================
        // 5. PUT: api/orders/{id}/status
        // Cập nhật trạng thái đơn hàng
        // =========================================
        [HttpPut("{id:int}/status")]
        public async Task<IActionResult> UpdateStatus(
            int id,
            [FromBody] OrderUpdateDTO dto)
        {
            try
            {
                await _orderBLL.UpdateStatusAsync(id, dto.Status);

                return Ok(new
                {
                    message = "Cập nhật trạng thái đơn hàng thành công."
                });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        // =========================================
        // Hàm chuyển Entity sang Response DTO
        // =========================================
        private static OrderResponseDTO MapToResponse(Order order)
        {
            return new OrderResponseDTO
            {
                OrderId = order.OrderId,
                UserId = order.UserId,
                ReceiverName = order.ReceiverName,
                Phone = order.Phone,
                Address = order.Address,
                OrderDate = order.OrderDate,
                TotalAmount = order.TotalAmount,
                Status = order.Status,

                Items = order.OrderDetails.Select(detail =>
                    new OrderItemResponseDTO
                    {
                        OrderDetailId = detail.OrderDetailId,
                        BookId = detail.BookId,
                        BookTitle = detail.Book?.Title,
                        Quantity = detail.Quantity,
                        UnitPrice = detail.UnitPrice
                       
                    }).ToList()
            };
        }
    }
}
