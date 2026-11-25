using BookStore.DAL.Data;
using BookStoreApi.Models;
using Microsoft.EntityFrameworkCore;

namespace BookStoreApi.DAL
{
    public class OrderDAL
    {
        private readonly BookStoreDbContext _context;

        public OrderDAL(BookStoreDbContext context)
        {
            _context = context;
        }

        // Lấy tất cả đơn hàng
        public async Task<List<Order>> GetAllAsync()
        {
            return await _context.Orders
                .Include(o => o.OrderDetails)
                    .ThenInclude(od => od.Book)
                .AsNoTracking()
                .OrderByDescending(o => o.OrderDate)
                .ToListAsync();
        }

        // Lấy đơn hàng theo ID
        public async Task<Order?> GetByIdAsync(int id)
        {
            return await _context.Orders
                .Include(o => o.OrderDetails)
                    .ThenInclude(od => od.Book)
                .FirstOrDefaultAsync(o => o.OrderId == id);
        }

        // Lấy danh sách đơn hàng của một khách hàng
        public async Task<List<Order>> GetByUserIdAsync(string userId)
        {
            return await _context.Orders
                .Include(o => o.OrderDetails)
                    .ThenInclude(od => od.Book)
                .AsNoTracking()
                .Where(o => o.UserId == userId)
                .OrderByDescending(o => o.OrderDate)
                .ToListAsync();
        }

        // Thêm đơn hàng và chi tiết đơn hàng
        public async Task<Order> CreateAsync(
            Order order,
            List<OrderDetail> orderDetails)
        {
            // Bắt đầu transaction
            await using var transaction =
                await _context.Database.BeginTransactionAsync(
                    System.Data.IsolationLevel.Serializable);

            try
            {
                decimal totalAmount = 0;

                // Lấy thông tin sách từ database
                foreach (var detail in orderDetails)
                {
                    var book = await _context.Books
                        .FirstOrDefaultAsync(
                            b => b.BookId == detail.BookId);

                    if (book == null)
                    {
                        throw new KeyNotFoundException(
                            $"Không tìm thấy sách có ID {detail.BookId}");
                    }

                    // Kiểm tra tồn kho
                    if (book.Stock < detail.Quantity)
                    {
                        throw new InvalidOperationException(
                            $"Sách '{book.Title}' không đủ số lượng tồn kho");
                    }

                    // Lưu giá tại thời điểm đặt hàng
                    detail.UnitPrice = book.Price;

                    // Tính thành tiền
                    decimal subTotal = book.Price * detail.Quantity;

                    totalAmount += subTotal;

                    // Trừ số lượng tồn kho
                    book.Stock -= detail.Quantity;
                }

                // Gán tổng tiền
                order.TotalAmount = totalAmount;

                // Trạng thái mặc định: Pending
                order.Status = 0;

                // Tạo đơn hàng
                await _context.Orders.AddAsync(order);

                await _context.SaveChangesAsync();

                // Gán OrderId cho các chi tiết
                foreach (var detail in orderDetails)
                {
                    detail.OrderId = order.OrderId;
                }

                // Thêm chi tiết đơn hàng
                await _context.OrderDetails.AddRangeAsync(orderDetails);

                await _context.SaveChangesAsync();

                // Hoàn tất transaction
                await transaction.CommitAsync();

                // Gắn danh sách chi tiết vào Order trả về
                order.OrderDetails = orderDetails;

                return order;
            }
            catch
            {
                // Nếu xảy ra lỗi thì rollback
                await transaction.RollbackAsync();

                throw;
            }
        }

        // Cập nhật trạng thái đơn hàng
        public async Task<Order> UpdateStatusAsync(
            Order order,
            int status)
        {
            order.Status = status;

            await _context.SaveChangesAsync();

            return order;
        }
    }
}
