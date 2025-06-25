<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
    <h1>Shoe Store</h1>
    <div class="section">
        <h2>Giới thiệu</h2>
        <p>Dự án Shoe Store là một ứng dụng Web quản lý, mua bán các sản phẩm giày và phụ kiện, được xây dựng bằng Spring Boot, Spring Security(JWT Authentication), Spring JPA(ORM), MySQL, RESTful API, Swagger.</p>
                <div class="section">
        <h2>Cấu trúc dự án</h2>
        <pre><code>Shoe-Store/
├── BE/                         # Backend (Spring Boot)
│   ├── src/                    
│   ├── pom.xml                 # Cấu hình phiên bản dependence
│   ├── Dockerfile              # Cấu hình Docker
│   └── docker-compose.yml      # Docker Compose configuration
├── FE/                         # Frontend (React)
│   └── Shoe Store/
├── docker-compose.yml          # Docker Compose configuration
└── README.html                 # Tài liệu này</code></pre>
    </div>
    <div class="section">
        <h2>Cách chạy chương trình</h2>
        <h3>Phương pháp 1: Chạy truyền thống</h3>
        <h4>Bước 1: Clone dự án từ Github:</h4>
        <pre><code>git clone https://github.com/napersau/Shoe-Store.git</code></pre>
        <h4>Bước 2: Chạy ứng dụng</h4>
        <p>Thực hiện các bước sau:</p>
        <p><strong>Bên phía Front-end:</strong></p>
        <pre><code>cd FE/Shoe Store
npm install
npm start</code></pre>
        <p><strong>Bên phía Back-end:</strong></p>
        <pre><code>Chạy trên IDE phù hợp (IntelliJ IDEA, Eclipse, VS Code...)</code></pre>
        <h3>Phương pháp 2: Chạy với Docker (Khuyến nghị)</h3>
        <p><strong>Yêu cầu:</strong> Cài đặt Docker và Docker Compose trên máy tính</p>
        <h4>Bước 1: Clone dự án từ Github:</h4>
        <pre><code>git clone https://github.com/napersau/Shoe-Store.git
cd Shoe-Store</code></pre>  
        <h4>Bước 2: Chạy với Docker Compose:</h4>
        <h4>Build và chạy</h4>
        <pre><code>docker-compose up --build -d<pre><code>  
        <h4>Bước 3: Kiểm tra trạng thái:</h4>
        <pre><code># Xem containers đang chạy
docker-compose ps
# Xem logs
docker-compose logs -f</code></pre>     
        <h4>Các lệnh Docker hữu ích:</h4>
        <pre><code># Chạy khi đã build xong
docker-compose up -d
# Dừng ứng dụng
docker-compose down
# Restart ứng dụng
docker-compose restart
# Xem logs chi tiết
docker-compose logs -f shop-app</code></pre>
        <p><strong>Lưu ý:</strong> Với Docker, bạn không cần cài đặt JDK, MySQL hay Node.js trên máy tính. Docker sẽ tự động xử lý mọi thứ!</p>
    </div>
    <div class="section">
        <h2>Truy cập ứng dụng</h2>
        <ul>
            <li><strong>Front-end:</strong> <code>http://localhost:3000</code></li>
            <li><strong>Back-end API:</strong> <code>http://localhost:8080</code></li>
            <li><strong>Swagger API Documentation:</strong> <code>http://localhost:8080/swagger-ui.html</code></li>
            <li><strong>Database (MySQL):</strong> <code>localhost:3307</code> (username: root, password: 123456)</li>
        </ul>
    </div>
    <div>Kết quả sau khi chạy ứng dụng</div>
        <img src="https://github.com/napersau/Shoe-Store/blob/main/FE/Shoe%20Store/public/logo/1.png" alt="Ảnh Demo" style="max-width:100%; height:auto; border:1px solid #ddd; border-radius:5px; padding:5px;"> 
        <br></br>
        <img src="https://github.com/napersau/Shoe-Store/blob/main/FE/Shoe%20Store/public/logo/2.png" alt="Ảnh Demo" style="max-width:100%; height:auto; border:1px solid #ddd; border-radius:5px; padding:5px;"> 
        <br></br>
        <img src="https://github.com/napersau/Shoe-Store/blob/main/FE/Shoe%20Store/public/logo/3.png" alt="Ảnh Demo" style="max-width:100%; height:auto; border:1px solid #ddd; border-radius:5px; padding:5px;"> 
        <br></br>
        <img src="https://github.com/napersau/Shoe-Store/blob/main/FE/Shoe%20Store/public/logo/4.png" alt="Ảnh Demo" style="max-width:100%; height:auto; border:1px solid #ddd; border-radius:5px; padding:5px;"> 
        <br></br>
        <img src="https://github.com/napersau/Shoe-Store/blob/main/FE/Shoe%20Store/public/logo/5.png" alt="Ảnh Demo" style="max-width:100%; height:auto; border:1px solid #ddd; border-radius:5px; padding:5px;"> 
        <br></br>
        <img src="https://github.com/napersau/Shoe-Store/blob/main/FE/Shoe%20Store/public/logo/6.png" alt="Ảnh Demo" style="max-width:100%; height:auto; border:1px solid #ddd; border-radius:5px; padding:5px;"> 
        <br></br>
        <img src="https://github.com/napersau/Shoe-Store/blob/main/FE/Shoe%20Store/public/logo/7.png" alt="Ảnh Demo" style="max-width:100%; height:auto; border:1px solid #ddd; border-radius:5px; padding:5px;">
        <br></br>
        <img src="https://github.com/napersau/Shoe-Store/blob/main/FE/Shoe%20Store/public/logo/8.png" alt="Ảnh Demo" style="max-width:100%; height:auto; border:1px solid #ddd; border-radius:5px; padding:5px;"> 
        <br></br>
        <img src="https://github.com/napersau/Shoe-Store/blob/main/FE/Shoe%20Store/public/logo/9.png" alt="Ảnh Demo" style="max-width:100%; height:auto; border:1px solid #ddd; border-radius:5px; padding:5px;"> 
        <br></br>
        <img src="https://github.com/napersau/Shoe-Store/blob/main/FE/Shoe%20Store/public/logo/10.png" alt="Ảnh Demo" style="max-width:100%; height:auto; border:1px solid #ddd; border-radius:5px; padding:5px;">  
        <br></br>
    </div>
    <div class="section">
        <h2>Yêu cầu Phiên bản</h2> 
        <ul>
            <li><strong>JDK:</strong> Phiên bản 17 trở lên</li>
            <li><strong>MySQL:</strong> Phiên bản 8.0.37 trở lên</li>
            <li><strong>Node.js:</strong> Phiên bản 16 trở lên</li>
        </ul>
        <h3>Chạy với Docker:</h3>
        <ul>
            <li><strong>Docker:</strong> Phiên bản 20.10 trở lên</li>
            <li><strong>Docker Compose:</strong> Phiên bản 2.0 trở lên</li>
        </ul>
    </div>
</body>
</html>