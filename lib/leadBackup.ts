export type LeadBackupRecord = {
  name: string;
  phone: string;
  email: string;
  project: string;
  message: string;
  source: string;
};

export async function saveLeadBackup(record: LeadBackupRecord) {
  const createdAt = new Date().toISOString();
  const payload = { ...record, createdAt };
  const errors: string[] = [];

  const sheetUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL?.trim();
  if (sheetUrl) {
    try {
      const response = await fetch(sheetUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        cache: "no-store",
      });

      if (!response.ok) {
        errors.push(`Google Sheets webhook ${response.status}`);
      }
    } catch (error) {
      errors.push(`Google Sheets webhook: ${String(error)}`);
    }
  }

  const airtableKey = process.env.AIRTABLE_API_KEY?.trim();
  const airtableBase = process.env.AIRTABLE_BASE_ID?.trim();
  const airtableTable = process.env.AIRTABLE_TABLE_NAME?.trim();

  if (airtableKey && airtableBase && airtableTable) {
    try {
      const response = await fetch(
        `https://api.airtable.com/v0/${airtableBase}/${encodeURIComponent(airtableTable)}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${airtableKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fields: {
              Name: record.name,
              Phone: record.phone,
              Email: record.email,
              Project: record.project,
              Message: record.message,
              Source: record.source,
              Created: createdAt,
            },
          }),
          cache: "no-store",
        },
      );

      if (!response.ok) {
        errors.push(`Airtable ${response.status}`);
      }
    } catch (error) {
      errors.push(`Airtable: ${String(error)}`);
    }
  }

  if (!sheetUrl && !(airtableKey && airtableBase && airtableTable)) {
    console.warn("[lead-backup] No Google Sheets webhook or Airtable is configured.");
    return;
  }

  if (errors.length > 0) {
    console.error("[lead-backup] Failed:", errors.join("; "));
  }
}

export type BackupLeadRow = {
  name: string;
  phone: string;
  email: string;
  project: string;
  source: string;
  created: string;
};

export async function listLeadBackup(): Promise<BackupLeadRow[]> {
  const airtableKey = process.env.AIRTABLE_API_KEY?.trim();
  const airtableBase = process.env.AIRTABLE_BASE_ID?.trim();
  const airtableTable = process.env.AIRTABLE_TABLE_NAME?.trim();

  if (!airtableKey || !airtableBase || !airtableTable) {
    return [];
  }

  const rows: BackupLeadRow[] = [];
  let offset: string | undefined;

  do {
    const url = new URL(
      `https://api.airtable.com/v0/${airtableBase}/${encodeURIComponent(airtableTable)}`,
    );
    url.searchParams.set("pageSize", "100");
    if (offset) {
      url.searchParams.set("offset", offset);
    }

    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${airtableKey}` },
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("[lead-backup] Airtable list failed:", response.status);
      break;
    }

    const data = (await response.json()) as {
      offset?: string;
      records?: Array<{
        fields?: Record<string, string>;
      }>;
    };

    for (const record of data.records ?? []) {
      const fields = record.fields ?? {};
      rows.push({
        name: fields.Name ?? "",
        phone: fields.Phone ?? "",
        email: fields.Email ?? "",
        project: fields.Project ?? "",
        source: fields.Source ?? "",
        created: fields.Created ?? "",
      });
    }

    offset = data.offset;
  } while (offset);

  return rows.sort((a, b) => b.created.localeCompare(a.created));
}
