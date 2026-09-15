/**
 * X09 Studio - Secrets & Hygiene Filter for GitHub Push & Exports
 * Prevents sensitive environment variables, private keys, API tokens, and bulky build files
 * from being committed to public or private user repositories.
 * Ported & enhanced from X09-Studio production core.
 */

const SECRET_PATH_PATTERNS = [
  /^\.env($|\.)/i,
  /^\.env\..+/i,
  /(^|\/)\.env($|\.)/i,
  /(^|\/)secrets?\//i,
  /(^|\/)\.npmrc$/i,
  /(^|\/)credentials\.json$/i,
  /(^|\/)service[-_]?account.*\.json$/i,
  /(^|\/)id_rsa$/i,
  /(^|\/)\.pem$/i,
  /(^|\/)private[-_]?key/i,
];

const SKIP_PATH_PATTERNS = [
  /(^|\/)node_modules\//i,
  /(^|\/)\.git\//i,
  /(^|\/)dist\//i,
  /(^|\/)build\//i,
  /(^|\/)\.next\//i,
  /(^|\/)coverage\//i,
  /(^|\/)package-lock\.json$/i,
  /(^|\/)pnpm-lock\.yaml$/i,
  /(^|\/)yarn\.lock$/i,
  /(^|\/)\.DS_Store$/i,
];

const SECRET_CONTENT_HINTS =
  /(api[_-]?key|secret|password|private[_-]?key|BEGIN (RSA |OPENSSH |EC )?PRIVATE KEY)/i;

export function normalizeRepoPath(path: string): string {
  return path.replace(/^\/+/, '').replace(/\\/g, '/');
}

export function shouldExcludeFromPush(
  path: string,
  content?: string
): boolean {
  const normalized = normalizeRepoPath(path);
  if (!normalized) return true;
  if (SECRET_PATH_PATTERNS.some((re) => re.test(normalized))) return true;
  if (SKIP_PATH_PATTERNS.some((re) => re.test(normalized))) return true;
  if (content && SECRET_CONTENT_HINTS.test(content) && /\.env/i.test(normalized)) {
    return true;
  }
  return false;
}

export function filterFilesForPush(
  files: Record<string, string>
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [path, content] of Object.entries(files)) {
    if (shouldExcludeFromPush(path, content)) continue;
    if (typeof content !== 'string') continue;
    // Cap files larger than 1.5MB to protect API limits
    if (content.length > 1_500_000) continue;
    out[normalizeRepoPath(path)] = content;
  }
  return out;
}
