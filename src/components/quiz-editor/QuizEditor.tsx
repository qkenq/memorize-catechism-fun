import React, { useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface QuizEditorProps {
  onQuizCreated?: () => void;
}

export const QuizEditor = ({ onQuizCreated }: QuizEditorProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { toast } = useToast();

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const processGaps = (text: string) => {
    const gapRegex = /\[\[(.*?)\]\]/g;
    const gaps = [];
    const matches = text.matchAll(gapRegex);
    
    for (const match of matches) {
      gaps.push({
        answer: match[1],
        start_index: match.index,
        end_index: match.index! + match[0].length,
        input_type: 'drag_and_drop'
      });
    }
    
    return {
      extracted_text: text.replace(gapRegex, '_____'),
      gaps
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("User not authenticated");
      }

      const { extracted_text, gaps } = processGaps(content);

      const { error } = await supabase.from("quizzes").insert({
        title,
        full_text: content,
        gaps,
        type: "fill_in_blank",
        visible_text: [extracted_text],
        gap_text: gaps.map(g => g.answer),
        created_by: user.id
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Quiz created successfully",
      });

      setTitle("");
      setContent("");
      onQuizCreated?.();
    } catch (error) {
      console.error("Error creating quiz:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create quiz. Please try again.",
      });
    }
  };

  const renderPreview = useCallback(() => {
    const { extracted_text, gaps } = processGaps(content);
    return (
      <div className="p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium mb-2">Preview:</h3>
        <p className="whitespace-pre-wrap">{extracted_text}</p>
        {gaps.length > 0 && (
          <div className="mt-4">
            <h4 className="font-medium mb-2">Gaps:</h4>
            <ul className="list-disc pl-6">
              {gaps.map((gap, index) => (
                <li key={index}>{gap.answer}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }, [content]);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Quiz Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter quiz title"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Quiz Content</Label>
        <p className="text-sm text-gray-500 mb-2">
          Use [[double brackets]] to mark gaps. Example: "The sky is [[blue]]."
        </p>
        <Textarea
          id="content"
          value={content}
          onChange={handleContentChange}
          placeholder="Enter the quiz content with [[gaps]]"
          className="min-h-[200px] font-mono"
          required
        />
      </div>

      {content && renderPreview()}

      <Button type="submit" className="w-full">
        Create Quiz
      </Button>
    </form>
  );
};