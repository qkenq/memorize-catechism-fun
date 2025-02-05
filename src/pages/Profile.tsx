
import { Navigation } from "@/components/Navigation";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useQuery } from "@tanstack/react-query";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  age: z.number().min(13, "You must be at least 13 years old").max(120, "Invalid age"),
  level: z.number().min(1).max(3),
  display_name: z.string().min(2, "Display name must be at least 2 characters"),
});

const Profile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserId(session?.user?.id || null);
    });
  }, []);

  const { data: profile, refetch } = useQuery({
    queryKey: ["profile", userId],
    queryFn: async () => {
      if (!userId) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: profile?.username || "",
      age: profile?.age || undefined,
      level: profile?.level || 1,
      display_name: profile?.display_name || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!userId) return;
    setLoading(true);

    try {
      const { error } = await supabase
        .from("profiles")
        .upsert({
          id: userId,
          username: values.name,
          age: values.age,
          level: values.level,
          display_name: values.display_name,
        });

      if (error) throw error;
      
      toast.success("Profile updated successfully");
      refetch();
    } catch (error) {
      toast.error("Error updating profile");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!userId) {
    navigate("/auth");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50 to-white">
      <Navigation />
      <main className="container mx-auto pt-24 px-4">
        <div className="max-w-lg mx-auto">
          <h1 className="text-3xl font-bold text-brand-900 mb-8">Profile</h1>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Your username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="display_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your display name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Your age" 
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Level</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min={1} 
                        max={3} 
                        placeholder="Your level (1-3)" 
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save Profile"}
              </Button>
            </form>
          </Form>
        </div>
      </main>
    </div>
  );
};

export default Profile;

