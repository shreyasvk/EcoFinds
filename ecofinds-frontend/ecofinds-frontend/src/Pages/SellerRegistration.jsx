import React, { useState, useContext } from "react";
import { Auth } from "../Context/Auth";

const SellerRegistration = () => {
  const { sellerInfo, updateSellerInfo, registerSeller } = useContext(Auth);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when starting registration
    try {
      await registerSeller(e); // Call the registerSeller function
    } finally {
      setLoading(false); // Set loading to false after registration attempt
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Create Your Store
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter the details to set up your store on EcoFinds.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="store_name" className="sr-only">
                Store Name
              </label>
              <input
                id="store_name"
                name="store_name"
                type="text"
                required
                value={sellerInfo.store_name}
                onChange={(e) => {
                  updateSellerInfo({
                    ...sellerInfo,
                    store_name: e.target.value,
                  });
                }}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Store Name"
              />
            </div>
            <div>
              <label htmlFor="store_description" className="sr-only">
                Store Description
              </label>
              <textarea
                id="store_description"
                name="store_description"
                required
                value={sellerInfo.store_description}
                onChange={(e) => {
                  updateSellerInfo({
                    ...sellerInfo,
                    store_description: e.target.value,
                  });
                }}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Store Description"
              />
            </div>
            <div>
              <label htmlFor="contact_info" className="sr-only">
                Contact Info
              </label>
              <input
                id="contact_info"
                name="contact_info"
                type="text"
                required
                value={sellerInfo.contact_info}
                onChange={(e) => {
                  updateSellerInfo({
                    ...sellerInfo,
                    contact_info: e.target.value,
                  });
                }}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Contact Info"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={loading} // Disable button while loading
            >
              {loading ? "Creating your Store..." : "Create Store"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default SellerRegistration;
