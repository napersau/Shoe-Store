import { Box, Container, Typography, Button } from "@mui/material";
import Header from "./header_client/HeaderClient";

import banner1 from "../assets/img/banner_img_01.jpg";
import banner2 from "../assets/img/banner_img_02.jpg";
import category1 from "../assets/img/category_img_01.jpg";
import category2 from "../assets/img/category_img_02.jpg";
import category3 from "../assets/img/category_img_03.jpg";


export default function HomeClient() {
  return (
    <>
      <Header />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          bgcolor: "#f8f9fa",
          minHeight: "100vh",
          width: "100%",
        }}
      >
        {/* Start Banner Hero */}
        <div
          id="template-mo-zay-hero-carousel"
          className="carousel slide"
          data-bs-ride="carousel"
        >
          <ol className="carousel-indicators">
            <li
              data-bs-target="#template-mo-zay-hero-carousel"
              data-bs-slide-to="0"
              className="active"
            ></li>
            <li
              data-bs-target="#template-mo-zay-hero-carousel"
              data-bs-slide-to="1"
            ></li>
          </ol>
          <div className="carousel-inner">
            {/* Banner 1 */}
            <div className="carousel-item active">
              <div className="container-fluid px-0">
                <div className="row p-5 align-items-center">
                  <div className="col-md-6 tmpPadding">
                    <h1 className="h1 text-success">
                      <b>Khám Phá Thế Giới Giày</b>
                    </h1>
                    <h3 className="h2">
                      Chất lượng cao – Phong cách thời thượng – Giá cả hợp lý
                    </h3>
                    <p>
                      Sản phẩm được làm từ chất liệu cao cấp, mang đến sự êm ái và bền bỉ theo thời gian.
                    </p>
                  </div>
                  <div className="col-md-6">
                    <img className="d-block w-100 img-fluid" src={banner1} alt="Banner 1" />
                  </div>
                </div>
              </div>
            </div>
            {/* Banner 2 */}
            <div className="carousel-item">
              <div className="container-fluid px-0">
                <div className="row p-5 align-items-center">
                  <div className="col-md-6 tmpPadding">
                    <h1 className="h1 text-success">
                      <b>Phụ Kiện Chất Lượng</b>
                    </h1>
                    <h3 className="h2">Bước Đi Tự Tin Với Phụ Kiện Cao Cấp</h3>
                    <p>
                      Dây giày phong cách, miếng lót êm ái, bộ chăm sóc giày chuyên nghiệp – Tất cả để đôi giày của bạn luôn như mới!
                    </p>
                  </div>
                  <div className="col-md-6">
                    <img className="d-block w-100 img-fluid" src={banner2} alt="Banner 2" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <a
            className="carousel-control-prev text-decoration-none w-auto ps-3"
            href="#template-mo-zay-hero-carousel"
            role="button"
            data-bs-slide="prev"
          >
            <i className="fas fa-chevron-left"></i>
          </a>
          <a
            className="carousel-control-next text-decoration-none w-auto pe-3"
            href="#template-mo-zay-hero-carousel"
            role="button"
            data-bs-slide="next"
          >
            <i className="fas fa-chevron-right"></i>
          </a>
        </div>
        {/* End Banner Hero */}

        {/* Start Categories of The Month */}
        <Container sx={{ py: 5 }}>
          <Box textAlign="center" sx={{ mb: 4 }}>
            <Typography variant="h4" fontWeight="bold">
              Sản Phẩm Đa Dạng
            </Typography>
            <Typography variant="body1" color="textSecondary">
              <p class="tmpNoiDung">
                Mua sắm dễ dàng với hàng loạt sản phẩm từ nhiều danh mục khác nhau, 
                giúp bạn tìm thấy mọi thứ mình cần chỉ trong một nơi.
              </p>
            </Typography>
          </Box>
          <Box display="flex" justifyContent="space-between" flexWrap="wrap">
            {[
              { img: category1, title: "Phụ kiện" },
              { img: category2, title: "Giày" },
              { img: category3, title: "Kính" },
            ].map((category, index) => (
              <Box key={index} sx={{ p: 2, textAlign: "center" }}>
                <img
                  src={category.img}
                  alt={category.title}
                  style={{
                    width: "350px",
                    height: "350px",
                    borderRadius: "50%",
                    border: "3px solid #ddd",
                  }}
                />
                <Typography variant="h6" sx={{ mt: 2 }}>
                  {category.title}
                </Typography>
                <Button 
                  variant="contained" 
                  color="success" 
                  sx={{ mt: 1 }} 
                  onClick={() => window.location.href = "http://localhost:3000/shop"}
                >
                  Mua ngay
                </Button>
              </Box>
            ))}
          </Box>
        </Container>
        {/* End Categories of The Month */}
      </Box>
    </>
  );
}
