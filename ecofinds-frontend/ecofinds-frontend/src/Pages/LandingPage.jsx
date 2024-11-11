import { useContext, useEffect, useState } from "react";
import axios from "axios";
import Slider from "react-slick";
import { useCart } from "../Context/CartContext";
import toast from "react-hot-toast";
import { Auth } from "../Context/Auth";

const ProductList = () => {
  const { user, seller } = useContext(Auth); // Include seller context
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:3030/api/product/");
        console.log(response.data);

        // Filter out products with stock 0
        const filteredProducts = response.data.products.filter(
          (product) => product.stock > 0
        );

        setProducts(filteredProducts || []);

        // Extract unique categories from filtered products
        const uniqueCategories = [
          ...new Set(filteredProducts.map((product) => product.category_name)),
        ];
        setCategories(["All", ...uniqueCategories]);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleClick = (product) => {
    if (!user) {
      return toast.error("Please Login First");
    } else {
      addToCart({
        id: product.product_id,
        name: product.name,
        price: parseFloat(product.price),
      });
    }
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  if (loading) return <div className="text-center text-2xl">Loading...</div>;
  if (error)
    return (
      <div className="h-screen flex justify-center items-center text-center text-2xl text-red-500">
        No Products to Showcase. Come Back Later.
      </div>
    );

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
  };

  // Filter products based on selected category
  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter(
          (product) => product.category_name === selectedCategory
        );

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-10">
          <h1
            className="text-4xl font-extrabold text-gray-800 font-serif"
            style={{ fontFamily: "Roboto Condensed" }}
          >
            Our Products
          </h1>
          <div>
            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="bg-white border border-gray-300 text-gray-800 py-2 px-4 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
          style={{ fontFamily: "Nunito" }}
        >
          {filteredProducts.map((product) => {
            const imageUrls = product.image_url.split(",");

            return (
              <div
                key={product.product_id}
                className="bg-white rounded-lg shadow-lg overflow-hidden"
              >
                {imageUrls.length > 1 ? (
                  <Slider {...sliderSettings}>
                    {imageUrls.map((url, index) => (
                      <div key={index}>
                        <img
                          src={url}
                          alt={`${product.name}-${index}`}
                          className="w-full h-64 object-cover"
                        />
                      </div>
                    ))}
                  </Slider>
                ) : (
                  <img
                    src={imageUrls[0]}
                    alt={product.name}
                    className="w-full h-64 object-cover"
                  />
                )}
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    {product.name}
                  </h2>
                  <p className="text-gray-600 mb-4">{product.description}</p>
                  <p className="text-lg font-bold text-gray-800 mb-2">
                    ${product.price}
                  </p>
                  <p className="text-gray-600 mb-4">Stock: {product.stock}</p>
                  <p className="text-gray-600 mb-4">
                    Eco-Friendly: {product.ecofriendly}/5
                  </p>
                  <p className="text-gray-600 mb-4">
                    Carbon Neutral: {product.carbonneutral}/5
                  </p>
                  <p className="text-gray-600 mb-4">
                    Recyclable: {product.recycle}/5
                  </p>
                  {/* Only render the Add to Cart button if user is NOT a seller */}
                  {user && !seller && (
                    <button
                      className="w-full bg-black hover:bg-white hover:text-black text-white py-2 rounded"
                      onClick={() => handleClick(product)} // Pass product to handleClick
                    >
                      Add to Cart
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProductList;
