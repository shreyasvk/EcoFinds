import React from "react";

const Footer = () => (
  <footer className="bg-gray-900 text-white mt-auto">
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="font-bold mb-2">Get to Know Us</h3>
          <ul className="space-y-2">
            <li>
              <a href="#" className="hover:underline">
                Careers
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                About Us
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Investor Relations
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold mb-2">Make Money with Us</h3>
          <ul className="space-y-2">
            <li>
              <a href="#" className="hover:underline">
                Sell Products
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Become an Affiliate
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Advertise Your Products
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold mb-2">Payment Products</h3>
          <ul className="space-y-2">
            <li>
              <a href="#" className="hover:underline">
                Business Card
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Shop with Points
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Reload Your Balance
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold mb-2">Let Us Help You</h3>
          <ul className="space-y-2">
            <li>
              <a href="#" className="hover:underline">
                Your Account
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Your Orders
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Shipping Rates & Policies
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="mt-8 text-center text-sm">
        &copy; 2024 EcoFinds. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
