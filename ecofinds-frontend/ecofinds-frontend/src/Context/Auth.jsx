import axios from "axios";
import { createContext, useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const Auth = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [seller, setSeller] = useState(null);
  const [registerInfo, setRegisterInfo] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const [isRegisterLoading, setIsRegisterLoading] = useState(false);
  const [registrationError, setRegistrationError] = useState(null);

  const updateRegisterInfo = useCallback((info) => {
    setRegisterInfo(info);
  });

  const register = useCallback(
    async (e) => {
      e.preventDefault();
      setIsRegisterLoading(true);
      setRegistrationError(null);

      try {
        const response = await axios.post(
          "http://localhost:3030/api/auth/register",
          registerInfo
        );

        setIsRegisterLoading(false);

        if (response.data.error) {
          toast.error(response.data.error);
          return setRegistrationError(response.data.error);
        }

        navigate("/login");
        toast.success(response.data.message);
        // setUser(response.data);
      } catch (error) {
        setIsRegisterLoading(false);
        toast.error("Registration failed!");
        setRegistrationError("Registration failed!");
      }
    },
    [registerInfo, navigate]
  );

  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("User");
    const storedSeller = localStorage.getItem("Seller");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    if (storedSeller) {
      setSeller(JSON.parse(storedSeller));
    }
  }, []);

  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState(null);

  const updateLoginInfo = useCallback((info) => {
    setLoginInfo(info);
  });

  const login = useCallback(
    async (e) => {
      e.preventDefault();

      setIsLoginLoading(true);
      setLoginError(null);

      try {
        const response = await axios.post(
          "http://localhost:3030/api/auth/login",
          loginInfo
        );

        setIsLoginLoading(false);

        if (response.data.error) {
          toast.error(response.data.error);
          setLoginError(response.data.error);
          return;
        }

        toast.success("Successfully Logged In");

        localStorage.setItem("User", JSON.stringify(response.data));
        setUser(response.data);

        if (response.data.user) {
          localStorage.setItem("User", JSON.stringify(response.data.user));
          setUser(response.data.user);
        }

        // Set seller info if available
        if (response.data.seller) {
          localStorage.setItem("Seller", JSON.stringify(response.data.seller));
          setSeller(response.data.seller);
        } else {
          localStorage.removeItem("Seller");
          setSeller(null);
        }

        navigate("/");
      } catch (error) {
        setIsLoginLoading(false);
        toast.error("An error occurred. Please try again.");
        console.error("Login error:", error);
      }
    },
    [loginInfo, navigate]
  );

  const logout = useCallback(async () => {
    localStorage.removeItem("User");
    localStorage.removeItem("Seller");
    setUser(null);
    setSeller(null);
    toast.success("Logged Out Successfully");
    navigate("/"); // Redirect to home page or login page
  }, [navigate]);

  const [sellerInfo, setSellerInfo] = useState({
    store_name: "",
    store_description: "",
    contact_info: "",
  });

  const updateSellerInfo = useCallback((info) => {
    setSellerInfo(info);
  });

  const [sellerLoading, setSellerLoading] = useState(false);

  const registerSeller = useCallback(
    async (e) => {
      e.preventDefault();

      setSellerLoading(true);
      try {
        const response = await axios.post(
          "http://localhost:3030/api/seller/become-a-seller",
          sellerInfo,
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );
        setSellerLoading(false);
        toast.success(response.data.message);
        localStorage.setItem("Seller", JSON.stringify(response.data));
        setSeller(response.data.seller); // Update seller state
        navigate("/dashboard");
      } catch (error) {
        setSellerLoading(false);
        toast.error(
          error.response?.data.message || "An unknown error occurred."
        );
      }
    },
    [sellerInfo, user, navigate]
  );

  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    images: [],
    ecofriendly: 0,
    carbonneutral: 0,
    recycle: 0,
  });

  const [previewImages, setPreviewImages] = useState([]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleImageChange = useCallback((e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const filePreviews = files.map((file) => URL.createObjectURL(file));
      setPreviewImages(filePreviews);
      setProduct((prev) => ({ ...prev, images: files }));
    } else {
      toast.error("Please select at least one image.");
    }
  }, []);

  const [isuploading, setIsUploading] = useState(false);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      console.log(product);
      console.log(seller.seller_id);

      if (!user || !user.token) {
        toast.error("User not authenticated.");
        return;
      }

      const validateProductData = (data) => {
        const {
          name,
          description,
          price,
          stock,
          images,
          seller_id,
          ecofriendly,
          carbonneutral,
          recycle,
        } = data;
        return (
          name &&
          description &&
          price &&
          stock &&
          images &&
          Array.isArray(images) &&
          images.length > 0 &&
          seller_id &&
          ecofriendly &&
          carbonneutral &&
          recycle
        );
      };

      if (
        !validateProductData({
          ...product,
          seller_id: seller.seller_id,
        })
      ) {
        toast.error(
          "Please make sure all fields are filled, at least one image is provided, and seller ID is included."
        );
        setIsUploading(false);
        return;
      }

      const formData = new FormData();

      // Append the images to formData
      product.images.forEach((image) => formData.append("images", image));

      // Append the rest of the product details, including seller_id
      formData.append("name", product.name);
      formData.append("description", product.description);
      formData.append("price", product.price);
      formData.append("stock", product.stock);
      formData.append("ecofriendly", product.ecofriendly); // Make sure the key matches backend
      formData.append("carbonneutral", product.carbonneutral); // Match backend key
      formData.append("recycle", product.recycle); // Match backend key
      formData.append("seller_id", seller.seller_id); // Include seller_id

      try {
        setIsUploading(true);

        const uploadResponse = await axios.post(
          "http://localhost:3030/upload",
          formData
        );

        if (uploadResponse.status === 200) {
          const imageUrls = uploadResponse.data.imageUrls;
          const imageUrlsString = Array.isArray(imageUrls)
            ? imageUrls.join(",")
            : "";

          const productData = {
            name: product.name,
            description: product.description,
            price: product.price,
            stock: product.stock,
            image_url: imageUrlsString,
            seller_id: seller.seller_id,
            ecofriendly: product.ecofriendly,
            carbonneutral: product.carbonneutral,
            recycle: product.recycle,
          };

          const productResponse = await axios.post(
            "http://localhost:3030/api/product/post",
            productData,
            {
              headers: { Authorization: `Bearer ${user.token}` },
            }
          );

          setIsUploading(false);
          if (productResponse.status === 200) {
            toast.success("Product Created Successfully!");
            setProduct({
              name: "",
              description: "",
              price: "",
              stock: "",
              images: [],
              ecofriendly: 0,
              carbonneutral: 0,
              recycle: 0,
            });
            setPreviewImages([]);
            navigate("/");
          } else {
            toast.error(
              productResponse.data.message || "Failed to create product"
            );
          }
        } else {
          toast.error(uploadResponse.data.message || "Failed to upload images");
        }
      } catch (error) {
        setIsUploading(false);
        console.error("Error Response:", error.response);
        toast.error(`Error: ${error.response?.data?.message || error.message}`);
      }
    },
    [product, user, seller, navigate]
  );

  return (
    <Auth.Provider
      value={{
        user,
        registerInfo,
        updateRegisterInfo,
        register,
        isRegisterLoading,
        loginInfo,
        updateLoginInfo,
        isLoginLoading,
        login,
        logout,
        updateSellerInfo,
        sellerInfo,
        registerSeller,
        setSellerLoading,
        seller,
        product,
        previewImages,
        handleInputChange,
        handleImageChange,
        handleSubmit,
        isuploading,
      }}
    >
      {children}
    </Auth.Provider>
  );
};
