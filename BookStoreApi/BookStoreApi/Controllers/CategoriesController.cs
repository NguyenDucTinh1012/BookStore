using BookStoreApi.BLL;
using BookStoreApi.DTO;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BookStoreApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private readonly CategoryBLL _categoryBLL;

        // Constructor Injection
        public CategoriesController(CategoryBLL categoryBLL)
        {
            _categoryBLL = categoryBLL;
        }

        // =========================================
        // 1. GET: api/categories
        // Lấy danh sách tất cả danh mục
        // =========================================
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var categories = await _categoryBLL.GetAllAsync();

            var result = categories.Select(c => new CategoryResponseDTO
            {
                CategoryId = c.CategoryId,
                CategoryName = c.CategoryName,
                Description = c.Description,
                IsActive = c.IsActive,
                CreatedAt = c.CreatedAt
            });

            return Ok(result);
        }

        // =========================================
        // 2. GET: api/categories/{id}
        // Lấy danh mục theo ID
        // =========================================
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var category = await _categoryBLL.GetByIdAsync(id);

                if (category == null)
                {
                    return NotFound(new
                    {
                        message = "Không tìm thấy danh mục."
                    });
                }

                var result = new CategoryResponseDTO
                {
                    CategoryId = category.CategoryId,
                    CategoryName = category.CategoryName,
                    Description = category.Description,
                    IsActive = category.IsActive,
                    CreatedAt = category.CreatedAt
                };

                return Ok(result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // =========================================
        // 3. POST: api/categories
        // Thêm danh mục mới
        // =========================================
        [HttpPost]
        public async Task<IActionResult> Create(
            [FromBody] CategoryCreateDTO dto)
        {
            try
            {
                var category = await _categoryBLL.CreateAsync(
                    dto.CategoryName,
                    dto.Description
                );

                var result = new CategoryResponseDTO
                {
                    CategoryId = category.CategoryId,
                    CategoryName = category.CategoryName,
                    Description = category.Description,
                    IsActive = category.IsActive,
                    CreatedAt = category.CreatedAt
                };

                return CreatedAtAction(
                    nameof(GetById),
                    new { id = category.CategoryId },
                    result
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
        // 4. PUT: api/categories/{id}
        // Cập nhật danh mục
        // =========================================
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(
            int id,
            [FromBody] CategoryUpdateDTO dto)
        {
            try
            {
                var category = await _categoryBLL.UpdateAsync(
                    id,
                    dto.CategoryName,
                    dto.Description,
                    dto.IsActive
                );

                var result = new CategoryResponseDTO
                {
                    CategoryId = category.CategoryId,
                    CategoryName = category.CategoryName,
                    Description = category.Description,
                    IsActive = category.IsActive,
                    CreatedAt = category.CreatedAt
                };

                return Ok(result);
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
        // 5. DELETE: api/categories/{id}
        // Xóa danh mục
        // =========================================
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                await _categoryBLL.DeleteAsync(id);

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
    }
}
