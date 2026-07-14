import { NextResponse } from "next/server";
import { TEMPLATES } from "@/lib/templates-registry";
import { corsPreflight, withCors } from "@/lib/cors";

export const dynamic = "force-dynamic";

/**
 * GET /api/templates/categories
 *
 * Returns the distinct set of categories with counts, sorted by count
 * descending. Mirrors `api_list_template_categories` in main.py.
 */
export async function GET() {
  const counts: Record<string, number> = {};
  for (const t of TEMPLATES) {
    counts[t.category] = (counts[t.category] ?? 0) + 1;
  }

  const categories = Object.entries(counts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  return withCors(
    NextResponse.json(
      {
        status: 200,
        statusText: "OK",
        message: "Categories fetched successfully",
        data: {
          total: categories.length,
          categories,
        },
      },
      { status: 200 }
    )
  );
}

export async function OPTIONS() {
  return corsPreflight();
}
