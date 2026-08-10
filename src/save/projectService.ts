import type { FmSaveRef, SaveError, VeytaroProject } from "./types";

function isTauriRuntime(): boolean {
  return typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;
}

function fileNameFromPath(path: string): string {
  return path.split(/[/\\]/).pop() ?? path;
}

export function createEmptyProject(
  name: string,
  fmSave: FmSaveRef | null = null,
): VeytaroProject {
  const now = new Date().toISOString();
  return {
    version: 1,
    name,
    createdAt: now,
    updatedAt: now,
    fmSave,
    analyses: [],
    importedMetadata: {},
    notes: [],
    shortlists: [],
    settings: {},
    squadSnapshot: null,
  };
}

export type ProjectWriteResult =
  | { ok: true; path: string; project: VeytaroProject }
  | { ok: false; error: SaveError };

export async function saveVeytaroProject(
  project: VeytaroProject,
  existingPath: string | null,
): Promise<ProjectWriteResult> {
  if (!isTauriRuntime()) {
    return {
      ok: false,
      error: { code: "unknown", messageKey: "save.errors.desktopOnly" },
    };
  }

  try {
    const { save } = await import("@tauri-apps/plugin-dialog");
    const { writeTextFile } = await import("@tauri-apps/plugin-fs");

    let path = existingPath;
    if (!path) {
      const picked = await save({
        title: "Veytaro-Projekt speichern unter",
        defaultPath: `${project.name || "Veytaro"}.veytaro.json`,
        filters: [
          {
            name: "Veytaro Projekt",
            extensions: ["veytaro.json", "json"],
          },
        ],
      });
      if (!picked) {
        return {
          ok: false,
          error: { code: "cancelled", messageKey: "save.errors.cancelled" },
        };
      }
      path = picked.endsWith(".json") ? picked : `${picked}.veytaro.json`;
    }

    const next: VeytaroProject = {
      ...project,
      updatedAt: new Date().toISOString(),
      name: project.name || fileNameFromPath(path).replace(/\.veytaro\.json$/i, ""),
    };

    // Never writes to the original FM save path — only Veytaro project files.
    await writeTextFile(path, JSON.stringify(next, null, 2));
    return { ok: true, path, project: next };
  } catch (error) {
    return {
      ok: false,
      error: {
        code: "write_failed",
        messageKey: "save.errors.writeFailed",
        detail: error instanceof Error ? error.message : undefined,
      },
    };
  }
}

export async function saveVeytaroProjectAs(
  project: VeytaroProject,
): Promise<ProjectWriteResult> {
  return saveVeytaroProject(project, null);
}
