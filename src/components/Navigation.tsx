import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, RefreshCw, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    const checkAdminStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
        setIsAdmin(data?.role === 'admin');
      }
    };
    checkAdminStatus();
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleResetProgress = async () => {
    const user = await supabase.auth.getUser();
    if (!user.data.user) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in to reset progress"
      });
      return;
    }

    // Delete all progress records for the current user
    const { error } = await supabase
      .from('progress')
      .delete()
      .eq('user_id', user.data.user.id);

    if (error) {
      console.error("Error resetting progress:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to reset progress"
      });
      return;
    }

    // Reset profile stats
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
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to reset profile stats"
      });
      return;
    }

    // Invalidate all queries to force a refresh of the data
    await queryClient.invalidateQueries();

    toast({
      title: "Success",
      description: "Progress has been reset"
    });
  };

  const navItems = [
    { to: "/", label: "Home" },
    { to: "/lords-days", label: "Lord's Days" },
    { to: "/leaderboard", label: "Leaderboard" },
    { to: "/dashboard", label: "Dashboard" },
    { to: "/profile", label: "Profile" },
    ...(isAdmin ? [{ to: "/quiz-management", label: "Admin", icon: Shield }] : []),
  ];

  const renderNavItems = () => (
    <>
      {navItems.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          className="text-brand-600 hover:text-brand-900 px-3 py-2 rounded-md text-sm font-medium flex items-center"
          onClick={() => isMobile && setIsOpen(false)}
        >
          {item.icon && <item.icon className="w-4 h-4 mr-2" />}
          {item.label}
        </Link>
      ))}
      <Button
        variant="outline"
        size="sm"
        onClick={handleResetProgress}
        className="ml-3"
      >
        <RefreshCw className="w-4 h-4 mr-2" />
        Reset Progress
      </Button>
    </>
  );

  return (
    <nav className="bg-white shadow-sm fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-brand-900">
              Heidelberg
            </Link>
          </div>

          {isMobile ? (
            <>
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-brand-600 hover:text-brand-900 focus:outline-none"
              >
                {isOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>

              {isOpen && (
                <div className="absolute top-16 left-0 right-0 bg-white shadow-lg">
                  <div className="px-2 pt-2 pb-3 space-y-1">
                    {renderNavItems()}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center">
              {renderNavItems()}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};