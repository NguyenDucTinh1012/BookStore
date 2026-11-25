using BookStore.DAL.Data;
using BookStoreApi.Models;
using Microsoft.EntityFrameworkCore;

namespace BookStoreApi.DAL
{
    public class BookDAL
    {
        private readonly BookStoreDbContext _context;

        public BookDAL(BookStoreDbContext context)
        {
            _context = context;
        }

        // Lấy tất cả sách
        public async Task<List<Book>> GetAllAsync()
        {
            return await _context.Books
                .Include(b => b.Category)
                .AsNoTracking()
                .OrderByDescending(b => b.CreatedAt)
                .ToListAsync();
        }

        // Lấy sách theo ID
        public async Task<Book?> GetByIdAsync(int id)
        {
            return await _context.Books
                .Include(b => b.Category)
                .FirstOrDefaultAsync(b => b.BookId == id);
        }

        // Tìm kiếm sách theo tên hoặc tác giả
        public async Task<List<Book>> SearchAsync(string keyword)
        {
            return await _context.Books
                .Include(b => b.Category)
                .AsNoTracking()
                .Where(b =>
                    b.Title.Contains(keyword) ||
                    b.Author.Contains(keyword))
                .OrderBy(b => b.Title)
                .ToListAsync();
        }

        // Lọc sách theo danh mục
        public async Task<List<Book>> GetByCategoryAsync(int categoryId)
        {
            return await _context.Books
                .Include(b => b.Category)
                .AsNoTracking()
                .Where(b => b.CategoryId == categoryId)
                .OrderBy(b => b.Title)
                .ToListAsync();
        }

        // Kiểm tra sách có tồn tại không
        public async Task<bool> ExistsAsync(int id)
        {
            return await _context.Books
                .AnyAsync(b => b.BookId == id);
        }

        // Kiểm tra danh mục có tồn tại không
        public async Task<bool> CategoryExistsAsync(int categoryId)
        {
            return await _context.Categories
                .AnyAsync(c => c.CategoryId == categoryId);
        }

        // Kiểm tra sách đã xuất hiện trong đơn hàng chưa
        public async Task<bool> HasOrderDetailsAsync(int bookId)
        {
            return await _context.OrderDetails
                .AnyAsync(od => od.BookId == bookId);
        }

        // Thêm sách
        public async Task<Book> AddAsync(Book book)
        {
            await _context.Books.AddAsync(book);
            await _context.SaveChangesAsync();

            return book;
        }

        // Cập nhật sách
        public async Task<Book> UpdateAsync(Book book)
        {
            _context.Books.Update(book);
            await _context.SaveChangesAsync();

            return book;
        }

        // Xóa sách
        public async Task<bool> DeleteAsync(Book book)
        {
            _context.Books.Remove(book);
            await _context.SaveChangesAsync();

            return true;
        }
    }
}
