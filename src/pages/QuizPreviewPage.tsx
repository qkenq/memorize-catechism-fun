import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { QuizPreview } from "@/components/quiz-preview/QuizPreview";
import { QuizDataPreview } from "@/components/quiz-management/QuizDataPreview";
import { supabase } from "@/integrations/supabase/client";

export default function QuizPreviewPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode');
  const [quiz, setQuiz] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const { data, error } = await supabase
          .from('quizzes')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setQuiz(data);
      } catch (error) {
        console.error('Error fetching quiz:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [id]);

  if (loading) {
    return <div className="container max-w-6xl py-8">Loading...</div>;
  }

  if (!quiz) {
    return <div className="container max-w-6xl py-8">Quiz not found</div>;
  }

  return (
    <div className="container max-w-6xl py-8">
      {mode === 'student' ? (
        <QuizPreview quiz={quiz} />
      ) : (
        <QuizDataPreview quiz={quiz} />
      )}
    </div>
  );
} 