import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { setToken } from "../../services/localStorageService";

const SignInGoogle = () => {
  const navigate = useNavigate();
  const isFetched = useRef(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isFetched.current) return;
    isFetched.current = true;

    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:8080/auth/signingoogle", {
          method: "POST",
          credentials: "include", // quan trọng nếu backend set cookie session
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        });

        if (!response.ok) throw new Error("Không thể lấy thông tin người dùng");

        const data = await response.json();

        setToken(data.result?.token);
        window.location.replace("/home");
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  if (loading) return <p>Đang xác thực, vui lòng chờ...</p>;
  if (error) return <p style={{ color: "red" }}>Lỗi: {error}</p>;

  return null;
};

export default SignInGoogle;
