/** Accepte uniquement une destination interne afin de préserver les retours d'authentification sans ouvrir de redirection externe. */
export function getSafeCallbackUrl(value: string | null | undefined, fallback = "/") {
  if (!value || value.length > 2048 || !value.startsWith("/") || value.startsWith("//") || /[\\\u0000-\u001f]/.test(value)) return fallback;
  try {
    const target = new URL(value, "https://turtleguide.invalid");
    return target.origin === "https://turtleguide.invalid" ? `${target.pathname}${target.search}${target.hash}` : fallback;
  } catch {
    return fallback;
  }
}
