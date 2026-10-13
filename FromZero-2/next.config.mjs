/** @type {import('next').NextConfig} */
const SUPA = "https://*.supabase.co";
const csp = ["default-src 'self'", "script-src 'self' 'unsafe-inline'", "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com", "font-src https://fonts.gstatic.com", "img-src 'self' data: blob:", `connect-src 'self' ${SUPA} wss://*.supabase.co`, "frame-ancestors 'none'", "base-uri 'self'", "form-action 'self' https://hh.ru https://accounts.google.com"].join("; ");
const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Frame-Options", value: "DENY" }, { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];
export default { reactStrictMode: true, poweredByHeader: false, productionBrowserSourceMaps: false, async headers() { return [{ source: "/(.*)", headers: securityHeaders }]; } };
