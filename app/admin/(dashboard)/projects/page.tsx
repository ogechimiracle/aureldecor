import { Suspense } from "react";
import { ProjectsList } from "@/components/admin/projects-list";
import { listCategories } from "@/server/services/categories";
import { listAdminProjects } from "@/server/services/projects";
import { projectListQuerySchema } from "@/server/validators/project";

export const metadata = { title: "Projects" };

interface SearchParams {
  q?: string;
  category?: string;
  status?: string;
  page?: string;
}

export default async function AdminProjectsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const parsed = projectListQuerySchema.safeParse({
    q: params.q || undefined,
    category: params.category || undefined,
    status: params.status ?? undefined,
    page: params.page ?? undefined,
  });

  const query = parsed.success
    ? parsed.data
    : projectListQuerySchema.parse({});

  const [result, categories] = await Promise.all([
    listAdminProjects(query),
    listCategories(),
  ]);

  return (
    <Suspense>
      <ProjectsList
        items={result.items}
        total={result.total}
        page={result.page}
        pageCount={result.pageCount}
        categories={categories}
        query={query}
      />
    </Suspense>
  );
}
