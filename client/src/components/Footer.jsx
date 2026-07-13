import React from "react";
import { Phone, Mail } from "lucide-react";

export default function Footer() {
  return (
    <div style={{ maxWidth: "1520px" }} className="relative container mx-auto">
      <footer className="bg-gray-800 text-white py-8">
        <div className="px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            {/* Logo Section */}
            <div className="flex flex-col items-center text-center">
              <img
                className="h-16 w-auto mb-2"
                src="/assets/image/veritaz-bg-Remove.png"
                alt="Veritaz Logo"
              />

              <h3 className="text-xl font-bold mb-2 text-white">
                Veritaz International Press
              </h3>

              <p className="text-gray-400 max-w-xs">
                Empowering authors to share their stories and knowledge with the
                world.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-white">
                Quick Links
              </h3>

              <ul className="space-y-2">
                <li>
                  <a
                    href="/"
                    className="text-gray-400 hover:text-white font-semibold transition"
                  >
                    Home
                  </a>
                </li>

                <li>
                  <a
                    href="/our-company"
                    className="text-gray-400 hover:text-white font-semibold transition"
                  >
                    About Us
                  </a>
                </li>

                <li>
                  <a
                    href="/book-publishing"
                    className="text-gray-400 hover:text-white font-semibold transition"
                  >
                    Services
                  </a>
                </li>

                <li>
                  <a
                    href="/contact"
                    className="text-gray-400 hover:text-white font-semibold transition"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-white">
                Services
              </h3>

              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white font-semibold transition"
                  >
                    Editing &amp; Proofreading
                  </a>
                </li>

                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white font-semibold transition"
                  >
                    ISBN Acquisition
                  </a>
                </li>

                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white font-semibold transition"
                  >
                    Copyright Services
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-white">
                Contact Us
              </h3>

              <ul className="space-y-3">
                <li className="flex items-center text-gray-400">
                  <Phone className="w-5 h-5 mr-2" />
                  +91 6380658876
                </li>

                <li className="flex items-center text-gray-400 break-all">
                  <Mail className="w-5 h-5 mr-2 flex-shrink-0" />
                  info@veritazinternational.com
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
            <p>&copy; 2023 Veritaz International Press. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}