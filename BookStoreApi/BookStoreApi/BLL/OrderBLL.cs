using BookStoreApi.DAL;
using BookStoreApi.Models;

namespace BookStoreApi.BLL
{
    public class OrderBLL
    {
        private readonly OrderDAL _orderDAL;

        public OrderBLL(OrderDAL orderDAL)
        {
            _orderDAL = orderDAL;
        }

        // Lấy tất cả đơn hàng
        public async Task<List<Order>> GetAllAsync()
        {
            return await _orderDAL.GetAllAsync();
        }

        // Lấy đơn hàng theo ID
        public async Task<Order?> GetByIdAsync(int id)
        {
            if (id <= 0)
                throw new ArgumentException(
                    "ID đơn hàng không hợp lệ");

            return await _orderDAL.GetByIdAsync(id);
        }

        // Lấy đơn hàng theo khách hàng
        public async Task<List<Order>> GetByUserIdAsync(string userId)
        {
            if (string.IsNullOrWhiteSpace(userId))
                throw new ArgumentException(
                    "UserId không được để trống");

            return await _orderDAL.GetByUserIdAsync(userId);
        }

        // Tạo đơn hàng
        public async Task<Order> CreateAsync(
            string userId,
            string receiverName,
            string phone,
            string address,
            List<OrderDetail> orderDetails)
        {
            // Kiểm tra UserId
            if (string.IsNullOrWhiteSpace(userId))
                throw new ArgumentException(
                    "Người dùng không hợp lệ");

            // Kiểm tra tên người nhận
            if (string.IsNullOrWhiteSpace(receiverName))
                throw new ArgumentException(
                    "Tên người nhận không được để trống");

            if (receiverName.Trim().Length > 150)
                throw new ArgumentException(
                    "Tên người nhận không được vượt quá 150 ký tự");

            // Kiểm tra số điện thoại
            if (string.IsNullOrWhiteSpace(phone))
                throw new ArgumentException(
                    "Số điện thoại không được để trống");

            if (phone.Trim().Length > 15)
                throw new ArgumentException(
                    "Số điện thoại không được vượt quá 15 ký tự");

            if (!System.Text.RegularExpressions.Regex.IsMatch(
                phone.Trim(), @"^[0-9]{10,15}$"))
            {
                throw new ArgumentException(
                    "Số điện thoại không hợp lệ");
            }

            // Kiểm tra địa chỉ
            if (string.IsNullOrWhiteSpace(address))
                throw new ArgumentException(
                    "Địa chỉ giao hàng không được để trống");

            if (address.Trim().Length > 300)
                throw new ArgumentException(
                    "Địa chỉ không được vượt quá 300 ký tự");

            // Kiểm tra danh sách sản phẩm
            if (orderDetails == null || !orderDetails.Any())
                throw new ArgumentException(
                    "Đơn hàng phải có ít nhất một sản phẩm");

            // Kiểm tra số lượng
            foreach (var detail in orderDetails)
            {
                if (detail.BookId <= 0)
                    throw new ArgumentException(
                        "Mã sách không hợp lệ");

                if (detail.Quantity <= 0)
                    throw new ArgumentException(
                        "Số lượng sách phải lớn hơn 0");
            }

            // Không cho một sách xuất hiện nhiều dòng
            var duplicateBook = orderDetails
                .GroupBy(d => d.BookId)
                .Any(g => g.Count() > 1);

            if (duplicateBook)
                throw new ArgumentException(
                    "Danh sách đơn hàng có sách bị trùng");

            // Tạo Entity Order
            Order order = new Order
            {
                UserId = userId,
                ReceiverName = receiverName.Trim(),
                Phone = phone.Trim(),
                Address = address.Trim(),
                OrderDetails = orderDetails
            };

            // Gọi DAL lưu đơn hàng
            return await _orderDAL.CreateAsync(
                order, orderDetails);
        }

        // Cập nhật trạng thái đơn hàng
        public async Task<Order> UpdateStatusAsync(
            int id,
            int status)
        {
            if (id <= 0)
                throw new ArgumentException(
                    "ID đơn hàng không hợp lệ");

            // Kiểm tra trạng thái
            if (status < 0 || status > 4)
                throw new ArgumentException(
                    "Trạng thái đơn hàng không hợp lệ");

            // Kiểm tra đơn hàng tồn tại
            Order? order = await _orderDAL.GetByIdAsync(id);

            if (order == null)
                throw new KeyNotFoundException(
                    "Không tìm thấy đơn hàng");

            // Không cho cập nhật đơn đã hoàn thành hoặc hủy
            if (order.Status == 3 || order.Status == 4)
                throw new InvalidOperationException(
                    "Không thể cập nhật đơn hàng đã kết thúc");

            // Cập nhật trạng thái
            return await _orderDAL.UpdateStatusAsync(
                order, status);
        }
    }
}
