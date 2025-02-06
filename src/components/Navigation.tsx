import { Home, Book, Trophy, Menu, LogOut, User, RefreshCw } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
    navigate("/");
  };

  const handleResetProgress = async () => {
    const user = await supabase.auth.getUser();
    if (!user.data.user) {
      toast.error("You must be logged in to reset progress");
      return;
    }

    // Delete all progress records for the current user
    const { error } = await supabase
      .from('progress')
      .delete()
      .eq('user_id', user.data.user.id);

    if (error) {
      console.error("Error resetting progress:", error);
      toast.error("Failed to reset progress");
      return;
    }

    // Reset XP and streak in profile
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        xp: 0,
        streak_days: 0,
        last_activity_date: null,
        level: 1
      })
      .eq('id', user.data.user.id);

    if (profileError) {
      console.error("Error resetting profile:", profileError);
      toast.error("Failed to reset profile stats");
      return;
    }

    toast.success("Progress reset successfully");
    window.location.reload(); // Refresh to show updated state
  };

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
          <div className="hidden md:flex items-center space-x-8">
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
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetProgress}
              className="flex items-center space-x-2"
            >
              <RefreshCw size={16} />
              <span>Reset Progress</span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center space-x-2 text-brand-600 hover:text-brand-800 transition-colors">
                <User size={18} />
                <span>Profile</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => navigate("/profile")}>
                  Edit Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
            <button
              onClick={handleResetProgress}
              className="flex items-center space-x-2 w-full px-4 py-3 text-brand-600 hover:text-brand-800 hover:bg-gray-50 rounded-md"
            >
              <RefreshCw size={18} />
              <span>Reset Progress</span>
            </button>
            <Link
              to="/profile"
              className="flex items-center space-x-2 px-4 py-3 text-brand-600 hover:text-brand-800 hover:bg-gray-50 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              <User size={18} />
              <span>Profile</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 w-full px-4 py-3 text-brand-600 hover:text-brand-800 hover:bg-gray-50 rounded-md"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};