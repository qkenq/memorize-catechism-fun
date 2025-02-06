import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface LessonListProps {
  lessons: any[];
  onEdit: (lesson: any) => void;
}

export const LessonList = ({ lessons, onEdit }: LessonListProps) => {
  return (
    <div className="bg-card p-6 rounded-lg border">
      <h2 className="text-xl font-semibold mb-4">Created Lessons</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {lessons?.map((lesson) => (
            <TableRow key={lesson.id}>
              <TableCell>{lesson.title}</TableCell>
              <TableCell>{new Date(lesson.created_at).toLocaleDateString()}</TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(lesson)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};