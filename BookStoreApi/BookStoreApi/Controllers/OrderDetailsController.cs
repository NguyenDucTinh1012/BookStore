using BookStoreApi.BLL;
using BookStoreApi.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BookStoreApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderDetailsController : ControllerBase
    {
        private readonly OrderDetailBLL _orderDetailBLL;

        public OrderDetailsController(OrderDetailBLL orderDetailBLL)
        {
            _orderDetailBLL = orderDetailBLL;
        }

        // =========================================
        // 1. GET: api/orderdetails
        // Lấy tất cả chi tiết đơn hàng
        // =========================================
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var details = await _orderDetailBLL.GetAllAsync();

            var result = details.Select(MapToResponse);

            return Ok(result);
        }

        // =========================================
        // 2. GET: api/orderdetails/{id}
        // Lấy chi tiết đơn hàng theo ID
        // =========================================
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var detail = await _orderDetailBLL.GetByIdAsync(id);

                if (detail == null)
                {
                    return NotFound(new
                    {
                        message = "Không tìm thấy chi tiết đơn hàng."
                    });
                }

                return Ok(MapToResponse(detail));
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // =========================================
        // 3. GET: api/orderdetails/order/{orderId}
        // Lấy danh sách sản phẩm trong một đơn hàng
        // =========================================
        [HttpGet("order/{orderId:int}")]
        public async Task<IActionResult> GetByOrderId(int orderId)
        {
            try
            {
                var details = await _orderDetailBLL.GetByOrderIdAsync(orderId);

                var result = details.Select(MapToResponse);

                return Ok(result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        // =========================================
        // 4. GET: api/orderdetails/book/{bookId}
        // Lấy lịch sử bán của một cuốn sách
        // =========================================
        [HttpGet("book/{bookId:int}")]
        public async Task<IActionResult> GetByBookId(int bookId)
        {
            try
            {
                var details = await _orderDetailBLL.GetByBookIdAsync(bookId);

                var result = details.Select(MapToResponse);

                return Ok(result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        // =========================================
        // Mapping Entity sang Response
        // =========================================
        private static object MapToResponse(OrderDetail detail)
        {
            return new
            {
                OrderDetailId = detail.OrderDetailId,

                OrderId = detail.OrderId,

                BookId = detail.BookId,

                BookTitle = detail.Book?.Title,

                Author = detail.Book?.Author,

                Quantity = detail.Quantity,

                UnitPrice = detail.UnitPrice,

                SubTotal = detail.Quantity * detail.UnitPrice,

                OrderDate = detail.Order?.OrderDate,

                ReceiverName = detail.Order?.ReceiverName,

                OrderStatus = detail.Order?.Status
            };
        }
    }
}
