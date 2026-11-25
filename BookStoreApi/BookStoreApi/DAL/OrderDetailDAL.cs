using BookStore.DAL.Data;
using BookStoreApi.Models;
using Microsoft.EntityFrameworkCore;

namespace BookStoreApi.DAL
{
    public class OrderDetailDAL
    {
        private readonly BookStoreDbContext _context;

        public OrderDetailDAL(BookStoreDbContext context)
        {
            _context = context;
        }

        // Lấy tất cả chi tiết đơn hàng
        public async Task<List<OrderDetail>> GetAllAsync()
        {
            return await _context.OrderDetails
                .Include(od => od.Book)
                .Include(od => od.Order)
                .AsNoTracking()
                .OrderByDescending(od => od.OrderId)
                .ToListAsync();
        }

        // Lấy chi tiết đơn hàng theo ID
        public async Task<OrderDetail?> GetByIdAsync(int id)
        {
            return await _context.OrderDetails
                .Include(od => od.Book)
                .Include(od => od.Order)
                .FirstOrDefaultAsync(
                    od => od.OrderDetailId == id);
        }

        // Lấy danh sách chi tiết theo mã đơn hàng
        public async Task<List<OrderDetail>> GetByOrderIdAsync(
            int orderId)
        {
            return await _context.OrderDetails
                .Include(od => od.Book)
                .AsNoTracking()
                .Where(od => od.OrderId == orderId)
                .ToListAsync();
        }

        // Lấy danh sách chi tiết theo mã sách
        public async Task<List<OrderDetail>> GetByBookIdAsync(
            int bookId)
        {
            return await _context.OrderDetails
                .Include(od => od.Order)
                .Include(od => od.Book)
                .AsNoTracking()
                .Where(od => od.BookId == bookId)
                .OrderByDescending(od => od.Order.OrderDate)
                .ToListAsync();
        }

        // Kiểm tra chi tiết đơn hàng tồn tại
        public async Task<bool> ExistsAsync(int id)
        {
            return await _context.OrderDetails
                .AnyAsync(od => od.OrderDetailId == id);
        }

        // Kiểm tra đơn hàng tồn tại
        public async Task<bool> OrderExistsAsync(int orderId)
        {
            return await _context.Orders
                .AnyAsync(o => o.OrderId == orderId);
        }

        // Kiểm tra sách tồn tại
        public async Task<bool> BookExistsAsync(int bookId)
        {
            return await _context.Books
                .AnyAsync(b => b.BookId == bookId);
        }
    }
}
