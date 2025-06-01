// src/components/ProductAdmin.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Button, Spin, message, Typography, Space, Popconfirm, Image } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { getToken } from "../../services/localStorageService";
import "./styles.css"; // Import the custom CSS file

const { Title } = Typography;

export default function ProductAdmin() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate("/login");
      return;
    }
    fetchProducts();
  }, [navigate]);

  const fetchProducts = () => {
    setLoading(true);
    const token = getToken();
    fetch("http://localhost:8080/products", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Không thể tải danh sách sản phẩm!");
        }
        return response.json();
      })
      .then((data) => {
        setProducts(data.result);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Lỗi API:", error);
        setError(error.message);
        setLoading(false);
        message.error(error.message);
      });
  };

  const handleEdit = (id) => {
    navigate(`/admin/edit-product/${id}`);
  };

  const handleDelete = (id) => {
    const token = getToken();
    fetch(`http://localhost:8080/products/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Không thể xóa sản phẩm!");
        }
        setProducts(products.filter((product) => product.id !== id));
        setSuccessMessage("Xóa sản phẩm thành công!");
        message.success("Xóa sản phẩm thành công!");
      })
      .catch((error) => {
        console.error("Lỗi khi xóa sản phẩm:", error);
        setError(error.message);
        message.error(error.message);
      });
  };

  const columns = [
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (price) => `${price.toLocaleString()} VND`,
    },
    {
      title: "Hình ảnh",
      dataIndex: "image",
      key: "image",
      render: (image, record) => (
        <Image src={image} alt={record.name} width={80} height={80} />
      ),
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Thương hiệu",
      dataIndex: "brand",
      key: "brand",
    },
    {
      title: "Màu sắc",
      dataIndex: "color",
      key: "color",
    },
    {
      title: "Danh mục",
      dataIndex: "category",
      key: "category",
      render: (category) => category.name,
    },
    {
      title: "Ch chức năng",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record.id)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa sản phẩm này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button type="danger" icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="product-admin-container">
      <Title level={2} className="product-admin-title">
        Danh sách sản phẩm
      </Title>
      {loading ? (
        <div className="loading-container">
          <Spin size="large" />
        </div>
      ) : (
        <>
          <Table
            columns={columns}
            dataSource={products}
            rowKey="id"
            pagination={false}
            className="product-table"
          />
          <div className="add-product-container">
            <Button
              type="primary"
              size="large"
              onClick={() => navigate("/admin/add-product")}
            >
              Thêm sản phẩm
            </Button>
          </div>
        </>
      )}
    </div>
  );
}