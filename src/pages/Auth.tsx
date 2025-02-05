import { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [session, setSession] = useState<any>(null);
  const { toast } = useToast();
  const location = useLocation();

  // If user came from somewhere else, store that location
  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // If user is already logged in, redirect them back to where they came from
  if (session) {
    return <Navigate to={from} replace />;
  }

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = isSignUp
        ? await supabase.auth.signUp({
            email,
            password,
          })
        : await supabase.auth.signInWithPassword({
            email,
            password,
          });

      if (error) throw error;

      toast({
        title: isSignUp ? "Welcome!" : "Welcome back!",
        description: isSignUp
          ? "Your account has been created successfully."
          : "You have been signed in successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loginWithTestAccount = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: "test@example.com",
        password: "test123456",
      });

      if (error) throw error;

      toast({
        title: "Welcome!",
        description: "You have been signed in with the test account.",
      });
    } catch (error: any) {
      // If the test account doesn't exist, create it
      if (error.message.includes("Invalid login credentials")) {
        try {
          const { error: signUpError } = await supabase.auth.signUp({
            email: "test@example.com",
            password: "test123456",
          });

          if (signUpError) throw signUpError;

          toast({
            title: "Test Account Created",
            description: "The test account has been created and you're now signed in.",
          });
        } catch (signUpError: any) {
          toast({
            title: "Error",
            description: signUpError.message,
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50 to-white">
      <Navigation />
      
      <main className="pt-24 px-4">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold text-brand-900 text-center mb-8">
            {isSignUp ? "Create an Account" : "Welcome Back"}
          </h1>

          <Button
            onClick={loginWithTestAccount}
            className="w-full mb-6"
            variant="secondary"
            disabled={loading}
          >
            {loading ? "Loading..." : "Use Test Account"}
          </Button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground">
                Or continue with email
              </span>
            </div>
          </div>

          <form onSubmit={handleAuth} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Loading..." : isSignUp ? "Sign Up" : "Sign In"}
            </Button>

            <p className="text-center text-sm text-brand-600">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-brand-900 hover:underline"
              >
                {isSignUp ? "Sign In" : "Sign Up"}
              </button>
            </p>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Auth;