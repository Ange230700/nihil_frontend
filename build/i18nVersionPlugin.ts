// build\i18nVersionPlugin.ts

import type { Plugin, ResolvedConfig } from "vite";
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

type Opts = {
  /** Relative to repo root; defaults to all .json in src/i18n */
  locales?: string[];
  /** Virtual id to import from */
  virtualId?: string;
  /** Hash algorithm */
  algo?: "sha256" | "sha1" | "md5";
};

export default function i18nVersionPlugin(opts: Opts = {}): Plugin {
  const virtualId = opts.virtualId ?? "virtual:i18n-version";
  const resolvedVirtualId = "\0" + virtualId;
  const algo = opts.algo ?? "sha256";

  let config: ResolvedConfig;
  let version = "dev";

  const localeFiles = () => {
    if (opts.locales?.length) return opts.locales;
    // auto-scan src/i18n/*.json
    const dir = path.resolve(config.root, "src/i18n");
    if (!fs.existsSync(dir)) return [];
    return fs
      .readdirSync(dir)
      .filter((f) => f.endsWith(".json"))
      .map((f) => path.join("src/i18n", f));
  };

  const compute = () => {
    const files = localeFiles();
    const h = createHash(algo);
    if (files.length === 0) {
      h.update("no-locales");
    } else {
      for (const rel of files) {
        const abs = path.resolve(config.root, rel);
        if (fs.existsSync(abs)) {
          // include contents and mtime to be safe
          h.update(fs.readFileSync(abs));
          h.update(String(fs.statSync(abs).mtimeMs));
        } else {
          h.update(rel);
        }
      }
    }
    return h.digest("hex").slice(0, 16); // short & stable
  };

  return {
    name: "nihil-i18n-version",
    enforce: "pre",

    configResolved(c) {
      config = c;
      version = compute();
    },

    buildStart() {
      // Watch locale files in dev for HMR
      for (const rel of localeFiles()) {
        this.addWatchFile(path.resolve(config.root, rel));
      }
    },

    resolveId(id) {
      if (id === virtualId) return resolvedVirtualId;
      return null;
    },

    load(id) {
      if (id === resolvedVirtualId) {
        return `export const I18N_VERSION = "${version}";
export default I18N_VERSION;`;
      }
      return null;
    },

    async handleHotUpdate(ctx) {
      const watchedAbs = localeFiles().map((rel) =>
        path.resolve(ctx.server.config.root, rel),
      );
      if (watchedAbs.includes(ctx.file)) {
        version = compute();
        const mod = ctx.server.moduleGraph.getModuleById(resolvedVirtualId);
        if (mod) {
          ctx.server.moduleGraph.invalidateModule(mod);
          // trigger HMR for importers
          return [mod];
        }
      }
      return [];
    },
  };
}
