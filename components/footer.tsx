import Link from "next/link"
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Bilaspur Agrawal Sabha</h3>
            <p className="text-gray-300 text-sm">
              Serving the Agrawal community in Bilaspur with dedication and commitment to preserve our culture and
              traditions.
            </p>
            
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white">
                  हमारे बारे में
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-gray-300 hover:text-white">
                  कार्यक्रम
                </Link>
              </li>
              <li>
                <Link href="/members" className="text-gray-300 hover:text-white">
                  समाज लिस्ट
                </Link>
              </li>
              <li>
                <Link href="/committees" className="text-gray-300 hover:text-white">
                  सभा / समितियां
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white">
                  संपर्क करें
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/membership" className="text-gray-300 hover:text-white">
                  Membership
                </Link>
              </li>
              <li>
                <Link href="/community-support" className="text-gray-300 hover:text-white">
                  Community Support
                </Link>
              </li>
              <li>
                <Link href="/cultural-programs" className="text-gray-300 hover:text-white">
                  Cultural Programs
                </Link>
              </li>
              <li>
                <Link href="/business-directory" className="text-gray-300 hover:text-white">
                  Business Directory
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center">
                <MapPin size={16} className="mr-2" />
                <span className="text-gray-300">Bilaspur, Chhattisgarh</span>
              </div>
              <div className="flex items-center">
                <Phone size={16} className="mr-2" />
                 <div className="flex items-start gap-2">
                <span className="text-gray-300">+91 9826517676</span>
                <span className="text-gray-300">|</span>
                <span className="text-gray-300">+91 9827924200</span>
                </div>
              </div>
              <div className="flex items-center">
                <Mail size={16} className="mr-2" />
                <span className="text-gray-300">dmodi6@gmail.com</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-gray-300 hover:text-white">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <Instagram size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-300">
          <p>&copy; 2025 Bilaspur Agrawal Sabha. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
