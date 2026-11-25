
-- ==========================================
-- 1. CREATE DATABASE
-- ==========================================

CREATE DATABASE BookStoreDB;
GO

USE BookStoreDB;
GO

-- ==========================================
-- 2. TABLE CATEGORIES
-- ==========================================

CREATE TABLE Categories
(
    CategoryId INT IDENTITY(1,1) PRIMARY KEY,
    CategoryName NVARCHAR(100) NOT NULL,
    Description NVARCHAR(500),
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),

    CONSTRAINT UQ_Categories_CategoryName
        UNIQUE (CategoryName)
);
GO

-- ==========================================
-- 3. TABLE BOOKS
-- ==========================================

CREATE TABLE Books
(
    BookId INT IDENTITY(1,1) PRIMARY KEY,
    Title NVARCHAR(200) NOT NULL,
    Author NVARCHAR(150) NOT NULL,
    Description NVARCHAR(MAX),
    Price DECIMAL(18,2) NOT NULL,
    Stock INT NOT NULL DEFAULT 0,
    ImageUrl NVARCHAR(500),
    CategoryId INT NOT NULL,
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    UpdatedAt DATETIME2 NULL,

    CONSTRAINT FK_Books_Categories
        FOREIGN KEY (CategoryId)
        REFERENCES Categories(CategoryId),

    CONSTRAINT CK_Books_Price
        CHECK (Price > 0),

    CONSTRAINT CK_Books_Stock
        CHECK (Stock >= 0)
);
GO

-- ==========================================
-- 4. TABLE ORDERS
-- ==========================================

CREATE TABLE Orders
(
    OrderId INT IDENTITY(1,1) PRIMARY KEY,

    UserId NVARCHAR(450) NOT NULL,

    ReceiverName NVARCHAR(150) NOT NULL,
    Phone VARCHAR(15) NOT NULL,
    Address NVARCHAR(300) NOT NULL,

    OrderDate DATETIME2 NOT NULL DEFAULT GETDATE(),

    TotalAmount DECIMAL(18,2) NOT NULL,

    Status INT NOT NULL DEFAULT 0,

    CONSTRAINT CK_Orders_TotalAmount
        CHECK (TotalAmount >= 0),

    CONSTRAINT CK_Orders_Status
        CHECK (Status BETWEEN 0 AND 4)
);
GO

-- ==========================================
-- 5. TABLE ORDER DETAILS
-- ==========================================

CREATE TABLE OrderDetails
(
    OrderDetailId INT IDENTITY(1,1) PRIMARY KEY,

    OrderId INT NOT NULL,
    BookId INT NOT NULL,

    Quantity INT NOT NULL,
    UnitPrice DECIMAL(18,2) NOT NULL,

    CONSTRAINT FK_OrderDetails_Orders
        FOREIGN KEY (OrderId)
        REFERENCES Orders(OrderId),

    CONSTRAINT FK_OrderDetails_Books
        FOREIGN KEY (BookId)
        REFERENCES Books(BookId),

    CONSTRAINT CK_OrderDetails_Quantity
        CHECK (Quantity > 0),

    CONSTRAINT CK_OrderDetails_UnitPrice
        CHECK (UnitPrice > 0),

    CONSTRAINT UQ_OrderDetails_Order_Book
        UNIQUE (OrderId, BookId)
);
GO

-- ==========================================
-- 6. CREATE INDEX
-- ==========================================

CREATE INDEX IX_Books_CategoryId
ON Books(CategoryId);

CREATE INDEX IX_Books_Title
ON Books(Title);

CREATE INDEX IX_Orders_UserId
ON Orders(UserId);

CREATE INDEX IX_Orders_OrderDate
ON Orders(OrderDate);

CREATE INDEX IX_OrderDetails_BookId
ON OrderDetails(BookId);
GO


INSERT INTO Categories (CategoryName, Description)
VALUES
(N'Văn học', N'Sách văn học trong nước và nước ngoài'),
(N'Công nghệ thông tin', N'Sách lập trình và công nghệ'),
(N'Kinh tế', N'Sách kinh doanh và quản trị'),
(N'Kỹ năng sống', N'Sách phát triển bản thân'),
(N'Thiếu nhi', N'Sách dành cho trẻ em'),
(N'Tâm lý học', N'Sách tâm lý và hành vi con người');
GO

SELECT*FROM Categories



INSERT INTO Books
(
    Title,
    Author,
    Description,
    Price,
    Stock,
    ImageUrl,
    CategoryId
)
VALUES
(
    N'Đắc Nhân Tâm',
    N'Dale Carnegie',
    N'Nghệ thuật giao tiếp và ứng xử với mọi người.',
    85000,
    50,
    'https://placehold.co/300x400?text=Dac+Nhan+Tam',
    4
),
(
    N'Nhà Giả Kim',
    N'Paulo Coelho',
    N'Câu chuyện về hành trình theo đuổi ước mơ.',
    79000,
    40,
    'https://placehold.co/300x400?text=Nha+Gia+Kim',
    1
),
(
    N'Lập Trình C# Cơ Bản',
    N'Nguyễn Văn A',
    N'Tài liệu học lập trình C# từ cơ bản đến nâng cao.',
    150000,
    30,
    'https://placehold.co/300x400?text=CSharp',
    2
),
(
    N'Clean Code',
    N'Robert C. Martin',
    N'Nguyên tắc viết mã nguồn sạch và dễ bảo trì.',
    220000,
    25,
    'https://placehold.co/300x400?text=Clean+Code',
    2
),
(
    N'Đầu Tư Thông Minh',
    N'Benjamin Graham',
    N'Kiến thức nền tảng về đầu tư giá trị.',
    180000,
    20,
    'https://placehold.co/300x400?text=Investment',
    3
),
(
    N'Tuổi Trẻ Đáng Giá Bao Nhiêu',
    N'Rosie Nguyễn',
    N'Những bài học về học tập và phát triển bản thân.',
    95000,
    35,
    'https://placehold.co/300x400?text=Tuoi+Tre',
    4
);
GO

Select * from Books

update Books
set ImageUrl ='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTAZh_xaouppf2w4YNj47nMgycJXl38adE4MSP8RETrrg&s=10'
where BookId =1