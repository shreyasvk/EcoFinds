import React, { useContext, useEffect, useState } from "react";
import { Auth } from "../Context/Auth";
import axios from "axios";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const DashboardPage = () => {
  const { user } = useContext(Auth);
  const [totalPriceSum, setTotalPriceSum] = useState(0);
  const [buyerNames, setBuyerNames] = useState({});
  const [count, setCount] = useState(0);
  const [totalOrder, setTotalOrder] = useState(0);
  const [totalBuyer, setTotalBuyer] = useState(0);
  const [orders, setOrders] = useState([]); // State to store fetched orders

  // State for chart data
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Total Price by Category",
        data: [],
        backgroundColor: [],
        borderColor: [],
        borderWidth: 1,
      },
    ],
  });

  useEffect(() => {
    const fetchData = async () => {
      const storedUser = localStorage.getItem("User");
      const token = storedUser ? JSON.parse(storedUser).token : null;

      if (!token) {
        console.error("No token found");
        return;
      }

      try {
        const countResponse = await axios.get(
          "http://localhost:3030/api/product/count",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setCount(countResponse.data.items);

        const orderResponse = await axios.get(
          "http://localhost:3030/api/order/all",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const orders = orderResponse.data.orders;

        const categoryPriceMap = orders.reduce((cat, order) => {
          if (!cat[order.category_name]) {
            cat[order.category_name] = parseFloat(order.total_price);
          } else {
            cat[order.category_name] += parseFloat(order.total_price);
          }
          return cat;
        }, {});

        setOrders(orders); // Store the fetched orders in state
        setTotalOrder(orders.length);

        const buyerPriceMap = orders.reduce((acc, order) => {
          if (!acc[order.buyer_name]) {
            acc[order.buyer_name] = parseFloat(order.total_price);
          } else {
            acc[order.buyer_name] += parseFloat(order.total_price);
          }
          return acc;
        }, {});

        setBuyerNames(buyerPriceMap);
        setTotalBuyer(Object.keys(buyerPriceMap).length);

        const sum = orders.reduce(
          (acc, order) => acc + parseFloat(order.total_price),
          0
        );
        setTotalPriceSum(sum);

        // Transform categoryPriceMap into chart data format
        const labels = Object.keys(categoryPriceMap);
        const data = Object.values(categoryPriceMap);

        // Generate colors for chart
        const backgroundColor = labels.map(
          (_, index) =>
            `rgba(${(index * 50) % 255}, ${(index * 100) % 255}, ${
              (index * 150) % 255
            }, 0.2)`
        );
        const borderColor = labels.map(
          (_, index) =>
            `rgba(${(index * 50) % 255}, ${(index * 100) % 255}, ${
              (index * 150) % 255
            }, 1)`
        );

        setChartData({
          labels,
          datasets: [
            {
              label: "Total Price by Category",
              data,
              backgroundColor,
              borderColor,
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-800 text-white flex flex-col">
        <div className="h-16 flex items-center justify-center text-2xl font-bold border-b border-blue-700">
          EcoFinds Dashboard
        </div>
        <nav className="flex-grow px-4 py-8 space-y-2">
          <a
            href="#"
            className="block py-2.5 px-4 rounded hover:bg-blue-700 transition duration-300"
          >
            Overview
          </a>
          <a
            href="#"
            className="block py-2.5 px-4 rounded hover:bg-blue-700 transition duration-300"
          >
            Sales
          </a>
          <a
            href="#"
            className="block py-2.5 px-4 rounded hover:bg-blue-700 transition duration-300"
          >
            Products
          </a>
          <a
            href="#"
            className="block py-2.5 px-4 rounded hover:bg-blue-700 transition duration-300"
          >
            Customers
          </a>
          <a
            href="#"
            className="block py-2.5 px-4 rounded hover:bg-blue-700 transition duration-300"
          >
            Reports
          </a>
          <a
            href="#"
            className="block py-2.5 px-4 rounded hover:bg-blue-700 transition duration-300"
          >
            Settings
          </a>
        </nav>
        <div className="p-4 border-t border-blue-700">
          <button className="w-full py-2 px-4 bg-red-500 hover:bg-red-600 text-white rounded transition duration-300">
            Logout
          </button>
        </div>
      </aside>
      <div className="flex-grow p-8 overflow-y-auto">
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-semibold text-gray-900">
            Welcome back, {user?.name}
          </h1>
          <button className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded transition duration-300">
            Create New
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-gray-800">Total Sales</h2>
            <p className="text-3xl font-bold text-blue-600 mt-4">
              <i className="fa fa-inr" />
              {totalPriceSum}
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-gray-800">
              Total Orders
            </h2>
            <p className="text-3xl font-bold text-blue-600 mt-4">
              {totalOrder}
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-gray-800">
              Active Products
            </h2>
            <p className="text-3xl font-bold text-blue-600 mt-4">{count}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-gray-800">
              New Customers
            </h2>
            <p className="text-3xl font-bold text-blue-600 mt-4">
              {totalBuyer}
            </p>
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-white p-8 rounded-lg shadow-lg mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Sales Overview
          </h2>
          <div className="w-full h-64">
            <Pie data={chartData} />
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Recent Activities
          </h2>
          <ul className="space-y-4">
            {orders.length > 0 ? (
              orders.map((order, index) => (
                <li key={index} className="flex items-center justify-between">
                  <p className="text-gray-700">
                    New order from {order.buyer_name}
                  </p>
                </li>
              ))
            ) : (
              <li>
                <p className="text-gray-700">No recent activities</p>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
