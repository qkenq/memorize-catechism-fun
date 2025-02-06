import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

export default function QuizManagement() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [visibleText, setVisibleText] = useState("");
  const [gapText, setGapText] = useState("");
  const [inputMethod, setInputMethod] = useState<"drag" | "type">("type");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("User not authenticated");
      }

      const { error } = await supabase.from("quizzes").insert({
        title,
        type: "fill_in_blank",
        visible_text: visibleText.split("\n").filter(text => text.trim()),
        gap_text: gapText.split("\n").filter(text => text.trim()),
        created_by: user.id
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Quiz created successfully",
      });

      navigate("/lords-days/1");
    } catch (error) {
      console.error("Error creating quiz:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create quiz. Please try again.",
      });
    }
  };

  return (
    <div className="container max-w-2xl py-8">
      <h1 className="text-2xl font-bold mb-6">Create New Quiz</h1>
      
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
          <Label htmlFor="visibleText">Visible Text (one per line)</Label>
          <Textarea
            id="visibleText"
            value={visibleText}
            onChange={(e) => setVisibleText(e.target.value)}
            placeholder="Enter the visible parts of the text"
            className="min-h-[100px]"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="gapText">Gap Text (one per line)</Label>
          <Textarea
            id="gapText"
            value={gapText}
            onChange={(e) => setGapText(e.target.value)}
            placeholder="Enter the text for the gaps"
            className="min-h-[100px]"
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Input Method</Label>
          <RadioGroup
            value={inputMethod}
            onValueChange={(value) => setInputMethod(value as "drag" | "type")}
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="type" id="type" />
              <Label htmlFor="type">Type Answer</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="drag" id="drag" />
              <Label htmlFor="drag">Drag and Drop</Label>
            </div>
          </RadioGroup>
        </div>

        <Button type="submit" className="w-full">
          Create Quiz
        </Button>
      </form>
    </div>
  );
}