export const extractDomain = (url) => {
  if (!url) return '';
  return url
    .replace(/^https?:\/\//, '') // Remove protocol
    .replace(/^www\./, '') // Remove www.
    .split('/')[0]; // Remove path
};
