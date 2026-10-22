import { CategoryManager } from "@/components/admin/category-manager";
import { listCategories } from "@/server/services/categories";

export const metadata = { title: "Categories" };

export default async function AdminCategoriesPage() {
  const categories = await listCategories();

  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow text-terracotta">Portfolio</p>
        <h1 className="mt-2 font-serif text-3xl sm:text-4xl">Categories</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft">
          Categories group projects into the filters shown on the public
          portfolio page. A category with projects attached cannot be deleted
          until those projects are recategorised.
        </p>
      </div>

      <CategoryManager
        categories={categories.map((category) => ({
          id: category.id,
          name: category.name,
          slug: category.slug,
          description: category.description,
          sortOrder: category.sortOrder,
          projectCount: category.projectCount,
        }))}
      />
    </div>
  );
}
