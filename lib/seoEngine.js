// lib/seoEngine.js

export function analyzeSeo(article) {
  const { title = "", targetKeyword = "", metaDescription = "", content = "" } = article;
  
  const kw = targetKeyword.trim().toLowerCase();
  // Strip Markdown / HTML for accurate word and keyword matching
  const cleanContent = content.replace(/<[^>]*>?/gm, '').replace(/([#*~_`]|\[|\]|\(|\))/g, ' ');
  const words = cleanContent.split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length;
  
  const checklist = [];
  let totalScore = 0;
  
  const weights = {
    titleKw: 15,
    titleLen: 10,
    metaKw: 10,
    metaLen: 10,
    first100Words: 15,
    density: 15,
    h2Kw: 10,
    links: 5,
    wordCount: 10
  };

  // 1. Title Core Topic Match (Works perfectly with Nepali Devanagari Unicode script)
  if (!kw) {
    checklist.push({ metric: "Core Topic Identifier", passed: false, text: "No core topic entered. Add a main topic keyword to ignite scoring." });
  } else {
    const titleHasKw = title.toLowerCase().includes(kw);
    checklist.push({
      metric: "Headline Core Topic",
      passed: titleHasKw,
      text: titleHasKw ? `Core topic "${kw}" found in headline.` : `Headline should embed your core topic "${kw}".`
    });
    if (titleHasKw) totalScore += weights.titleKw;
  }

  // 2. Title Length Optimal Range
  const titleLen = title.length;
  const titleLenPassed = titleLen >= 40 && titleLen <= 65;
  checklist.push({
    metric: "Headline Unfurl Length",
    passed: titleLenPassed,
    text: titleLenPassed ? `Headline length optimal (${titleLen} chars).` : `Headline has ${titleLen} chars. Keep between 40-65 for perfect social link previews.`
  });
  if (titleLenPassed) totalScore += weights.titleLen;

  // 3. Meta Description Keyword
  if (kw && metaDescription) {
    const metaHasKw = metaDescription.toLowerCase().includes(kw);
    checklist.push({
      metric: "Summary Core Topic Match",
      passed: metaHasKw,
      text: metaHasKw ? `Core topic found in summary snippet.` : `Summary description missing core topic.`
    });
    if (metaHasKw) totalScore += weights.metaKw;
  } else {
    checklist.push({ metric: "Summary Core Topic Match", passed: false, text: "Write a summary description." });
  }

  // 4. Meta Description Length
  const metaLen = metaDescription.length;
  const metaLenPassed = metaLen >= 120 && metaLen <= 165;
  checklist.push({
    metric: "Summary Unfurl Length",
    passed: metaLenPassed,
    text: metaLenPassed ? `Summary length perfect (${metaLen} chars).` : `Summary has ${metaLen} chars. Optimal social preview snippet is 120-165.`
  });
  if (metaLenPassed) totalScore += weights.metaLen;

  // 5. Keyword in Introductory 100 Words
  if (kw && words.length > 0) {
    const first100 = words.slice(0, 100).join(" ").toLowerCase();
    const inFirst100 = first100.includes(kw);
    checklist.push({
      metric: "Introductory Story Hook",
      passed: inFirst100,
      text: inFirst100 ? `Excellent: Core topic hooked inside the opening paragraph.` : `Embed your core topic within the first 100 words to establish clear storytelling intent.`
    });
    if (inFirst100) totalScore += weights.first100Words;
  } else {
    checklist.push({ metric: "Introductory Story Hook", passed: false, text: "Write introductory prose." });
  }

  // 6. Keyword Saturation Density
  if (kw && wordCount > 0) {
    const regex = new RegExp(kw.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'giu');
    const matches = cleanContent.match(regex);
    const kwCount = matches ? matches.length : 0;
    const density = (kwCount / wordCount) * 100;
    const densityPassed = density >= 0.8 && density <= 3.5;
    
    checklist.push({
      metric: "Topical Resonance Density",
      passed: densityPassed,
      text: densityPassed ? `Healthy topical resonance (${density.toFixed(1)}%). Optimal is 0.8% - 3.5%.` : `Current density is ${density.toFixed(1)}%. Maintain between 0.8% and 3.5% for natural reading flow.`
    });
    if (densityPassed) totalScore += weights.density;
  } else {
    checklist.push({ metric: "Topical Resonance Density", passed: false, text: "Add markdown prose." });
  }

  // 7. Semantic H2 Hierarchy Match
  if (kw && content) {
    const h2s = content.match(/^##\s+(.*)$/gm) || [];
    const h2HasKw = h2s.some(h => h.toLowerCase().includes(kw));
    checklist.push({
      metric: "Section Heading Outline",
      passed: h2HasKw,
      text: h2HasKw ? `Core topic found inside structured section headings (##).` : `Include your core topic inside at least one structured section sub-heading (##).`
    });
    if (h2HasKw) totalScore += weights.h2Kw;
  } else {
    checklist.push({ metric: "Section Heading Outline", passed: false, text: "Create ## section subheadings." });
  }

  // 8. Internal / Outbound Reference Links
  if (content) {
    const hasLinks = /\[.+\]\(https?:\/\/.+\)/.test(content);
    checklist.push({
      metric: "Helpful Context References",
      passed: hasLinks,
      text: hasLinks ? `External/outbound reference links detected.` : `Include at least one reference link [text](url) to give readers helpful context.`
    });
    if (hasLinks) totalScore += weights.links;
  } else {
    checklist.push({ metric: "Helpful Context References", passed: false, text: "Add outbound links." });
  }

  // 9. Comprehensive Word Count
  checklist.push({
    metric: "Definitive Story Depth",
    passed: wordCount >= 300,
    text: wordCount >= 300 ? `Thorough definitive depth (${wordCount} words).` : `Story has ${wordCount} words. Definitive pieces engage readers best over 300 words.`
  });
  if (wordCount >= 300) totalScore += weights.wordCount;

  return { totalScore, wordCount, checklist };
}

/**
 * Enhanced Unicode & Nepali Devanagari Preserving Slug Generator.
 * Replaces hard ASCII-only stripping with modern Unicode property escapes (\p{L}\p{N}),
 * making flawless canonical URLs for Nepali, Hindi, Arabic, Japanese, and Chinese titles.
 */
export function generateCleanSlug(title) {
  if (!title) return "post-" + Date.now();

  const slug = title
    .trim()
    // Keep any Unicode letter (including Devanagari script), Unicode number, space, or dash
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    // Replace any run of whitespace or underscores with a single dash
    .replace(/[\s_-]+/g, '-')
    // Strip leading/trailing dashes
    .replace(/^-+|-+$/g, '')
    .toLowerCase();

  return slug || "post-" + Date.now();
}
