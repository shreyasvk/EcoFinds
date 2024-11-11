import React, { useState } from "react";

export default function ProfilePage() {
  const [user, setUser] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    address: "123 Main St, Anytown, AN 12345",
    phone: "+1 (555) 123-4567",
  });

  const [orders, setOrders] = useState([
    { id: "ORD001", date: "2023-05-15", total: 129.99, status: "Delivered" },
    { id: "ORD002", date: "2023-05-20", total: 79.99, status: "Shipped" },
    { id: "ORD003", date: "2023-05-25", total: 199.99, status: "Processing" },
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the updated user data to a server
    console.log("Updated user data:", user);
    alert("Profile updated successfully!");
  };

  return (
    <main className="flex-1 container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
      <div className="border border-gray-300 rounded-lg">
        <div className="flex border-b border-gray-300">
          <button
            className="flex-1 py-2 text-center border-b-2 border-transparent hover:border-blue-500"
            data-tab="order-history"
          >
            Order History
          </button>
        </div>
        <div id="order-history" className="p-4 hidden">
          <h2 className="text-xl font-semibold mb-4">Order History</h2>
          {orders.map((order, index) => (
            <React.Fragment key={order.id}>
              {index > 0 && <hr className="my-4" />}
              <div className="flex justify-between items-center py-2">
                <div>
                  <p className="font-semibold">Order ID: {order.id}</p>
                  <p className="text-sm text-gray-500">Date: {order.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">${order.total.toFixed(2)}</p>
                  <p className="text-sm text-gray-500">
                    Status: {order.status}
                  </p>
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
      <script>
        {`
          document.querySelectorAll('[data-tab]').forEach(tab => {
            tab.addEventListener('click', () => {
              document.querySelectorAll('[id]').forEach(content => {
                content.classList.add('hidden');
              });
              document.getElementById(tab.dataset.tab).classList.remove('hidden');
            });
          });
        `}
      </script>
    </main>
  );
}
