// lib/analytics.ts
export const pageview = (url: string) => {
  if (typeof window !== "undefined" && typeof window.gtag === 'function') {
    window.gtag("config", process.env.NEXT_PUBLIC_GA_ID, {
      page_path: url,
    });
  }
};
