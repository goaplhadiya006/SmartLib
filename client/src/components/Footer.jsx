import React from 'react';
import { Link } from 'react-router-dom';
import { Library, Heart, Mail, Phone, MapPin, Github, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="p-2 bg-gradient-to-tr from-indigo-500 to-violet-500 rounded-xl text-white">
                <Library className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-white">
                Smart<span className="text-indigo-400">Lib</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Empowering learners, researchers, and book lovers worldwide with seamless digital library management, instant borrowing, and an extensive catalog of knowledge.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="#" className="p-2.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-indigo-600 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="p-2.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-indigo-600 transition-colors">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="p-2.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-indigo-600 transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-white text-base mb-4">Quick Links</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link to="/" className="hover:text-indigo-400 transition-colors">Home Landing</Link>
              </li>
              <li>
                <Link to="/books" className="hover:text-indigo-400 transition-colors">Browse Books</Link>
              </li>
              <li>
                <Link to="/categories" className="hover:text-indigo-400 transition-colors">Book Categories</Link>
              </li>
              <li>
                <Link to="/feedback" className="hover:text-indigo-400 transition-colors">User Feedback</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-indigo-400 transition-colors">Contact Support</Link>
              </li>
            </ul>
          </div>

          {/* Account Services */}
          <div>
            <h4 className="font-bold text-white text-base mb-4">Account Services</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link to="/my-borrowed" className="hover:text-indigo-400 transition-colors">My Borrowed Books</Link>
              </li>
              <li>
                <Link to="/borrow-history" className="hover:text-indigo-400 transition-colors">Borrowing History</Link>
              </li>
              <li>
                <Link to="/wishlist" className="hover:text-indigo-400 transition-colors">Saved Wishlist</Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-indigo-400 transition-colors">Profile Settings</Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-indigo-400 transition-colors">Portal Login</Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="font-bold text-white text-base mb-4">Contact Info</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-indigo-400 shrink-0 mt-1" />
                <span>100 Knowledge Ave, Science Park, NY 10001</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>+1 (800) 555-BOOK</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>support@smartlib.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} SmartLib Online Library System. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" /> using React, Node.js & MongoDB
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
