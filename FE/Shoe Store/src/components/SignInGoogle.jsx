import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { setToken } from "../services/localStorageService";

const SignInGoogle = () => {
  const navigate = useNavigate();
  const isFetched = useRef(false); // ✅ Ngăn gọi API hai lần

  useEffect(() => {
    if (isFetched.current) return; // ✅ Nếu đã gọi API, không gọi lại
    isFetched.current = true;

    const fetchUserData = async () => {
      try {
        const response = await fetch("http://localhost:8080/auth/signingoogle", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        });

        if (!response.ok) throw new Error("❌ Không thể lấy thông tin người dùng");

        const userData = await response.json();
        console.log("✅ Dữ liệu người dùng:", userData);

        if (userData.result?.token) {
          setToken(userData.result.token);
          navigate("/home");
        }
      } catch (error) {
        console.error("⚠️ Lỗi lấy dữ liệu người dùng:", error);
      }
    };

    fetchUserData();
  }, [navigate]);

  return <p>Đang xác thực, vui lòng chờ...</p>;
};

export default SignInGoogle;
