interface QuizDataPreviewProps {
  quiz: any;
}

export const QuizDataPreview = ({ quiz }: QuizDataPreviewProps) => {
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