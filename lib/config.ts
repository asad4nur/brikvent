/**
 * Environment configuration for Brikvent Portfolio
 */

/**
 * Returns the URL for Merchant Admin Dashboard (port 3001 locally, merchant.brikvent.com in prod)
 */
export function getMerchantAdminUrl(): string {
  if (process.env.NEXT_PUBLIC_MERCHANT_ADMIN_URL) {
    return process.env.NEXT_PUBLIC_MERCHANT_ADMIN_URL;
  }

  const isLocal =
    typeof window !== "undefined"
      ? window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1" ||
        window.location.hostname.endsWith(".localhost")
      : process.env.NODE_ENV !== "production";

  return isLocal ? "http://localhost:3001" : "https://merchant.brikvent.com";
}

/**
 * Returns the backend API base URL (port 5000 locally, api.brikvent.com in prod)
 */
export function getApiUrl(): string {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/+$/, "");
  }

  const isLocal =
    typeof window !== "undefined"
      ? window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1" ||
        window.location.hostname.endsWith(".localhost")
      : process.env.NODE_ENV !== "production";

  return isLocal ? "http://localhost:5000" : "https://api.brikvent.com";
}
