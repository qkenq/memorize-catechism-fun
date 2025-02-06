import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface LessonEditorProps {
  lesson?: any;
  onLessonCreated?: () => void;
}

export const LessonEditor = ({ lesson, onLessonCreated }: LessonEditorProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (lesson) {
      setTitle(lesson.title);
      setContent(lesson.content);
    }
  }, [lesson]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("User not authenticated");
      }

      if (lesson) {
        // Update existing lesson
        const { error } = await supabase
          .from("lessons")
          .update({
            title,
            content,
            updated_at: new Date().toISOString()
          })
          .eq('id', lesson.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Lesson updated successfully",
        });
      } else {
        // Create new lesson
        const { error } = await supabase.from("lessons").insert({
          title,
          content,
          created_by: user.id
        });

        if (error) throw error;

        toast({
          title: "Success",
          description: "Lesson created successfully",
        });
      }

      setTitle("");
      setContent("");
      onLessonCreated?.();
    } catch (error) {
      console.error("Error saving lesson:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save lesson. Please try again.",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Lesson Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter lesson title"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Lesson Content</Label>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter the lesson content"
          className="min-h-[200px]"
          required
        />
      </div>

      <Button type="submit" className="w-full">
        {lesson ? "Update Lesson" : "Create Lesson"}
      </Button>
    </form>
  );
};