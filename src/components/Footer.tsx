import React from "react";
import Link from "next/link";
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";

const Footer: React.FC = () => {
  return (
    <footer className="bg-blue-600 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center text-white">
        <div>
          <h6 className="text-lg font-semibold">E-Shop</h6>
          <p className="text-sm">
            &copy; 2024 Your Company. All rights reserved.
          </p>
        </div>

        <div>
          <h6 className="text-lg font-semibold mb-2">Follow Us</h6>
          <div className="flex justify-center space-x-4">
            {/* 使用 Link 包裹 Icon */}
            <Link href="#" aria-label="Facebook" passHref legacyBehavior>
              <a>
                <FaFacebook className="w-6 h-6 hover:text-gray-300" />
              </a>
            </Link>
            <Link href="#" aria-label="Instagram" passHref legacyBehavior>
              <a>
                <FaInstagram className="w-6 h-6 hover:text-gray-300" />
              </a>
            </Link>
            <Link href="#" aria-label="Twitter" passHref legacyBehavior>
              <a>
                <FaTwitter className="w-6 h-6 hover:text-gray-300" />
              </a>
            </Link>
            <Link href="#" aria-label="LinkedIn" passHref legacyBehavior>
              <a>
                <FaLinkedin className="w-6 h-6 hover:text-gray-300" />
              </a>
            </Link>
          </div>
        </div>

        <div>
          <h6 className="text-lg font-semibold mb-2">Quick Links</h6>
          <Link href="#" passHref legacyBehavior>
            <a className="block text-sm hover:text-gray-300">Privacy Policy</a>
          </Link>
          <Link href="#" passHref legacyBehavior>
            <a className="block text-sm hover:text-gray-300">
              Terms of Service
            </a>
          </Link>
          <Link href="#" passHref legacyBehavior>
            <a className="block text-sm hover:text-gray-300">Contact Us</a>
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
