import React, { useContext } from "react";
import toast from "react-hot-toast";
import { Auth } from "../Context/Auth";

const PostProduct = () => {
  const {
    product,
    previewImages,
    handleInputChange,
    handleSubmit,
    isuploading,
    handleImageChange,
  } = useContext(Auth);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
        <h1 className="text-2xl font-bold text-center mb-6">
          Post a New Product
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Product Name
            </label>
            <input
              type="text"
              name="name"
              value={product.name}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="e.g., Wireless Earbuds"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={product.description}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              rows="4"
              placeholder="Describe your product"
              required
            ></textarea>
          </div>

          <div className="flex space-x-4">
            <div className="w-1/2">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Price
              </label>
              <input
                type="number"
                name="price"
                value={product.price}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="e.g., 99.99"
                min="0"
                required
              />
            </div>
            <div className="w-1/2">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Stock
              </label>
              <input
                type="number"
                name="stock"
                value={product.stock}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="e.g., 50"
                min="0"
                required
              />
            </div>
            <div className="w-1/2">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Ecofriendly
              </label>
              <input
                type="number"
                name="ecofriendly"
                value={product.ecofriendly}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="e.g., 50"
                min="0"
                max="5"
                required
              />
            </div>
            <div className="w-1/2">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Carbon Neutral
              </label>
              <input
                type="number"
                name="carbonneutral"
                value={product.carbonneutral}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="e.g., 50"
                min="0"
                max="5"
                required
              />
            </div>
            <div className="w-1/2">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Recycle
              </label>
              <input
                type="number"
                name="recycle"
                value={product.recycle}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="e.g., 50"
                min="0"
                max="5"
                required
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Upload Images
            </label>
            <input
              type="file"
              multiple
              onChange={handleImageChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              accept="image/*"
              required
            />
          </div>

          {/* Image Preview */}
          <div className="grid grid-cols-3 gap-4">
            {previewImages.map((image, index) => (
              <div key={index} className="border rounded-lg overflow-hidden">
                <img
                  src={image}
                  alt={`Preview${index + 1}`}
                  className="w-full h-24 object-cover"
                />
              </div>
            ))}
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition duration-300"
          >
            {isuploading ? "Posting your Product..." : "Post Product"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostProduct;
