/**
 * Wrap existing Sanity strings/blocks into locale objects.
 *
 * Default: prints planned patches. Does NOT write to Sanity.
 *
 * Execute:
 *   SANITY_API_WRITE_TOKEN=... npx tsx scripts/migrate-locale-fields.ts --execute
 *
 * Mapping:
 * - homePage, project, building: current values → sq
 * - page slugs politika-e-privatesise, kushtet-e-perdorimit → sq
 * - page slugs privacy-policy, terms → en (those documents are already English)
 *
 * Writes are patch/set only. No create, delete, or unset.
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";

loadEnvLocal();

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET;
const API_VERSION = "2026-08-18";

const ENGLISH_PAGE_SLUGS = new Set(["privacy-policy", "terms"]);

const ALLOWED_DOCUMENT_IDS = new Set([
  "2988f6c7-dbee-4bc5-834d-ed7a896dc8e2",
  "5f9b19ff-7281-452f-8c1b-103a0e2761af",
  "62bdccd1-1912-4d3d-9c6d-a2b78a048663",
  "7e9f6931-849b-4d52-89fa-b192776a5851",
  "ac81637c-7f4b-40e9-8af1-fca9fcbc8f80",
  "b2aa411f-5ee5-4bd8-9661-084b22474fc9",
  "b4c3221d-0971-4af5-966d-6694a3e0e117",
  "faaad842-7ba2-45e8-aa09-b24c8511fd09",
]);

const ALLOWED_SET_KEYS: Record<string, Set<string>> = {
  homePage: new Set([
    "heroTitle",
    "heroButtonText",
    "aboutTitle",
    "aboutText",
    "afarizmiIntro",
  ]),
  project: new Set([
    "title",
    "city",
    "description",
    "specifications",
    "amenities",
    "paymentPlan",
  ]),
  building: new Set(["title"]),
  page: new Set(["title", "body", "seoTitle", "seoDescription"]),
};

function loadEnvLocal() {
  try {
    const text = readFileSync(resolve(process.cwd(), ".env.local"), "utf8");
    for (const line of text.split(/\r?\n/)) {
      if (!line || line.startsWith("#")) continue;
      const separator = line.indexOf("=");
      if (separator === -1) continue;
      const key = line.slice(0, separator).trim();
      const value = line.slice(separator + 1).trim();
      if (process.env[key] === undefined) {
        process.env[key] = value;
      }
    }
  } catch {
    // .env.local is optional when env vars are already set.
  }
}

type Locale = "sq" | "en";

function wrapString(value: unknown, locale: Locale) {
  if (typeof value !== "string" || value.length === 0) {
    return null;
  }

  if (isLocaleObject(value)) {
    return null;
  }

  return {
    _type: "localeString",
    [locale]: value,
  };
}

function wrapText(value: unknown, locale: Locale) {
  if (typeof value !== "string" || value.length === 0) {
    return null;
  }

  if (isLocaleObject(value)) {
    return null;
  }

  return {
    _type: "localeText",
    [locale]: value,
  };
}

function wrapBlock(value: unknown, locale: Locale) {
  if (!Array.isArray(value) || value.length === 0) {
    return null;
  }

  if (isLocaleObject(value)) {
    return null;
  }

  return {
    _type: "localeBlock",
    [locale]: value,
  };
}

function wrapStringList(value: unknown, locale: Locale) {
  if (!Array.isArray(value) || value.length === 0) {
    return null;
  }

  if (value.every((item) => isLocaleObject(item))) {
    return null;
  }

  return value.map((item) => {
    if (isLocaleObject(item)) {
      return item;
    }

    if (typeof item === "string") {
      return {
        _type: "localeString",
        [locale]: item,
      };
    }

    return item;
  });
}

function isLocaleObject(value: unknown): boolean {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    ("sq" in value || "en" in value || "de" in value)
  );
}

type Patch = {
  id: string;
  type: string;
  slug: unknown;
  localeTarget: Locale;
  rev: string;
  set: Record<string, unknown>;
};

function pageLocale(slug: string | undefined): Locale {
  return slug && ENGLISH_PAGE_SLUGS.has(slug) ? "en" : "sq";
}

async function sanityQuery<T>(query: string): Promise<T> {
  const url = `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/query/${DATASET}?query=${encodeURIComponent(query)}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Sanity query failed: ${response.status}`);
  }

  const payload = (await response.json()) as { result: T };
  return payload.result;
}

async function fetchCounts() {
  return sanityQuery<{
    total: number;
    units: number;
    targets: number;
  }>(`{
    "total": count(*[]),
    "units": count(*[_type == "unit"]),
    "targets": count(*[_type in ["homePage", "project", "building", "page"]])
  }`);
}

async function fetchDocuments() {
  return sanityQuery<Array<Record<string, unknown>>>(`*[
    _type in ["homePage", "project", "building", "page"]
  ]{
    _id,
    _rev,
    _type,
    title,
    city,
    description,
    specifications,
    amenities,
    paymentPlan,
    heroTitle,
    heroButtonText,
    aboutTitle,
    aboutText,
    afarizmiIntro,
    body,
    seoTitle,
    seoDescription,
    "slug": slug.current
  }`);
}

function assertSafePatches(patches: Patch[], documentCount: number) {
  if (documentCount !== ALLOWED_DOCUMENT_IDS.size) {
    throw new Error(
      `Expected ${ALLOWED_DOCUMENT_IDS.size} target documents, found ${documentCount}`,
    );
  }

  if (patches.length !== ALLOWED_DOCUMENT_IDS.size) {
    throw new Error(
      `Expected ${ALLOWED_DOCUMENT_IDS.size} patches, found ${patches.length}`,
    );
  }

  const ids = patches.map((patch) => patch.id);
  const uniqueIds = new Set(ids);

  if (uniqueIds.size !== ids.length) {
    throw new Error("Duplicate patch document ids");
  }

  for (const id of uniqueIds) {
    if (!ALLOWED_DOCUMENT_IDS.has(id)) {
      throw new Error(`Refusing to patch unexpected document ${id}`);
    }
  }

  for (const id of ALLOWED_DOCUMENT_IDS) {
    if (!uniqueIds.has(id)) {
      throw new Error(`Missing expected patch for ${id}`);
    }
  }

  for (const patch of patches) {
    const allowed = ALLOWED_SET_KEYS[patch.type];
    if (!allowed) {
      throw new Error(`Refusing to patch unexpected type ${patch.type}`);
    }

    if (!patch.rev) {
      throw new Error(`Missing _rev for ${patch.id}`);
    }

    for (const key of Object.keys(patch.set)) {
      if (!allowed.has(key)) {
        throw new Error(`Refusing to set unexpected field ${patch.type}.${key}`);
      }
    }
  }
}

async function applyPatches(patches: Patch[], token: string) {
  const mutations = patches.map((patch) => ({
    patch: {
      id: patch.id,
      ifRevisionID: patch.rev,
      set: patch.set,
    },
  }));

  const url = `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/mutate/${DATASET}?returnIds=true&visibility=sync`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ mutations }),
  });

  const payload = (await response.json()) as {
    transactionId?: string;
    results?: Array<{ id: string; operation?: string }>;
    error?: { description?: string };
  };

  if (!response.ok) {
    throw new Error(
      payload.error?.description ?? `Sanity mutate failed: ${response.status}`,
    );
  }

  const resultIds = (payload.results ?? []).map((result) => result.id);
  const unexpectedOperation = (payload.results ?? []).find(
    (result) => result.operation && result.operation !== "update",
  );

  if (unexpectedOperation) {
    throw new Error(
      `Unexpected mutation operation ${unexpectedOperation.operation} on ${unexpectedOperation.id}`,
    );
  }

  if (resultIds.length !== ALLOWED_DOCUMENT_IDS.size) {
    throw new Error(`Expected 8 mutation results, got ${resultIds.length}`);
  }

  for (const id of resultIds) {
    if (!ALLOWED_DOCUMENT_IDS.has(id)) {
      throw new Error(`Mutation returned unexpected document ${id}`);
    }
  }

  return {
    transactionId: payload.transactionId ?? null,
    results: payload.results ?? [],
  };
}

function buildPatch(doc: Record<string, unknown>): Patch | null {
  const type = doc._type as string;
  const locale = type === "page" ? pageLocale(doc.slug as string | undefined) : "sq";
  const set: Record<string, unknown> = {};

  if (type === "homePage") {
    Object.assign(set, {
      heroTitle: wrapString(doc.heroTitle, locale),
      heroButtonText: wrapString(doc.heroButtonText, locale),
      aboutTitle: wrapString(doc.aboutTitle, locale),
      aboutText: wrapText(doc.aboutText, locale),
      afarizmiIntro: wrapText(doc.afarizmiIntro, locale),
    });
  }

  if (type === "project") {
    Object.assign(set, {
      title: wrapString(doc.title, locale),
      city: wrapString(doc.city, locale),
      description: wrapText(doc.description, locale),
      specifications: wrapStringList(doc.specifications, locale),
      amenities: wrapStringList(doc.amenities, locale),
    });

    if (Array.isArray(doc.paymentPlan)) {
      let paymentPlanChanged = false;
      const paymentPlan = doc.paymentPlan.map(
        (item: Record<string, unknown>) => {
          const wrappedLabel = wrapString(item.label, locale);
          if (!wrappedLabel) {
            return item;
          }

          paymentPlanChanged = true;
          return {
            ...item,
            label: wrappedLabel,
          };
        },
      );

      if (paymentPlanChanged) {
        set.paymentPlan = paymentPlan;
      }
    }
  }

  if (type === "building") {
    Object.assign(set, {
      title: wrapString(doc.title, locale),
    });
  }

  if (type === "page") {
    Object.assign(set, {
      title: wrapString(doc.title, locale),
      body: wrapBlock(doc.body, locale),
      seoTitle: wrapString(doc.seoTitle, locale),
      seoDescription: wrapText(doc.seoDescription, locale),
    });
  }

  const cleaned = Object.fromEntries(
    Object.entries(set).filter(([, value]) => value != null),
  );

  if (Object.keys(cleaned).length === 0) {
    return null;
  }

  return {
    id: doc._id as string,
    type,
    slug: doc.slug ?? null,
    localeTarget: locale,
    rev: doc._rev as string,
    set: cleaned,
  };
}

async function main() {
  const execute = process.argv.includes("--execute");

  if (!PROJECT_ID || !DATASET) {
    throw new Error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID or NEXT_PUBLIC_SANITY_DATASET");
  }

  const countsBefore = await fetchCounts();
  const documents = await fetchDocuments();
  const patches = documents
    .map(buildPatch)
    .filter((patch): patch is Patch => patch !== null);

  assertSafePatches(patches, documents.length);

  if (countsBefore.targets !== ALLOWED_DOCUMENT_IDS.size) {
    throw new Error(
      `Expected ${ALLOWED_DOCUMENT_IDS.size} target documents in counts, found ${countsBefore.targets}`,
    );
  }

  console.log(
    JSON.stringify(
      {
        mode: execute ? "execute" : "dry-run",
        dataset: DATASET,
        countsBefore,
        documentCount: documents.length,
        patchCount: patches.length,
        patches,
      },
      null,
      2,
    ),
  );

  if (!execute) {
    console.log(
      "\nDry-run only. No documents were changed. Re-run with --execute and a write token when approved.",
    );
    return;
  }

  const token = process.env.SANITY_API_WRITE_TOKEN;
  if (!token) {
    throw new Error("SANITY_API_WRITE_TOKEN is required for --execute");
  }

  const writeResult = await applyPatches(patches, token);
  const countsAfter = await fetchCounts();
  const documentsAfter = await fetchDocuments();

  if (
    countsAfter.total !== countsBefore.total ||
    countsAfter.units !== countsBefore.units ||
    countsAfter.targets !== countsBefore.targets
  ) {
    throw new Error(
      `Document counts changed after write: before=${JSON.stringify(countsBefore)} after=${JSON.stringify(countsAfter)}`,
    );
  }

  console.log(
    JSON.stringify(
      {
        write: {
          transactionId: writeResult.transactionId,
          results: writeResult.results,
        },
        countsAfter,
        documentsAfter: documentsAfter.map((doc) => ({
          _id: doc._id,
          _type: doc._type,
          slug: doc.slug ?? null,
          title: doc.title,
          city: doc.city,
          specifications: doc.specifications,
          amenities: doc.amenities,
          paymentPlan: doc.paymentPlan,
          heroTitle: doc.heroTitle,
          heroButtonText: doc.heroButtonText,
          aboutTitle: doc.aboutTitle,
          body: doc.body,
        })),
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
