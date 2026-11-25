using BookStoreApi.DAL;
using BookStoreApi.Models;

namespace BookStoreApi.BLL
{
    public class OrderDetailBLL
    {
        private readonly OrderDetailDAL _orderDetailDAL;

        public OrderDetailBLL(OrderDetailDAL orderDetailDAL)
        {
            _orderDetailDAL = orderDetailDAL;
        }

        // Lấy tất cả chi tiết đơn hàng
        public async Task<List<OrderDetail>> GetAllAsync()
        {
            return await _orderDetailDAL.GetAllAsync();
        }

        // Lấy chi tiết đơn hàng theo ID
        public async Task<OrderDetail?> GetByIdAsync(int id)
        {
            if (id <= 0)
                throw new ArgumentException(
                    "ID chi tiết đơn hàng không hợp lệ");

            return await _orderDetailDAL.GetByIdAsync(id);
        }

        // Lấy chi tiết theo mã đơn hàng
        public async Task<List<OrderDetail>> GetByOrderIdAsync(
            int orderId)
        {
            if (orderId <= 0)
                throw new ArgumentException(
                    "ID đơn hàng không hợp lệ");

            // Kiểm tra đơn hàng tồn tại
            bool orderExists =
                await _orderDetailDAL.OrderExistsAsync(orderId);

            if (!orderExists)
                throw new KeyNotFoundException(
                    "Không tìm thấy đơn hàng");

            return await _orderDetailDAL.GetByOrderIdAsync(orderId);
        }

        // Lấy chi tiết theo mã sách
        public async Task<List<OrderDetail>> GetByBookIdAsync(
            int bookId)
        {
            if (bookId <= 0)
                throw new ArgumentException(
                    "ID sách không hợp lệ");

            // Kiểm tra sách tồn tại
            bool bookExists =
                await _orderDetailDAL.BookExistsAsync(bookId);

            if (!bookExists)
                throw new KeyNotFoundException(
                    "Không tìm thấy sách");

            return await _orderDetailDAL.GetByBookIdAsync(bookId);
        }

        // Kiểm tra chi tiết đơn hàng tồn tại
        public async Task<bool> ExistsAsync(int id)
        {
            if (id <= 0)
                throw new ArgumentException(
                    "ID chi tiết đơn hàng không hợp lệ");

            return await _orderDetailDAL.ExistsAsync(id);
        }
    }
}
