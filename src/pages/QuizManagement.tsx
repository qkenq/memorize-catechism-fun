import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Eye, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { QuizPreview } from "@/components/quiz-preview/QuizPreview";
import { QuizEditor } from "@/components/quiz-editor/QuizEditor";
import { supabase } from "@/integrations/supabase/client";

export default function QuizManagement() {
  const [previewQuiz, setPreviewQuiz] = useState<any>(null);
  const [showStudentPreview, setShowStudentPreview] = useState(false);

  // Fetch quizzes
  const { data: quizzes, isLoading, refetch } = useQuery({
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

  const QuizDataPreview = ({ quiz }: { quiz: any }) => {
    return (
      <div className="space-y-4">
        <h3 className="font-medium">Content:</h3>
        <p className="whitespace-pre-wrap">{quiz.full_text || quiz.visible_text.join('\n')}</p>
        
        <h3 className="font-medium">Gaps:</h3>
        <ul className="list-disc pl-6">
          {(quiz.gaps || quiz.gap_text).map((gap: any, index: number) => (
            <li key={index}>{typeof gap === 'string' ? gap : gap.answer}</li>
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
          <QuizEditor onQuizCreated={refetch} />
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
                  <TableHead className="w-[140px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {quizzes?.map((quiz) => (
                  <TableRow key={quiz.id}>
                    <TableCell>{quiz.title}</TableCell>
                    <TableCell>{quiz.type}</TableCell>
                    <TableCell>{new Date(quiz.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setPreviewQuiz(quiz);
                            setShowStudentPreview(false);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setPreviewQuiz(quiz);
                            setShowStudentPreview(true);
                          }}
                        >
                          <PlayCircle className="h-4 w-4" />
                        </Button>
                      </div>
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
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {showStudentPreview ? "Student Preview" : "Quiz Content"} - {previewQuiz?.title}
            </DialogTitle>
          </DialogHeader>
          {previewQuiz && (
            showStudentPreview ? (
              <QuizPreview quiz={previewQuiz} />
            ) : (
              <QuizDataPreview quiz={previewQuiz} />
            )
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}