export const fetchPokedbotsUrl = async (url: string): Promise<string> => {
  const response = await fetch(url);
  const data = await response.text();

  const parser = new DOMParser();
  const doc = parser.parseFromString(data, "text/xml");
  const image = doc.querySelector("image");
  return image?.getAttribute("href") || "";
};
