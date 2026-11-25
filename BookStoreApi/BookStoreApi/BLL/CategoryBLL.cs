using BookStoreApi.DAL;
using static BookStoreApi.Models.Categories;

namespace BookStoreApi.BLL
{
    public class CategoryBLL
    {
        private readonly CategoryDAL _categoryDAL;

        public CategoryBLL(CategoryDAL categoryDAL)
        {
            _categoryDAL = categoryDAL;
        }

        // Lấy danh sách danh mục
        public async Task<List<Category>> GetAllAsync()
        {
            return await _categoryDAL.GetAllAsync();
        }

        // Lấy danh mục theo ID
        public async Task<Category?> GetByIdAsync(int id)
        {
            if (id <= 0)
                throw new ArgumentException("ID danh mục không hợp lệ");

            return await _categoryDAL.GetByIdAsync(id);
        }

        // Thêm danh mục
        public async Task<Category> CreateAsync(
            string categoryName,
            string? description)
        {
            // Kiểm tra tên
            if (string.IsNullOrWhiteSpace(categoryName))
                throw new ArgumentException(
                    "Tên danh mục không được để trống");

            categoryName = categoryName.Trim();

            if (categoryName.Length > 100)
                throw new ArgumentException(
                    "Tên danh mục không được vượt quá 100 ký tự");

            if (description?.Length > 500)
                throw new ArgumentException(
                    "Mô tả không được vượt quá 500 ký tự");

            // Kiểm tra trùng tên
            bool isExists = await _categoryDAL
                .IsNameExistsAsync(categoryName);

            if (isExists)
                throw new InvalidOperationException(
                    "Tên danh mục đã tồn tại");

            // Tạo Entity
            Category category = new Category
            {
                CategoryName = categoryName,
                Description = description?.Trim(),
                IsActive = true
            };

            return await _categoryDAL.AddAsync(category);
        }

        // Cập nhật danh mục
        public async Task<Category> UpdateAsync(
            int id,
            string categoryName,
            string? description,
            bool isActive)
        {
            if (id <= 0)
                throw new ArgumentException("ID danh mục không hợp lệ");

            if (string.IsNullOrWhiteSpace(categoryName))
                throw new ArgumentException(
                    "Tên danh mục không được để trống");

            categoryName = categoryName.Trim();

            if (categoryName.Length > 100)
                throw new ArgumentException(
                    "Tên danh mục không được vượt quá 100 ký tự");

            if (description?.Length > 500)
                throw new ArgumentException(
                    "Mô tả không được vượt quá 500 ký tự");

            // Kiểm tra danh mục tồn tại
            Category? category = await _categoryDAL.GetByIdAsync(id);

            if (category == null)
                throw new KeyNotFoundException(
                    "Không tìm thấy danh mục");

            // Kiểm tra trùng tên, loại trừ chính danh mục đang sửa
            bool isExists = await _categoryDAL
                .IsNameExistsAsync(categoryName, id);

            if (isExists)
                throw new InvalidOperationException(
                    "Tên danh mục đã tồn tại");

            // Cập nhật dữ liệu
            category.CategoryName = categoryName;
            category.Description = description?.Trim();
            category.IsActive = isActive;

            return await _categoryDAL.UpdateAsync(category);
        }

        // Xóa danh mục
        public async Task<bool> DeleteAsync(int id)
        {
            if (id <= 0)
                throw new ArgumentException("ID danh mục không hợp lệ");

            // Kiểm tra danh mục tồn tại
            Category? category = await _categoryDAL.GetByIdAsync(id);

            if (category == null)
                throw new KeyNotFoundException(
                    "Không tìm thấy danh mục");

            // Không cho xóa nếu đang có sách thuộc danh mục
            bool hasBooks = await _categoryDAL.HasBooksAsync(id);

            if (hasBooks)
                throw new InvalidOperationException(
                    "Không thể xóa danh mục đang chứa sách");

            return await _categoryDAL.DeleteAsync(category);
        }
    }
}
