import { Client } from "@notionhq/client";

export const runtime = "nodejs";

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
  notionVersion: "2025-09-03",
});

function getYearRange(year: number) {
  const start = new Date(Date.UTC(year, 0, 1));
  const end = new Date(Date.UTC(year, 11, 31, 23, 59, 59));
  return { start: start.toISOString(), end: end.toISOString() };
}

export async function GET() {
  try {
    const year = new Date().getFullYear();
    const { start, end } = getYearRange(year);

    // 1️⃣ 데이터베이스에서 data_source_id 추출 (신버전 API 구조)
    const db: any = await notion.databases.retrieve({
      database_id: process.env.NOTION_DB_ID!,
    });

    const dataSourceId =
      db?.data_sources?.[0]?.id ||
      db?.data_sources?.[0]?.data_source_id;

    if (!dataSourceId) {
      return Response.json(
        { error: "data_source_id를 찾을 수 없음. DB가 integration에 공유되었는지 확인." },
        { status: 500 }
      );
    }

    let cursor: string | undefined = undefined;
    let total = 0;

    while (true) {
      const res: any = await notion.dataSources.query({
        data_source_id: dataSourceId,
        start_cursor: cursor,
        page_size: 100,
        filter: {
          and: [
            // 📅 올해 기간 필터
            { property: "period", date: { on_or_after: start } },
            { property: "period", date: { on_or_before: end } },

            // 💚 완독만 (formula 텍스트이므로 rich_text + contains 사용)
            { property: "menow", rich_text: { contains: "완독" } },
          ],
        },
      });

      for (const page of res.results ?? []) {
        total += page.properties?.["read page"]?.number ?? 0;
      }

      if (!res.has_more) break;
      cursor = res.next_cursor ?? undefined;
    }

    return Response.json({ year, total });
  } catch (error: any) {
    return Response.json(
      { error: error?.message || "Unknown error" },
      { status: 500 }
    );
  }
}