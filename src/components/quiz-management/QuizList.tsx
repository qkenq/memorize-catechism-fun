import { Eye, PlayCircle, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface QuizListProps {
  quizzes: any[];
  onPreview: (quiz: any, showStudentView: boolean) => void;
  onEdit: (quiz: any) => void;
}

export const QuizList = ({ quizzes, onPreview, onEdit }: QuizListProps) => {
  return (
    <div className="bg-card p-6 rounded-lg border">
      <h2 className="text-xl font-semibold mb-4">Created Quizzes</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="w-[180px]">Actions</TableHead>
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
                    onClick={() => onPreview(quiz, false)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onPreview(quiz, true)}
                  >
                    <PlayCircle className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(quiz)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};