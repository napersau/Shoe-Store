import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col, Typography, Button, Image } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import banner1 from "../../assets/img/banner_img_01.jpg";
import banner2 from "../../assets/img/banner_img_02.jpg";
import category1 from "../../assets/img/category_img_01.jpg";
import category2 from "../../assets/img/category_img_02.jpg";
import category3 from "../../assets/img/category_img_03.jpg";
import freeShipping from "../../assets/img/free=shipping.png";
import service24_7 from "../../assets/img/24-7.png";
import chinhHang from "../../assets/img/bao-dam-hang-chinh-hang.jpg";
import "./styles.css";

const { Title, Text } = Typography;

export default function HomeClient() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Data cho slides
  const slides = [
    {
      id: 1,
      title: "Khám Phá Thế Giới Giày",
      subtitle: "Chất lượng cao – Phong cách thời thượng – Giá cả hợp lý",
      description: "Sản phẩm được làm từ chất liệu cao cấp, mang đến sự êm ái và bền bỉ theo thời gian.",
      image: banner1,
      buttonText: "Mua ngay"
    },
    {
      id: 2,
      title: "Phụ Kiện Chất Lượng",
      subtitle: "Bước Đi Tự Tin Với Phụ Kiện Cao Cấp",
      description: "Dây giày phong cách, miếng lót êm ái, bộ chăm sóc giày chuyên nghiệp – Tất cả để đôi giày của bạn luôn như mới!",
      image: banner2,
      buttonText: "Khám phá ngay"
    },
    {
      id: 3,
      title: "Bộ Sưu Tập Mới",
      subtitle: "Xu Hướng Thời Trang 2025",
      description: "Cập nhật những mẫu giày mới nhất, theo kịp xu hướng thời trang quốc tế với thiết kế độc đáo và chất lượng vượt trội.",
      image: banner1, // Bạn có thể thay bằng hình ảnh khác
      buttonText: "Xem bộ sưu tập"
    }
  ];

  const serviceItems = [
    { img: freeShipping, title: "Miễn phí ship" },
    { img: service24_7, title: "Phục vụ 24/7" },
    { img: chinhHang, title: "Bảo đảm chính hãng" }
  ];

  const categories = [
    { img: category1, title: "Phụ kiện" },
    { img: category2, title: "Giày" },
    { img: category3, title: "Kính" }
  ];

  // Carousel functions
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Auto-play functionality
  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="home-container" style={{margin:0}}>
      {/* Enhanced Carousel */}
      <div className="carousel-wrapper">
        {/* Carousel Content */}
        <div className="carousel-content-wrapper">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`carousel-slide ${currentSlide === index ? 'active' : ''}`}
              style={{
                transform: `translateX(${(index - currentSlide) * 100}%)`,
              }}
            >
              <Row gutter={[32, 32]} align="middle" className="slide-row">
                <Col xs={24} md={12} className="slide-text-col">
                  <div className={`slide-content ${currentSlide === index ? 'animate' : ''}`}>
                    <Title level={1} className="slide-title">
                      {slide.title}
                    </Title>
                    <Title level={3} className="slide-subtitle">
                      {slide.subtitle}
                    </Title>
                    <Text className="slide-description">
                      {slide.description}
                    </Text>
                    <Button
                      type="primary"
                      size="large"
                      className="slide-button"
                      onClick={() => navigate("/shop")}
                    >
                      {slide.buttonText}
                    </Button>
                  </div>
                </Col>
                <Col xs={24} md={12} className="slide-image-col">
                  <div className={`slide-image-wrapper ${currentSlide === index ? 'animate' : ''}`}>
                    <Image
                      src={slide.image}
                      alt={slide.title}
                      className="slide-image"
                      preview={false}
                    />
                  </div>
                </Col>
              </Row>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <Button
          type="text"
          icon={<LeftOutlined />}
          onClick={prevSlide}
          className="carousel-arrow carousel-arrow-left"
        />
        
        <Button
          type="text"
          icon={<RightOutlined />}
          onClick={nextSlide}
          className="carousel-arrow carousel-arrow-right"
        />

        {/* Dots Indicator */}
        <div className="carousel-dots">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`carousel-dot ${currentSlide === index ? 'active' : ''}`}
            />
          ))}
        </div>
      </div>

      {/* Service Section */}
      <div className="categories-container">
        <Row gutter={[16, 16]} justify="center" className="service-section">
          {serviceItems.map((item, index) => (
            <Col xs={24} sm={12} md={8} key={index} className="service-item">
              <Image
                src={item.img}
                alt={item.title}
                className="service-image"
                preview={false}
              />
              <Title level={5} className="service-title">
                {item.title}
              </Title>
            </Col>
          ))}
        </Row>

        {/* Categories Section */}
        <div className="categories-title">
          <Title level={3}>Sản Phẩm Đa Dạng</Title>
          <Text className="categories-description">
            Mua sắm dễ dàng với hàng loạt sản phẩm từ nhiều danh mục khác nhau, giúp bạn tìm thấy mọi thứ mình cần chỉ trong một nơi.
          </Text>
        </div>

        <Row gutter={[16, 16]} justify="center">
          {categories.map((category, index) => (
            <Col xs={24} sm={12} md={8} key={index} className="category-item">
              <Image
                src={category.img}
                alt={category.title}
                className="category-image"
                preview={false}
              />
              <Title level={5} className="category-title">
                {category.title}
              </Title>
              <Button
                type="primary"
                className="category-button"
                onClick={() => navigate("/shop")}
              >
                Mua ngay
              </Button>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
}