import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Row, Col, Card, Typography, Input, Select, Button, Space, Alert, Skeleton } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import ColorPicker from "../../components/colorDropDown";
import "./styles.css";

const { Title, Text } = Typography;
const { Option } = Select;

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [maxPage, setMaxPage] = useState(1);
  const limit = 6;

  const [filters, setFilters] = useState({
    name: "",
    priceFrom: null,
    priceTo: null,
    brand: "",
    color: "",
    category_id: null,
  });

  const [sortBy, setSortBy] = useState("");

  useEffect(() => {
    fetchProducts({});
  }, []);

  const fetchProducts = (searchParams) => {
    setLoading(true);
    setError("");
    if (sortBy) {
      searchParams.sortBy = sortBy;
    }

    const queryString = new URLSearchParams(
      Object.entries(searchParams).filter(([_, value]) => value !== null && value !== "")
    ).toString();

    fetch(`http://localhost:8080/products/product-list?${queryString}&limit=${limit}`, {
      method: "GET",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Không thể tải danh sách sản phẩm!");
        }
        return response.json();
      })
      .then((data) => {
        setProducts(data.result || []);
        setMaxPage(data.totalPages);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Lỗi API:", error);
        setError(error.message);
        setLoading(false);
        setSnackBarOpen(true);
      });
  };

  const handleSearch = () => {
    setPage(0);
    const searchParams = { ...filters, page: 0 };
    fetchProducts(searchParams);
  };

  const onClickPrevPage = () => {
    if (page > 0) {
      setPage((prevPage) => {
        const newPage = prevPage - 1;
        fetchProducts({ ...filters, page: newPage });
        return newPage;
      });
    }
  };

  const onClickNextPage = () => {
    setPage((prevPage) => {
      const newPage = prevPage + 1;
      fetchProducts({ ...filters, page: newPage });
      return newPage;
    });
  };

  return (
    <div className="shop-container" style={{marginTop:80}}>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={6}>
          <div className="filter-section">
            <Title level={4}>Bộ lọc sản phẩm</Title>
            <div className="filter-container">
              <Space direction="vertical" style={{ width: "100%" }} size="middle">
                <div>
                  <Title level={5}>Tên sản phẩm</Title>
                  <Input
                    placeholder="Tên sản phẩm"
                    value={filters.name}
                    onChange={(e) => setFilters({ ...filters, name: e.target.value })}
                    className="filter-input"
                  />
                </div>
                <div>
                  <Title level={5}>Giá cả</Title>
                  <Select
                    placeholder="Giá cả"
                    style={{ width: "100%" }}
                    value={
                      filters.priceFrom !== null || filters.priceTo !== null
                        ? `${filters.priceFrom || ""}-${filters.priceTo || ""}`
                        : ""
                    }
                    onChange={(value) => {
                      const [priceFrom, priceTo] = value.split("-").map((v) => (v === "" ? null : Number(v)));
                      setFilters({ ...filters, priceFrom, priceTo });
                    }}
                    className="filter-select"
                  >
                    <Option value="0-">Tất cả</Option>
                    <Option value="-1000000">Dưới 1 triệu</Option>
                    <Option value="1000000-2000000">Từ 1 triệu đến 2 triệu</Option>
                    <Option value="2000000-3000000">Từ 2 triệu đến 3 triệu</Option>
                    <Option value="3000000-5000000">Từ 3 triệu đến 5 triệu</Option>
                    <Option value="5000000-">Trên 5 triệu</Option>
                  </Select>
                </div>
                <div>
                  <Title level={5}>Thương hiệu</Title>
                  <Select
                    placeholder="Thương hiệu"
                    style={{ width: "100%" }}
                    value={filters.brand}
                    onChange={(value) => setFilters({ ...filters, brand: value })}
                    className="filter-select"
                  >
                    <Option value="">Tất cả</Option>
                    <Option value="Vans">Vans</Option>
                    <Option value="Adidas">Adidas</Option>
                    <Option value="Nike">Nike</Option>
                    <Option value="Shucare">Shucare</Option>
                  </Select>
                </div>
                <div>
                  <Title level={5}>Màu sắc</Title>
                  <ColorPicker
                    value={filters.color}
                    onChange={(color) => {
                      const colorNames = {
                        black: "Đen",
                        white: "Trắng",
                        red: "Đỏ",
                        blue: "Xanh dương",
                        green: "Xanh lá",
                        yellow: "Vàng",
                        "": "",
                      };
                      setFilters({ ...filters, color: colorNames[color] });
                    }}
                  />
                </div>
                <div>
                  <Title level={5}>Danh mục</Title>
                  <Select
                    placeholder="Danh mục"
                    style={{ width: "100%" }}
                    value={filters.category_id ?? ""}
                    onChange={(value) => setFilters({ ...filters, category_id: value || null })}
                    className="filter-select"
                  >
                    <Option value="">Tất cả</Option>
                    <Option value={1}>Phụ kiện</Option>
                    <Option value={2}>Giày</Option>
                  </Select>
                </div>
                <div>
                  <Title level={5}>Sắp xếp theo</Title>
                  <Select
                    placeholder="Sắp xếp theo"
                    style={{ width: "100%" }}
                    value={sortBy}
                    onChange={(value) => setSortBy(value)}
                    className="filter-select"
                  >
                    <Option value="">Mặc định</Option>
                    <Option value="price ASC">Giá tăng dần</Option>
                    <Option value="price DESC">Giá giảm dần</Option>
                  </Select>
                </div>
                <Button type="primary" block onClick={handleSearch} className="filter-button">
                  Tìm kiếm
                </Button>
              </Space>
            </div>
          </div>
        </Col>
        <Col xs={24} md={18}>
          <Title level={2} style={{ textAlign: "center" }}>
            Cửa hàng
          </Title>
          {loading ? (
            <Row gutter={[24, 24]} justify="center">
              {Array.from({ length: 6 }).map((_, index) => (
                <Col xs={24} sm={12} md={8} key={index}>
                  <Card className="product-card">
                    <Skeleton.Image style={{ width: "100%", height: 250 }} />
                    <Skeleton active paragraph={{ rows: 2 }} />
                  </Card>
                </Col>
              ))}
            </Row>
          ) : error ? (
            <Alert
              message={error}
              type="error"
              showIcon
              closable
              onClose={() => setSnackBarOpen(false)}
              className="error-alert"
            />
          ) : (
            <Row gutter={[24, 24]} justify="center">
              {products.content.map((product) => (
                <Col xs={24} sm={12} md={8} key={product.id}>
                  <Card
                    className="product-card"
                    cover={
                      <div className="image-container">
                        <img
                          alt={product.name}
                          src={product.image}
                          className="product-image"
                        />
                        <div className="overlay">
                          <Link className="ant-btn ant-btn-primary" to={`/shop/${product.id}`}>
                            Xem chi tiết
                          </Link>
                        </div>
                      </div>
                    }
                  >
                    <Card.Meta
                      title={product.name}
                      description={`${product.price.toLocaleString()} VND`}
                    />
                  </Card>
                </Col>
              ))}
            </Row>
          )}
          <Space style={{ marginTop: 16, display: "flex", justifyContent: "center" }}>
            <div className="pagination-container">
              <Button
                icon={<LeftOutlined />}
                onClick={onClickPrevPage}
                disabled={page === 0}
                className="pagination-button"
              />
              <Text className="pagination-text">{page + 1} / {maxPage}</Text>
              <Button
                icon={<RightOutlined />}
                onClick={onClickNextPage}
                disabled={page === maxPage - 1}
                className="pagination-button"
              />
            </div>
          </Space>
        </Col>
      </Row>
    </div>
  );
}