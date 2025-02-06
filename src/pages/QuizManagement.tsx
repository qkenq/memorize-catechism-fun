import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { QuizPreview } from "@/components/quiz-preview/QuizPreview";
import { QuizEditor } from "@/components/quiz-editor/QuizEditor";
import { LessonEditor } from "@/components/lesson-editor/LessonEditor";
import { QuizList } from "@/components/quiz-management/QuizList";
import { LessonList } from "@/components/quiz-management/LessonList";
import { QuizDataPreview } from "@/components/quiz-management/QuizDataPreview";
import { supabase } from "@/integrations/supabase/client";

export default function QuizManagement() {
  const [previewQuiz, setPreviewQuiz] = useState<any>(null);
  const [showStudentPreview, setShowStudentPreview] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<any>(null);
  const [editingLesson, setEditingLesson] = useState<any>(null);

  const { data: quizzes, isLoading: quizzesLoading, refetch: refetchQuizzes } = useQuery({
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

  const { data: lessons, isLoading: lessonsLoading, refetch: refetchLessons } = useQuery({
    queryKey: ['lessons'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const handlePreviewQuiz = (quiz: any, studentView: boolean) => {
    setPreviewQuiz(quiz);
    setShowStudentPreview(studentView);
  };

  const handleEditQuiz = (quiz: any) => {
    setEditingQuiz(quiz);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEditLesson = (lesson: any) => {
    setEditingLesson(lesson);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container max-w-4xl py-8">
      <h1 className="text-2xl font-bold mb-6">Content Management</h1>
      
      <Tabs defaultValue="quizzes" className="space-y-8">
        <TabsList>
          <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
          <TabsTrigger value="lessons">Lessons</TabsTrigger>
        </TabsList>

        <TabsContent value="quizzes" className="space-y-8">
          <div className="bg-card p-6 rounded-lg border">
            <h2 className="text-xl font-semibold mb-4">
              {editingQuiz ? "Edit Quiz" : "Create New Quiz"}
            </h2>
            <QuizEditor 
              quiz={editingQuiz} 
              onQuizCreated={() => {
                refetchQuizzes();
                setEditingQuiz(null);
              }} 
            />
            {editingQuiz && (
              <Button 
                variant="outline" 
                onClick={() => setEditingQuiz(null)}
                className="mt-4"
              >
                Cancel Editing
              </Button>
            )}
          </div>

          {quizzesLoading ? (
            <p>Loading quizzes...</p>
          ) : (
            <QuizList 
              quizzes={quizzes || []}
              onPreview={handlePreviewQuiz}
              onEdit={handleEditQuiz}
            />
          )}
        </TabsContent>

        <TabsContent value="lessons" className="space-y-8">
          <div className="bg-card p-6 rounded-lg border">
            <h2 className="text-xl font-semibold mb-4">
              {editingLesson ? "Edit Lesson" : "Create New Lesson"}
            </h2>
            <LessonEditor 
              lesson={editingLesson} 
              onLessonCreated={() => {
                refetchLessons();
                setEditingLesson(null);
              }} 
            />
            {editingLesson && (
              <Button 
                variant="outline" 
                onClick={() => setEditingLesson(null)}
                className="mt-4"
              >
                Cancel Editing
              </Button>
            )}
          </div>

          {lessonsLoading ? (
            <p>Loading lessons...</p>
          ) : (
            <LessonList 
              lessons={lessons || []}
              onEdit={handleEditLesson}
            />
          )}
        </TabsContent>
      </Tabs>

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