export function isDisplayablePost({ url, frontmatter }) {
  return url !== '/' && hasFrontmatter(frontmatter);
}

function hasFrontmatter(frontmatter) {
  return frontmatter && Object.keys(frontmatter).length > 0;
}
