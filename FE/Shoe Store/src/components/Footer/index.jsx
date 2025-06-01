import React from "react";
import { Row, Col, Typography, Input, Button, Space, Divider } from "antd";
import { EnvironmentOutlined, PhoneOutlined, MailOutlined, FacebookOutlined, InstagramOutlined, TwitterOutlined, LinkedinOutlined } from "@ant-design/icons";
import "./styles.css";

const { Title, Text } = Typography;

function Footer() {
  return (
    <footer className="footer-container" id="tempaltemo_footer">
      <div className="container">
        <Row gutter={[32, 32]} className="footer-sections">
          <Col xs={24} md={8}>
            <Title level={3} className="footer-title">
              Zay Shop
            </Title>
            <ul className="footer-link-list">
              <li>
                <EnvironmentOutlined className="footer-icon" />
                <Text className="footer-text">Hà Nội</Text>
              </li>
              <li>
                <PhoneOutlined className="footer-icon" />
                <a className="footer-link" href="tel:0334787050">
                  0334787050
                </a>
              </li>
              <li>
                <MailOutlined className="footer-icon" />
                <a className="footer-link" href="mailto:khoinguyenduc7@gmail.com">
                  khoinguyenduc7@gmail.com
                </a>
              </li>
            </ul>
          </Col>

          <Col xs={24} md={8}>
            <Title level={3} className="footer-title">
              Sản phẩm
            </Title>
            <ul className="footer-link-list">
              <li>
                <a className="footer-link" href="/">
                  Giày thể thao
                </a>
              </li>
              <li>
                <a className="footer-link" href="/">
                  Phụ kiện
                </a>
              </li>
            </ul>
          </Col>

          <Col xs={24} md={8}>
            <Title level={3} className="footer-title">
              Thông tin
            </Title>
            <ul className="footer-link-list">
              <li>
                <a className="footer-link" href="/">
                  Trang chủ
                </a>
              </li>
              <li>
                <a className="footer-link" href="/">
                  Địa điểm cửa hàng
                </a>
              </li>
              <li>
                <a className="footer-link" href="/">
                  Câu hỏi
                </a>
              </li>
              <li>
                <a className="footer-link" href="/">
                  Liên hệ
                </a>
              </li>
            </ul>
          </Col>
        </Row>

        <Divider className="footer-divider" />

        <Row gutter={[16, 16]} align="middle" className="footer-bottom">
          <Col xs={24} md={12} className="footer-social">
            <Space size="middle">
              <a
                className="footer-social-link"
                href="http://facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FacebookOutlined className="footer-social-icon" />
              </a>
              <a
                className="footer-social-link"
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <InstagramOutlined className="footer-social-icon" />
              </a>
              <a
                className="footer-social-link"
                href="https://twitter.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <TwitterOutlined className="footer-social-icon" />
              </a>
              <a
                className="footer-social-link"
                href="https://www.linkedin.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <LinkedinOutlined className="footer-social-icon" />
              </a>
            </Space>
          </Col>
          <Col xs={24} md={12} className="footer-subscribe">
            <Input.Group compact>
              <Input
                className="footer-input"
                placeholder="Địa chỉ email"
              />
              <Button type="primary" className="footer-subscribe-btn">
                Gửi
              </Button>
            </Input.Group>
          </Col>
        </Row>
      </div>

      <div className="footer-copyright">
        <div className="container">
          <Row>
            <Col xs={24}>
              <Text className="footer-copyright-text">
                © 2025 <a href="/" className="footer-copyright-link">Đức Khởi</a>
              </Text>
            </Col>
          </Row>
        </div>
      </div>
    </footer>
  );
}

export default Footer;