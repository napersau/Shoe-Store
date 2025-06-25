import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col, Typography, Button, Image, Input, Spin } from "antd";
import { LeftOutlined, RightOutlined, CloseOutlined, MessageOutlined } from "@ant-design/icons";
import axios from "axios";
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

axios.defaults.baseURL = "http://localhost:8080";

export default function HomeClient() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const chatContainerRef = useRef(null);

  const slides = [
    {
      id: 1,
      title: "Khám Phá Thế Giới Giày",
      subtitle: "Chất lượng cao – Phong cách thời thượng – Giá cả hợp lý",
      description: "Sản phẩm được làm từ chất liệu cao cấp, mang đến sự êm ái và bền bỉ theo thời gian.",
      image: banner1,
      buttonText: "Mua ngay",
    },
    {
      id: 2,
      title: "Phụ Kiện Chất Lượng",
      subtitle: "Bước Đi Tự Tin Với Phụ Kiện Cao Cấp",
      description: "Dây giày phong cách, miếng lót êm ái, bộ chăm sóc giày chuyên nghiệp – Tất cả để đôi giày của bạn luôn như mới!",
      image: banner2,
      buttonText: "Khám phá ngay",
    },
    {
      id: 3,
      title: "Bộ Sưu Tập Mới",
      subtitle: "Xu Hướng Thời Trang 2025",
      description: "Cập nhật những mẫu giày mới nhất, theo kịp xu hướng thời trang quốc tế với thiết kế độc đáo và chất lượng vượt trội.",
      image: banner1,
      buttonText: "Xem bộ sưu tập",
    },
  ];

  const serviceItems = [
    { img: freeShipping, title: "Miễn phí ship" },
    { img: service24_7, title: "Phục vụ 24/7" },
    { img: chinhHang, title: "Bảo đảm chính hãng" },
  ];

  const categories = [
    { img: category1, title: "Phụ kiện" },
    { img: category2, title: "Giày" },
    { img: category3, title: "Kính" },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    setIsLoading(true);
    const userMessage = { message, isUser: true };
    setChatHistory([...chatHistory, userMessage]);

    try {
      const response = await axios.post("/api/chatbot/chat", {
        message,
      });
      if (response.data) {
        setChatHistory(prev => [...prev, { message: response.data.message, isUser: false }]);
        setMessage("");
      }
    } catch (error) {
      console.error("Lỗi khi gửi tin nhắn:", error);
      setChatHistory(prev => [...prev, { message: "Xin lỗi, có lỗi xảy ra.", isUser: false }]);
    } finally {
      setIsLoading(false);
      setMessage("");
    }
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const closeChat = () => {
    setIsChatOpen(false);
    // Reset chat history khi đóng chat
    setChatHistory([]);
  };

  return (
    <div className="home-container" style={{ margin: 0 }}>
      {/* Carousel */}
      <div className="carousel-wrapper">
        <div className="carousel-content-wrapper">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`carousel-slide ${currentSlide === index ? "active" : ""}`}
              style={{
                transform: `translateX(${(index - currentSlide) * 100}%)`,
              }}
            >
              <Row gutter={[32, 32]} align="middle" className="slide-row">
                <Col xs={24} md={12} className="slide-text-col">
                  <div className={`slide-content ${currentSlide === index ? "animate" : ""}`}>
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
                  <div className={`slide-image-wrapper ${currentSlide === index ? "animate" : ""}`}>
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
        <div className="carousel-dots">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`carousel-dot ${currentSlide === index ? "active" : ""}`}
            />
          ))}
        </div>
      </div>

      {/* Services and Categories */}
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

      {/* ✅ Chatbot Icon - Cố định ở góc dưới bên phải */}
      <div 
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 9999
        }}
      >
        {/* Icon Chatbot */}
        {!isChatOpen && (
          <Button
            type="primary"
            shape="circle"
            size="large"
            icon={<MessageOutlined />}
            onClick={toggleChat}
            style={{
              width: '64px',
              height: '64px',
              fontSize: '20px',
              backgroundColor: '#1890ff',
              borderColor: '#1890ff',
              boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
              animation: 'pulse 2s infinite',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'transform 0.2s ease'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
          />
        )}

        {/* Box Chat */}
        {isChatOpen && (
          <div 
            style={{
              width: '320px',
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
              display: 'flex',
              flexDirection: 'column',
              animation: 'slide-up 0.3s ease-out',
              maxHeight: '500px'
            }}
          >
            <div 
              style={{
                backgroundColor: '#1890ff',
                color: 'white',
                padding: '16px',
                borderTopLeftRadius: '8px',
                borderTopRightRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <span style={{ fontWeight: '600' }}>Hỗ trợ mua sắm</span>
              <Button
                type="text"
                icon={<CloseOutlined />}
                onClick={closeChat}
                style={{ color: 'white' }}
              />
            </div>
            <div
              ref={chatContainerRef}
              style={{
                flex: 1,
                padding: '16px',
                overflowY: 'auto',
                maxHeight: '384px'
              }}
            >
              {chatHistory.length === 0 && (
                <div style={{ textAlign: 'center', color: '#999' }}>
                  Bắt đầu trò chuyện! Hỏi về giày, phụ kiện, hoặc kính mắt nhé! 😊
                </div>
              )}
              {chatHistory.map((item, index) => (
                <div
                  key={index}
                  style={{
                    marginBottom: '16px',
                    display: 'flex',
                    justifyContent: item.isUser ? 'flex-end' : 'flex-start'
                  }}
                >
                  <div
                    style={{
                      maxWidth: '70%',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: item.isUser ? '#e6f7ff' : '#f5f5f5',
                      color: item.isUser ? '#0050b3' : '#262626'
                    }}
                  >
                    {item.message}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <Spin />
                </div>
              )}
            </div>
            <div style={{ padding: '16px', borderTop: '1px solid #f0f0f0' }}>
              <Input.Search
                placeholder="Nhập câu hỏi của bạn..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onSearch={sendMessage}
                enterButton="Gửi"
                style={{ width: '100%' }}
                disabled={isLoading}
              />
            </div>
          </div>
        )}
      </div>

      {/* CSS cho animation */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}