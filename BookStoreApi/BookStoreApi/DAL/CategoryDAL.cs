using BookStore.DAL.Data;
using Microsoft.EntityFrameworkCore;
using static BookStoreApi.Models.Categories;

namespace BookStoreApi.DAL
{
    public class CategoryDAL
    {
        private readonly BookStoreDbContext _context;

        public CategoryDAL(BookStoreDbContext context)
        {
            _context = context;
        }

        // Lấy tất cả danh mục
        public async Task<List<Category>> GetAllAsync()
        {
            return await _context.Categories
                .AsNoTracking()
                .OrderBy(c => c.CategoryId)
                .ToListAsync();
        }

        // Lấy danh mục theo ID
        public async Task<Category?> GetByIdAsync(int id)
        {
            return await _context.Categories
                .FirstOrDefaultAsync(c => c.CategoryId == id);
        }

        // Kiểm tra tên danh mục đã tồn tại chưa
        public async Task<bool> IsNameExistsAsync(
            string categoryName,
            int? excludeId = null)
        {
            return await _context.Categories.AnyAsync(c =>
                c.CategoryName == categoryName &&
                (!excludeId.HasValue || c.CategoryId != excludeId.Value));
        }

        // Kiểm tra danh mục đã có sách hay chưa
        public async Task<bool> HasBooksAsync(int categoryId)
        {
            return await _context.Books
                .AnyAsync(b => b.CategoryId == categoryId);
        }

        // Thêm danh mục
        public async Task<Category> AddAsync(Category category)
        {
            await _context.Categories.AddAsync(category);
            await _context.SaveChangesAsync();

            return category;
        }

        // Cập nhật danh mục
        public async Task<Category> UpdateAsync(Category category)
        {
            _context.Categories.Update(category);
            await _context.SaveChangesAsync();

            return category;
        }

        // Xóa danh mục
        public async Task<bool> DeleteAsync(Category category)
        {
            _context.Categories.Remove(category);
            await _context.SaveChangesAsync();

            return true;
        }
    }
}
