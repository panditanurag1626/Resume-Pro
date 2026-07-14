import { NextRequest, NextResponse } from "next/server";
import { TEMPLATES, type TemplateMeta } from "@/lib/templates-registry";
import { corsPreflight, withCors } from "@/lib/cors";

export const dynamic = "force-dynamic";

function withUrls(t: TemplateMeta, origin: string) {
  return {
    ...t,
    render_url: `${origin}/api/templates/${t.id}/render`,
    preview_url: `${origin}/api/templates/${t.id}/preview`,
  };
}

/**
 * GET /api/templates
 *
 * 1:1 port of `api_list_templates` from main.py. Supports:
 *   ?category=modern|classic|creative
 *   ?is_premium=true|false
 *   ?search=keyword
 *   ?page=1 &limit=10  (omit both for ALL templates)
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const category = searchParams.get("category");
  const isPremiumRaw = searchParams.get("is_premium");
  const search = (searchParams.get("search") ?? "").trim().toLowerCase();
  const pageParam = searchParams.get("page");
  const limitParam = searchParams.get("limit");

  let results: TemplateMeta[] = [...TEMPLATES];

  if (category) {
    const cat = category.toLowerCase();
    results = results.filter((t) => String(t.category).toLowerCase() === cat);
  }

  if (isPremiumRaw !== null) {
    const flag = ["true", "1", "yes"].includes(isPremiumRaw.toLowerCase());
    results = results.filter((t) => Boolean(t.is_premium) === flag);
  }

  if (search) {
    results = results.filter((t) => {
      const name = (t.name ?? "").toLowerCase();
      const desc = (t.description ?? "").toLowerCase();
      const tags = (t.tags ?? []).map((x) => String(x).toLowerCase());
      return (
        name.includes(search) ||
        desc.includes(search) ||
        tags.some((tag) => tag.includes(search))
      );
    });
  }

  const total = results.length;

  let page = 1;
  let limit = total;
  let pages = 1;
  let paginated = results;

  if (pageParam !== null || limitParam !== null) {
    page = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);
    limit = Math.max(1, parseInt(limitParam ?? "10", 10) || 10);
    const start = (page - 1) * limit;
    paginated = results.slice(start, start + limit);
    pages = Math.max(1, Math.ceil(total / limit));
  }

  const response = withCors(
    NextResponse.json(
      {
        status: 200,
        statusText: "OK",
        message: "Templates fetched successfully",
        data: {
          total,
          page,
          limit,
          pages,
          templates: paginated.map((t) => withUrls(t, origin)),
        },
      },
      { status: 200 }
    )
  );
  response.headers.set("Cache-Control", "public, max-age=3600, stale-while-revalidate=86400");
  return response;
}

export async function OPTIONS() {
  return corsPreflight();
}
