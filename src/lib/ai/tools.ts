/**
 * AI Agent Tools — Database access functions for the intelligence system.
 * These are the "hands" of the agent — it uses these to search, retrieve,
 * and cross-reference data from the entire His Voice database.
 */

import { db } from "@/lib/db";

export interface ToolResult {
  tool: string;
  data: unknown;
  summary: string;
}

// ============================================================
// SEARCH TOOLS
// ============================================================

/** Search scenes by keyword in title, subtitle, or era */
export async function searchScenes(query: string, limit = 10): Promise<ToolResult> {
  const scenes = await db.scene.findMany({
    where: {
      OR: [
        { title: { contains: query } },
        { subtitle: { contains: query } },
        { era: { contains: query } },
        { slug: { contains: query.toLowerCase().replace(/\s+/g, "-") } },
      ],
    },
    include: {
      act: { select: { number: true, title: true } },
      accounts: { select: { gospel: true, reference: true } },
      location: { select: { label: true } },
      _count: { select: { jesusWords: true, fulfillments: true, sourceParallels: true } },
    },
    take: limit,
    orderBy: { sortOrder: "asc" },
  });

  return {
    tool: "searchScenes",
    data: scenes.map((s) => ({
      slug: s.slug,
      title: s.title,
      subtitle: s.subtitle,
      dateApprox: s.dateApprox,
      act: `Act ${s.act.number}: ${s.act.title}`,
      convergenceScore: s.convergenceScore,
      gospels: s.accounts.map((a) => `${a.gospel} (${a.reference})`),
      location: s.location?.label,
      jesusWordsCount: s._count.jesusWords,
      prophecyLinks: s._count.fulfillments,
      externalSources: s._count.sourceParallels,
    })),
    summary: `Found ${scenes.length} scenes matching "${query}"`,
  };
}

/** Search prophecies by keyword */
export async function searchProphecies(query: string, limit = 10): Promise<ToolResult> {
  const prophecies = await db.prophecy.findMany({
    where: {
      OR: [
        { label: { contains: query } },
        { reference: { contains: query } },
        { textKjv: { contains: query } },
      ],
    },
    include: {
      fulfillments: {
        include: { scene: { select: { slug: true, title: true } } },
      },
    },
    take: limit,
  });

  return {
    tool: "searchProphecies",
    data: prophecies.map((p) => ({
      slug: p.slug,
      label: p.label,
      reference: p.reference,
      dateWritten: p.dateWritten,
      textKjv: p.textKjv,
      fulfillmentType: p.fulfillmentType,
      probabilityNote: p.probabilityNote,
      fulfilledIn: p.fulfillments.map((f) => f.scene.title),
    })),
    summary: `Found ${prophecies.length} prophecies matching "${query}"`,
  };
}

/** Search world sources by keyword, optionally filter by tradition */
export async function searchSources(query: string, categoryCode?: string, limit = 10): Promise<ToolResult> {
  const sources = await db.worldSource.findMany({
    where: {
      AND: [
        categoryCode ? { category: { code: categoryCode } } : {},
        {
          OR: [
            { title: { contains: query } },
            { content: { contains: query } },
            { type: { contains: query } },
          ],
        },
      ],
    },
    include: {
      category: { select: { code: true, name: true } },
      _count: { select: { parallels: true } },
    },
    take: limit,
  });

  return {
    tool: "searchSources",
    data: sources.map((s) => ({
      slug: s.slug,
      title: s.title,
      tradition: `${s.category.code}. ${s.category.name}`,
      type: s.type,
      date: s.date,
      content: s.content,
      reliability: s.reliability,
      parallelCount: s._count.parallels,
    })),
    summary: `Found ${sources.length} sources matching "${query}"${categoryCode ? ` in category ${categoryCode}` : ""}`,
  };
}

/** Get sources that are linked to a specific scene */
export async function getSourcesForScene(sceneSlug: string): Promise<ToolResult> {
  const scene = await db.scene.findUnique({
    where: { slug: sceneSlug },
    include: {
      sourceParallels: {
        include: {
          source: { include: { category: { select: { code: true, name: true } } } },
        },
      },
    },
  });

  if (!scene) return { tool: "getSourcesForScene", data: [], summary: `Scene "${sceneSlug}" not found` };

  return {
    tool: "getSourcesForScene",
    data: scene.sourceParallels.map((sp) => ({
      sourceTitle: sp.source.title,
      tradition: `${sp.source.category.code}. ${sp.source.category.name}`,
      type: sp.source.type,
      date: sp.source.date,
      content: sp.source.content,
      reliability: sp.source.reliability,
      note: sp.note,
    })),
    summary: `Found ${scene.sourceParallels.length} external sources for "${scene.title}"`,
  };
}

/** Get Jesus's direct words for a scene */
export async function getJesusWords(sceneSlug: string): Promise<ToolResult> {
  const scene = await db.scene.findUnique({
    where: { slug: sceneSlug },
    include: { jesusWords: { orderBy: { sortOrder: "asc" } } },
  });

  if (!scene) return { tool: "getJesusWords", data: [], summary: `Scene "${sceneSlug}" not found` };

  return {
    tool: "getJesusWords",
    data: scene.jesusWords.map((w) => ({
      text: w.text,
      reference: w.reference,
      note: w.note,
    })),
    summary: `Found ${scene.jesusWords.length} recorded words of Jesus in "${scene.title}"`,
  };
}

/** Get scientific studies */
export async function getScientificStudies(category?: string): Promise<ToolResult> {
  const studies = await db.scientificStudy.findMany({
    where: category ? { category } : {},
  });

  return {
    tool: "getScientificStudies",
    data: studies,
    summary: `Found ${studies.length} scientific studies${category ? ` in category "${category}"` : ""}`,
  };
}

/** Get archaeological evidence */
export async function getArchaeologicalEvidence(): Promise<ToolResult> {
  const evidence = await db.archaeologicalEvidence.findMany();

  return {
    tool: "getArchaeologicalEvidence",
    data: evidence,
    summary: `Found ${evidence.length} archaeological discoveries`,
  };
}

/** Get prophecy fulfillment chain for a scene */
export async function getProphecyChain(sceneSlug: string): Promise<ToolResult> {
  const scene = await db.scene.findUnique({
    where: { slug: sceneSlug },
    include: {
      fulfillments: {
        include: { prophecy: true },
      },
    },
  });

  if (!scene) return { tool: "getProphecyChain", data: [], summary: `Scene "${sceneSlug}" not found` };

  return {
    tool: "getProphecyChain",
    data: scene.fulfillments.map((f) => ({
      prophecyLabel: f.prophecy.label,
      prophecyRef: f.prophecy.reference,
      dateWritten: f.prophecy.dateWritten,
      textKjv: f.prophecy.textKjv,
      fulfillmentType: f.prophecy.fulfillmentType,
      note: f.note,
    })),
    summary: `${scene.title} fulfills ${scene.fulfillments.length} prophecies`,
  };
}

/** Get cross-tradition comparison for an event (what each tradition says) */
export async function getCrossTraditionView(eventKeyword: string): Promise<ToolResult> {
  // Search across sources for mentions of this event
  const sources = await db.worldSource.findMany({
    where: {
      OR: [
        { content: { contains: eventKeyword } },
        { title: { contains: eventKeyword } },
      ],
    },
    include: { category: { select: { code: true, name: true } } },
  });

  return {
    tool: "getCrossTraditionView",
    data: sources.map((s) => ({
      tradition: `${s.category.code}. ${s.category.name}`,
      title: s.title,
      type: s.type,
      date: s.date,
      content: s.content,
      reliability: s.reliability,
    })),
    summary: `Found ${sources.length} traditions mentioning "${eventKeyword}"`,
  };
}

/** Get database statistics */
export async function getDatabaseStats(): Promise<ToolResult> {
  const [scenes, accounts, translations, prophecies, fulfillments, sources, words, studies, archaeology] = await Promise.all([
    db.scene.count(),
    db.account.count(),
    db.translation.count(),
    db.prophecy.count(),
    db.fulfillment.count(),
    db.worldSource.count(),
    db.jesusWord.count(),
    db.scientificStudy.count(),
    db.archaeologicalEvidence.count(),
  ]);

  return {
    tool: "getDatabaseStats",
    data: { scenes, accounts, translations, prophecies, fulfillments, sources, words, studies, archaeology },
    summary: `Database: ${scenes} scenes, ${sources} world sources, ${prophecies} prophecies, ${words} Jesus words, ${studies} studies, ${archaeology} archaeological discoveries`,
  };
}

// ============================================================
// TOOL REGISTRY — for the agent to call by name
// ============================================================

export const AGENT_TOOLS: Record<string, (...args: string[]) => Promise<ToolResult>> = {
  searchScenes: (q) => searchScenes(q),
  searchProphecies: (q) => searchProphecies(q),
  searchSources: (q, cat) => searchSources(q, cat),
  getSourcesForScene: (slug) => getSourcesForScene(slug),
  getJesusWords: (slug) => getJesusWords(slug),
  getScientificStudies: (cat) => getScientificStudies(cat),
  getArchaeologicalEvidence: () => getArchaeologicalEvidence(),
  getProphecyChain: (slug) => getProphecyChain(slug),
  getCrossTraditionView: (keyword) => getCrossTraditionView(keyword),
  getDatabaseStats: () => getDatabaseStats(),
};
