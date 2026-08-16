import { Pool } from "pg";

export interface WeddingContent {
  heroTitle: string;
  introText: string;
  invitationLabel: string;
  verse: string;
  bodyText: string;
  groomName: string;
  brideName: string;
  eventDate: string;
  eventTimeLabel: string;
  venueName: string;
  venueAddress: string;
  mapUrl: string;
  closingText: string;
  musicUrl: string;
}

export const defaultContent: WeddingContent = {
  heroTitle: "دعوة زفاف مباركة",
  introText: "حضرات الأهل والأحباب، يسعدنا تشريفكم لنا.",
  invitationLabel: "Wedding Invitation",
  verse:
    "وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً",
  bodyText:
    "ببالغ الفرح والسرور، يشرفنا نحن العائلة أن ندعوكم لحضور حفل زفافنا المبارك وكتب الكتاب، لتبقوا معنا في هذه الليلة العمرية المميزة.",
  groomName: "محمد",
  brideName: "سهيلة",
  eventDate: "2026-08-07T20:00",
  eventTimeLabel: "يوم الجمعة 7 أغسطس 2026 • الساعة 8:00 مساءً",
  venueName: "قاعة السلاملك - فندق توليب",
  venueAddress: "أمام النادي الرياضي",
  mapUrl: "https://maps.google.com",
  closingText: "بحضوركم تكتمل فرحتنا",
  musicUrl: "",
};

let pool: Pool | undefined;
let initialized = false;

function getPool() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required for wedding data storage.");
  }

  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    });
  }

  return pool;
}

async function ensureSchema() {
  if (initialized) {
    return;
  }

  const db = getPool();
  await db.query(`
    CREATE TABLE IF NOT EXISTS wedding_content (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      data JSONB NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await db.query(
    `
      INSERT INTO wedding_content (id, data, updated_at)
      VALUES (1, $1::jsonb, NOW())
      ON CONFLICT (id) DO NOTHING
    `,
    [JSON.stringify(defaultContent)],
  );

  initialized = true;
}

export async function getWeddingContent(): Promise<WeddingContent> {
  await ensureSchema();

  const result = await getPool().query<{ data: WeddingContent }>(
    "SELECT data FROM wedding_content WHERE id = 1",
  );

  const row = result.rows[0];
  if (!row) {
    return defaultContent;
  }

  return { ...defaultContent, ...row.data };
}

export async function saveWeddingContent(content: WeddingContent) {
  await ensureSchema();
  await getPool().query(
    `
      UPDATE wedding_content
      SET data = $1::jsonb, updated_at = NOW()
      WHERE id = 1
    `,
    [JSON.stringify(content)],
  );
}
