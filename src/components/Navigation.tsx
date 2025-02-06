import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, RefreshCw, Shield, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [session, setSession] = useState<any>(null);
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Session loaded:", session?.user?.id);
      setSession(session);
      if (session?.user) {
        checkAdminStatus(session.user.id);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth state changed:", session?.user?.id);
      setSession(session);
      if (session?.user) {
        checkAdminStatus(session.user.id);
      } else {
        setIsAdmin(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAdminStatus = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error("Error checking admin status:", error);
      return;
    }
    
    console.log("User role:", data?.role);
    setIsAdmin(data?.role === 'admin');
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to log out"
      });
    } else {
      setSession(null);
      setIsAdmin(false);
      queryClient.clear();
      navigate('/auth');
      toast({
        title: "Success",
        description: "Logged out successfully"
      });
    }
  };

  const handleResetProgress = async () => {
    if (!session?.user) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in to reset progress"
      });
      return;
    }

    const { error } = await supabase
      .from('progress')
      .delete()
      .eq('user_id', session.user.id);

    if (error) {
      console.error("Error resetting progress:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to reset progress"
      });
      return;
    }

    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        xp: 0,
        streak_days: 0,
        last_activity_date: null,
        level: 1
      })
      .eq('id', session.user.id);

    if (profileError) {
      console.error("Error resetting profile:", profileError);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to reset profile stats"
      });
      return;
    }

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
    ...(session ? [
      { to: "/dashboard", label: "Dashboard" },
      { to: "/profile", label: "Profile" },
    ] : []),
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
      {session && (
        <>
          <Button
            variant="outline"
            size="sm"
            onClick={handleResetProgress}
            className="ml-3"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset Progress
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="ml-3"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </>
      )}
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
                onClick={() => setIsOpen(!isOpen)}
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