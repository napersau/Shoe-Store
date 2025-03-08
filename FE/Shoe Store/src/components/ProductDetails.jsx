import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "./header_client/HeaderClient";
import { getToken } from "../services/localStorageService";

const sizes = [
  { value: "34.5", soldout: false },
  { value: "35", soldout: false },
  { value: "36", soldout: false },
  { value: "36.5", soldout: false },
  { value: "37", soldout: false },
  { value: "38", soldout: false },
  { value: "38.5", soldout: false },
  { value: "39", soldout: false },
  { value: "40", soldout: false },
  { value: "40.5", soldout: false },
  { value: "41", soldout: false },
  { value: "42", soldout: false },
  { value: "42.5", soldout: false },
  { value: "43", soldout: false },
  { value: "44", soldout: false },
  { value: "44.5", soldout: false },
  { value: "45", soldout: false },
];

const ProductDetails = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("0");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:8080/products/client/${productId}`);
        if (!response.ok) throw new Error("Failed to fetch product");
        const data = await response.json();
        setProduct(data.result);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    if (productId) fetchProduct();
  }, [productId]);

  const handleBuyNow = () => {
    const token = getToken();
    if (!token) {
      alert("Vui lòng đăng nhập trước khi mua!");
      navigate("/login");
      return;
    }

    if (product.category !== "accessory" && !selectedSize) {
      alert("Vui lòng chọn size trước khi mua!");
      return;
    }

    const totalMoney = product.price * quantity;
    navigate("/payments", {
      state: {
        quantity,
        size: selectedSize,
        totalMoney,
        productId: Number(productId),
      },
    });
  };

  const handleAddToCart = async () => {
    if (product.category !== "accessory" && !selectedSize) {
      alert("Vui lòng chọn size trước khi thêm vào giỏ hàng!");
      return;
    }

    const totalMoney = product.price * quantity;
    const cartData = {
      productId: product.id,
      numberOfProducts: quantity,
      totalMoney: totalMoney,
      size: selectedSize,
    };

    const token = getToken();

    try {
      const response = await fetch("http://localhost:8080/cart-detail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(cartData),
      });

      if (!response.ok) throw new Error("Không thể thêm vào giỏ hàng");
      alert("Thêm vào giỏ hàng thành công!");
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
      alert("Đã xảy ra lỗi khi thêm vào giỏ hàng!");
    }
  };

  if (!product) return <p>Loading...</p>;

  return (
    <>
      <Header />
      <section className="bg-light">
        <div className="container pb-5">
          <div className="row">
            <div className="col-lg-5 mt-5">
              <div className="card mb-3">
                <img className="card-img img-fluid" src={product.image} alt={product.name} />
              </div>
            </div>

            <div className="col-lg-7 mt-5">
              <div className="card">
                <div className="card-body">
                  <h1 className="h2">{product.name}</h1>
                  <p className="h3 py-2">{product.price} ₫</p>
                  <h6>Thương hiệu: <strong>{product.brand}</strong></h6>
                  <h6>Mô tả:</h6>
                  <p>{product.description}</p>
                  <h6>Màu sắc: <strong>{product.color}</strong></h6>

                  {product.category.id !== 1 && (
                    <>
                      <h6>Chọn size:</h6>
                      <div className="swatch-grid">
                        {sizes.map((size, index) => (
                          <div
                            key={index}
                            data-value={size.value}
                            className={`swatch-element ${
                              size.soldout ? "soldout" : "available"
                            } ${selectedSize === size.value ? "selected" : ""}`}
                            onClick={() => !size.soldout && setSelectedSize(size.value)}
                          >
                            <input
                              type="radio"
                              name="size"
                              value={size.value}
                              disabled={size.soldout}
                              checked={selectedSize === size.value}
                              onChange={() => setSelectedSize(size.value)}
                            />
                            <label>{size.value}</label>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  <h6>Số lượng:</h6>
                  <div className="d-flex align-items-center">
                    <button className="btn btn-success" onClick={() => setQuantity((prev) => Math.max(prev - 1, 1))}>-</button>
                    <span className="mx-3">{quantity}</span>
                    <button className="btn btn-success" onClick={() => setQuantity((prev) => prev + 1)}>+</button>
                  </div>

                  <div className="row pb-3 mt-3">
                    <div className="col d-grid">
                      <button className="btn btn-danger btn-lg" onClick={handleBuyNow}>Mua ngay</button>
                    </div>
                    <div className="col d-grid">
                      <button className="btn btn-success btn-lg" onClick={handleAddToCart}>Thêm vào giỏ hàng</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ProductDetails;