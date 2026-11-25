using BookStoreApi.DAL;
using BookStoreApi.Models;

namespace BookStoreApi.BLL
{
    public class BookBLL
    {
        private readonly BookDAL _bookDAL;

        public BookBLL(BookDAL bookDAL)
        {
            _bookDAL = bookDAL;
        }

        // Lấy tất cả sách
        public async Task<List<Book>> GetAllAsync()
        {
            return await _bookDAL.GetAllAsync();
        }

        // Lấy sách theo ID
        public async Task<Book?> GetByIdAsync(int id)
        {
            if (id <= 0)
                throw new ArgumentException("ID sách không hợp lệ");

            return await _bookDAL.GetByIdAsync(id);
        }

        // Tìm kiếm sách
        public async Task<List<Book>> SearchAsync(string keyword)
        {
            if (string.IsNullOrWhiteSpace(keyword))
                return await _bookDAL.GetAllAsync();

            keyword = keyword.Trim();

            return await _bookDAL.SearchAsync(keyword);
        }

        // Lọc sách theo danh mục
        public async Task<List<Book>> GetByCategoryAsync(int categoryId)
        {
            if (categoryId <= 0)
                throw new ArgumentException("ID danh mục không hợp lệ");

            bool categoryExists =
                await _bookDAL.CategoryExistsAsync(categoryId);

            if (!categoryExists)
                throw new KeyNotFoundException(
                    "Không tìm thấy danh mục");

            return await _bookDAL.GetByCategoryAsync(categoryId);
        }

        // Thêm sách
        public async Task<Book> CreateAsync(Book book)
        {
            // Kiểm tra tên sách
            if (string.IsNullOrWhiteSpace(book.Title))
                throw new ArgumentException(
                    "Tên sách không được để trống");

            if (book.Title.Trim().Length > 200)
                throw new ArgumentException(
                    "Tên sách không được vượt quá 200 ký tự");

            // Kiểm tra tác giả
            if (string.IsNullOrWhiteSpace(book.Author))
                throw new ArgumentException(
                    "Tên tác giả không được để trống");

            if (book.Author.Trim().Length > 150)
                throw new ArgumentException(
                    "Tên tác giả không được vượt quá 150 ký tự");

            // Kiểm tra mô tả
            if (book.Description?.Length > 4000)
                throw new ArgumentException(
                    "Mô tả sách quá dài");

            // Kiểm tra giá
            if (book.Price <= 0)
                throw new ArgumentException(
                    "Giá sách phải lớn hơn 0");

            // Kiểm tra số lượng
            if (book.Stock < 0)
                throw new ArgumentException(
                    "Số lượng tồn kho không hợp lệ");

            // Kiểm tra danh mục
            if (book.CategoryId <= 0)
                throw new ArgumentException(
                    "Vui lòng chọn danh mục");

            bool categoryExists =
                await _bookDAL.CategoryExistsAsync(book.CategoryId);

            if (!categoryExists)
                throw new KeyNotFoundException(
                    "Danh mục không tồn tại");

            // Chuẩn hóa dữ liệu
            book.Title = book.Title.Trim();
            book.Author = book.Author.Trim();
            book.Description = book.Description?.Trim();
            book.ImageUrl = book.ImageUrl?.Trim();

            book.IsActive = true;

            return await _bookDAL.AddAsync(book);
        }

        // Cập nhật sách
        public async Task<Book> UpdateAsync(int id, Book book)
        {
            if (id <= 0)
                throw new ArgumentException("ID sách không hợp lệ");

            // Tìm sách cần cập nhật
            Book? existingBook = await _bookDAL.GetByIdAsync(id);

            if (existingBook == null)
                throw new KeyNotFoundException(
                    "Không tìm thấy sách");

            // Kiểm tra dữ liệu
            if (string.IsNullOrWhiteSpace(book.Title))
                throw new ArgumentException(
                    "Tên sách không được để trống");

            if (book.Title.Trim().Length > 200)
                throw new ArgumentException(
                    "Tên sách không được vượt quá 200 ký tự");

            if (string.IsNullOrWhiteSpace(book.Author))
                throw new ArgumentException(
                    "Tên tác giả không được để trống");

            if (book.Author.Trim().Length > 150)
                throw new ArgumentException(
                    "Tên tác giả không được vượt quá 150 ký tự");

            if (book.Description?.Length > 4000)
                throw new ArgumentException(
                    "Mô tả sách quá dài");

            if (book.Price <= 0)
                throw new ArgumentException(
                    "Giá sách phải lớn hơn 0");

            if (book.Stock < 0)
                throw new ArgumentException(
                    "Số lượng tồn kho không hợp lệ");

            // Kiểm tra danh mục
            bool categoryExists =
                await _bookDAL.CategoryExistsAsync(book.CategoryId);

            if (!categoryExists)
                throw new KeyNotFoundException(
                    "Danh mục không tồn tại");

            // Cập nhật thông tin
            existingBook.Title = book.Title.Trim();
            existingBook.Author = book.Author.Trim();
            existingBook.Description = book.Description?.Trim();
            existingBook.Price = book.Price;
            existingBook.Stock = book.Stock;
            existingBook.ImageUrl = book.ImageUrl?.Trim();
            existingBook.CategoryId = book.CategoryId;
            existingBook.IsActive = book.IsActive;
            existingBook.UpdatedAt = DateTime.Now;

            return await _bookDAL.UpdateAsync(existingBook);
        }

        // Xóa sách
        public async Task<bool> DeleteAsync(int id)
        {
            if (id <= 0)
                throw new ArgumentException("ID sách không hợp lệ");

            Book? book = await _bookDAL.GetByIdAsync(id);

            if (book == null)
                throw new KeyNotFoundException(
                    "Không tìm thấy sách");

            // Không cho xóa sách đã có trong đơn hàng
            bool hasOrderDetails =
                await _bookDAL.HasOrderDetailsAsync(id);

            if (hasOrderDetails)
                throw new InvalidOperationException(
                    "Không thể xóa sách đã xuất hiện trong đơn hàng");

            return await _bookDAL.DeleteAsync(book);
        }
    }
}
