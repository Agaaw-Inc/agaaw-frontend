export type Blog = {
  id: number;
  author_id: number;
  author_name: string;
  author_role: "mentor" | "admin" | "student";
  title: string;
  content: string;
  tags: string[];
  is_published: boolean;
  created_at: string;
};