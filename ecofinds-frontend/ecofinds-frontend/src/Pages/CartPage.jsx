import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../Context/CartContext";
import toast from "react-hot-toast";
import axios from "axios";

const CartPage = () => {
  const { cartItems, updateQuantity, removeItem, clearCart } = useCart(); // Added clearCart
  const navigate = useNavigate();

  const total = cartItems.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  const handleCheckout = async (e) => {
    e.preventDefault(); // Prevent default form submission

    try {
      if (cartItems.length === 0) {
        return toast.error("Your Cart is Empty");
      }

      const token = JSON.parse(localStorage.getItem("User"))?.token;

      if (!token) {
        return toast.error("User not authenticated");
      }

      console.log("Cart Items:", cartItems);

      const orderData = cartItems.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
      }));

      console.log("Order Data to be sent:", orderData); // Verify data before sending

      const response = await axios.post(
        "http://localhost:3030/api/order",
        {
          items: orderData,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // console.log(response);
      // console.log(response.razorpay_signature);
      const { razorpayOrderId } = response.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Ensure this is correctly set
        amount: total * 100,
        currency: "INR",
        name: "EcoFinds",
        description: "Lorem ipsum dolor sit amet",
        order_id: razorpayOrderId,
        handler: async function (response) {
          const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
            response;
          // console.log("Payment Response: ", response);
          await verifyPayment(
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
          );
        },
        prefill: {
          name: "Rohan Prakasan",
          email: "EcoFinds.feedback@gmail.com",
          contact: "9999999999",
        },
        theme: {
          color: "#68D89B",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.log("Error during checkout", error);
      toast.error(`${error.response?.data.message}`);
    }
  };

  const verifyPayment = async (order_id, payment_id, signature) => {
    try {
      const token = JSON.parse(localStorage.getItem("User"))?.token; // Make sure token is available here
      const response = await axios.post(
        "http://localhost:3030/api/order/verify",
        {
          razorpay_order_id: order_id,
          razorpay_payment_id: payment_id,
          razorpay_signature: signature,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token for payment verification
          },
        }
      );
      // console.log("Verify Payment Response", response.data);
      if (response.data.message === "Payment Verified") {
        toast.success("Payment Successful! Order Placed");
        clearCart();
        navigate("/");
      } else {
        toast.error("Payment verification failed. Please try again.");
      }
    } catch (error) {
      console.error("Payment verification failed:", error);
      toast.error(`${error.response?.data.message}`);
    }
  };

  return (
    <main className="flex-1 container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
      {cartItems.length === 0 ? (
        <div>
          <p className="text-lg">Your cart is currently empty.</p>
          <Link to="/">
            <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Continue Shopping
            </button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {cartItems.map((item) => (
            <div key={item.id} className="border rounded-lg p-4 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">{item.name}</h2>
                <p className="text-lg font-bold">${item.price.toFixed(2)}</p>
              </div>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-2">
                  <button
                    className="px-3 py-1 border rounded hover:bg-gray-200"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      updateQuantity(item.id, parseInt(e.target.value, 10))
                    }
                    className="w-16 text-center border rounded py-1"
                  />
                  <button
                    className="px-3 py-1 border rounded hover:bg-gray-200"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  onClick={() => removeItem(item.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <div className="flex justify-between items-center mt-6 font-bold text-xl">
            <h2>Total:</h2>
            <p>${total.toFixed(2)}</p>
          </div>
          <button
            className="w-full mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            onClick={handleCheckout}
          >
            Proceed to Checkout
          </button>
        </div>
      )}
    </main>
  );
};

export default CartPage;
