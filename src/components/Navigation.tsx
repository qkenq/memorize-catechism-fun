
import { Home, Book, Trophy, Menu } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Book, label: "Lord's Days", path: "/lords-days" },
    { icon: Trophy, label: "Leaderboard", path: "/leaderboard" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-semibold text-brand-800">HC Memorize</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                className="flex items-center space-x-2 text-brand-600 hover:text-brand-800 transition-colors"
              >
                <item.icon size={18} />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-md text-brand-600 hover:text-brand-800 hover:bg-gray-100"
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 animate-fade-in">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                className="flex items-center space-x-2 px-4 py-3 text-brand-600 hover:text-brand-800 hover:bg-gray-50 rounded-md"
                onClick={() => setIsOpen(false)}
              >
                <item.icon size={18} />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};
