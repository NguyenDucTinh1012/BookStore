using BookStoreApi.BLL;
using BookStoreApi.DTO;
using BookStoreApi.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BookStoreApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BooksController : ControllerBase
    {
        private readonly BookBLL _bookBLL;

        public BooksController(BookBLL bookBLL)
        {
            _bookBLL = bookBLL;
        }

        // =========================================
        // 1. GET: api/books
        // Lấy danh sách sách
        // =========================================
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var books = await _bookBLL.GetAllAsync();

            var result = books.Select(b => new BookResponseDTO
            {
                BookId = b.BookId,
                Title = b.Title,
                Author = b.Author,
                Description = b.Description,
                Price = b.Price,
                Stock = b.Stock,
                ImageUrl = b.ImageUrl,
                CategoryId = b.CategoryId,
                CategoryName = b.Category?.CategoryName,
                IsActive = b.IsActive,
                CreatedAt = b.CreatedAt,
                UpdatedAt = b.UpdatedAt
            });

            return Ok(result);
        }

        // =========================================
        // 2. GET: api/books/{id}
        // Lấy sách theo ID
        // =========================================
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var book = await _bookBLL.GetByIdAsync(id);

                if (book == null)
                {
                    return NotFound(new
                    {
                        message = "Không tìm thấy sách."
                    });
                }

                return Ok(MapToResponse(book));
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // =========================================
        // 3. GET: api/books/search?keyword=...
        // Tìm kiếm sách theo tên hoặc tác giả
        // =========================================
        [HttpGet("search")]
        public async Task<IActionResult> Search(
            [FromQuery] string keyword)
        {
            if (string.IsNullOrWhiteSpace(keyword))
            {
                return BadRequest(new
                {
                    message = "Vui lòng nhập từ khóa tìm kiếm."
                });
            }

            var books = await _bookBLL.SearchAsync(keyword);

            var result = books.Select(MapToResponse);

            return Ok(result);
        }

        // =========================================
        // 4. GET: api/books/category/{categoryId}
        // Lọc sách theo danh mục
        // =========================================
        [HttpGet("category/{categoryId:int}")]
        public async Task<IActionResult> GetByCategory(int categoryId)
        {
            try
            {
                var books = await _bookBLL.GetByCategoryAsync(categoryId);

                var result = books.Select(MapToResponse);

                return Ok(result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // =========================================
        // 5. POST: api/books
        // Thêm sách mới
        // =========================================
        [HttpPost]
        public async Task<IActionResult> Create(
            [FromBody] BookCreateDTO dto)
        {
            try
            {
                var book = new Book
                {
                    Title = dto.Title,
                    Author = dto.Author,
                    Description = dto.Description,
                    Price = dto.Price,
                    Stock = dto.Stock,
                    ImageUrl = dto.ImageUrl,
                    CategoryId = dto.CategoryId
                };

                var result = await _bookBLL.CreateAsync(book);

                return CreatedAtAction(
                    nameof(GetById),
                    new { id = result.BookId },
                    MapToResponse(result)
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
        // 6. PUT: api/books/{id}
        // Cập nhật sách
        // =========================================
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(
            int id,
            [FromBody] BookUpdateDTO dto)
        {
            try
            {
                var book = new Book
                {
                    Title = dto.Title,
                    Author = dto.Author,
                    Description = dto.Description,
                    Price = dto.Price,
                    Stock = dto.Stock,
                    ImageUrl = dto.ImageUrl,
                    CategoryId = dto.CategoryId,
                    IsActive = dto.IsActive
                };

                var result = await _bookBLL.UpdateAsync(id, book);

                return Ok(MapToResponse(result));
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
        // 7. DELETE: api/books/{id}
        // Xóa sách
        // =========================================
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                await _bookBLL.DeleteAsync(id);

                return NoContent();
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
        private static BookResponseDTO MapToResponse(Book book)
        {
            return new BookResponseDTO
            {
                BookId = book.BookId,
                Title = book.Title,
                Author = book.Author,
                Description = book.Description,
                Price = book.Price,
                Stock = book.Stock,
                ImageUrl = book.ImageUrl,
                CategoryId = book.CategoryId,
                CategoryName = book.Category?.CategoryName,
                IsActive = book.IsActive,
                CreatedAt = book.CreatedAt,
                UpdatedAt = book.UpdatedAt
            };
        }
    }
}
