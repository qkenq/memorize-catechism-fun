import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function QuizManagement() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [visibleText, setVisibleText] = useState("");
  const [gapText, setGapText] = useState("");
  const [inputMethod, setInputMethod] = useState<"drag" | "type">("type");
  const [previewQuiz, setPreviewQuiz] = useState<any>(null);

  // Fetch quizzes
  const { data: quizzes, isLoading } = useQuery({
    queryKey: ['quizzes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quizzes')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

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

      // Reset form
      setTitle("");
      setVisibleText("");
      setGapText("");
      setInputMethod("type");
    } catch (error) {
      console.error("Error creating quiz:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create quiz. Please try again.",
      });
    }
  };

  const QuizPreview = ({ quiz }: { quiz: any }) => {
    return (
      <div className="space-y-4">
        <h3 className="font-medium">Visible Text:</h3>
        <ul className="list-disc pl-6">
          {quiz.visible_text.map((text: string, index: number) => (
            <li key={index}>{text}</li>
          ))}
        </ul>
        
        <h3 className="font-medium">Gap Text:</h3>
        <ul className="list-disc pl-6">
          {quiz.gap_text.map((text: string, index: number) => (
            <li key={index}>{text}</li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="container max-w-4xl py-8">
      <h1 className="text-2xl font-bold mb-6">Quiz Management</h1>
      
      <div className="space-y-8">
        {/* Create Quiz Form */}
        <div className="bg-card p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Create New Quiz</h2>
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

        {/* Quiz List */}
        <div className="bg-card p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Created Quizzes</h2>
          {isLoading ? (
            <p>Loading quizzes...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {quizzes?.map((quiz) => (
                  <TableRow key={quiz.id}>
                    <TableCell>{quiz.title}</TableCell>
                    <TableCell>{quiz.type}</TableCell>
                    <TableCell>{new Date(quiz.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setPreviewQuiz(quiz)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      {/* Preview Dialog */}
      <Dialog open={!!previewQuiz} onOpenChange={() => setPreviewQuiz(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{previewQuiz?.title}</DialogTitle>
          </DialogHeader>
          {previewQuiz && <QuizPreview quiz={previewQuiz} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}