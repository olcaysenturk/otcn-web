/**
 * Builds URLSearchParams from a filter object.
 * Skips undefined, null, and "all" values.
 */
export function buildSearchParams(filters: Record<string, any>): URLSearchParams {
  const searchParams = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "" || value === "all") {
      return;
    }
    searchParams.set(key, value.toString());
  });
  
  return searchParams;
}
