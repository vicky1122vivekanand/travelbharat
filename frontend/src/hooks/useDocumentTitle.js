import { useEffect } from "react";

/**
 * Sets document.title (and optionally the meta description) for the current
 * page. A lightweight substitute for react-helmet in this scaffold — for
 * true SEO (crawlable pre-rendered HTML), pair this with a pre-rendering or
 * SSR build step (e.g. vite-plugin-ssr, Next.js) in a later phase.
 */
export default function useDocumentTitle(title, description) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title ? `${title} · TravelBharat` : "TravelBharat — Explore India State by State";

    let metaDescription = document.querySelector('meta[name="description"]');
    const previousDescription = metaDescription?.getAttribute("content");

    if (description && metaDescription) {
      metaDescription.setAttribute("content", description);
    }

    return () => {
      document.title = previousTitle;
      if (description && metaDescription && previousDescription) {
        metaDescription.setAttribute("content", previousDescription);
      }
    };
  }, [title, description]);
}
