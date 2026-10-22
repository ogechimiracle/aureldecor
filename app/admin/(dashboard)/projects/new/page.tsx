import { ProjectForm } from "@/components/admin/project-form";
import { listCategories } from "@/server/services/categories";

export const metadata = { title: "New Project" };

export default async function NewProjectPage() {
  const categories = await listCategories();

  return (
    <ProjectForm
      categories={categories.map((category) => ({
        id: category.id,
        name: category.name,
      }))}
    />
  );
}
