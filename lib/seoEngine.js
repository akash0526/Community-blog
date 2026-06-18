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

  // 1. Title Keyword Match
  if (!kw) {
    checklist.push({ metric: "Target Keyword", passed: false, text: "No primary keyword entered. Add a target keyword to ignite scoring." });
  } else {
    const titleHasKw = title.toLowerCase().includes(kw);
    checklist.push({
      metric: "Title Exact Match",
      passed: titleHasKw,
      text: titleHasKw ? `Exact target keyword "${kw}" found in headline.` : `Headline must contain your exact keyword "${kw}".`
    });
    if (titleHasKw) totalScore += weights.titleKw;
  }

  // 2. Title Length Optimal Range
  const titleLen = title.length;
  const titleLenPassed = titleLen >= 40 && titleLen <= 65;
  checklist.push({
    metric: "Headline SERP Length",
    passed: titleLenPassed,
    text: titleLenPassed ? `Headline length optimal (${titleLen} chars).` : `Headline has ${titleLen} chars. Keep between 40-65 to avoid Google SERP truncation.`
  });
  if (titleLenPassed) totalScore += weights.titleLen;

  // 3. Meta Description Keyword
  if (kw && metaDescription) {
    const metaHasKw = metaDescription.toLowerCase().includes(kw);
    checklist.push({
      metric: "Meta Snippet Exact Match",
      passed: metaHasKw,
      text: metaHasKw ? `Target keyword found in meta snippet.` : `Meta description missing target keyword.`
    });
    if (metaHasKw) totalScore += weights.metaKw;
  } else {
    checklist.push({ metric: "Meta Snippet Exact Match", passed: false, text: "Write a meta description." });
  }

  // 4. Meta Description Length
  const metaLen = metaDescription.length;
  const metaLenPassed = metaLen >= 120 && metaLen <= 165;
  checklist.push({
    metric: "Meta SERP Length",
    passed: metaLenPassed,
    text: metaLenPassed ? `Meta description length perfect (${metaLen} chars).` : `Meta has ${metaLen} chars. Optimal snippet unfurl range is 120-165.`
  });
  if (metaLenPassed) totalScore += weights.metaLen;

  // 5. Keyword in Introductory 100 Words
  if (kw && words.length > 0) {
    const first100 = words.slice(0, 100).join(" ").toLowerCase();
    const inFirst100 = first100.includes(kw);
    checklist.push({
      metric: "Introductory Intent Hook",
      passed: inFirst100,
      text: inFirst100 ? `Excellent: Keyword hooked inside the introductory paragraph.` : `Embed your keyword within the first 100 words for instant AI parser intent.`
    });
    if (inFirst100) totalScore += weights.first100Words;
  } else {
    checklist.push({ metric: "Introductory Intent Hook", passed: false, text: "Write introductory prose." });
  }

  // 6. Keyword Saturation Density
  if (kw && wordCount > 0) {
    const regex = new RegExp(kw.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'gi');
    const matches = cleanContent.match(regex);
    const kwCount = matches ? matches.length : 0;
    const density = (kwCount / wordCount) * 100;
    const densityPassed = density >= 0.8 && density <= 3.5;
    
    checklist.push({
      metric: "Topical Keyword Density",
      passed: densityPassed,
      text: densityPassed ? `Healthy topical saturation (${density.toFixed(1)}%). Optimal is 0.8% - 3.5%.` : `Current density is ${density.toFixed(1)}%. Maintain between 0.8% and 3.5% to avoid keyword stuffing.`
    });
    if (densityPassed) totalScore += weights.density;
  } else {
    checklist.push({ metric: "Topical Keyword Density", passed: false, text: "Add markdown prose." });
  }

  // 7. Semantic H2 Hierarchy Match
  if (kw && content) {
    const h2s = content.match(/^##\s+(.*)$/gm) || [];
    const h2HasKw = h2s.some(h => h.toLowerCase().includes(kw));
    checklist.push({
      metric: "H2 Semantic Outline",
      passed: h2HasKw,
      text: h2HasKw ? `Target keyword found inside semantic H2 headings.` : `Include your keyword inside at least one H2 sub-heading.`
    });
    if (h2HasKw) totalScore += weights.h2Kw;
  } else {
    checklist.push({ metric: "H2 Semantic Outline", passed: false, text: "Create H2 subheadings." });
  }

  // 8. Internal / Outbound Reference Links
  if (content) {
    const hasLinks = /\[.+\]\(https?:\/\/.+\)/.test(content);
    checklist.push({
      metric: "Knowledge Graph References",
      passed: hasLinks,
      text: hasLinks ? `External/Outbound reference links detected.` : `Include at least one markdown reference link [text](url) to establish knowledge graph authority.`
    });
    if (hasLinks) totalScore += weights.links;
  } else {
    checklist.push({ metric: "Knowledge Graph References", passed: false, text: "Add outbound links." });
  }

  // 9. Comprehensive Word Count
  checklist.push({
    metric: "Comprehensive Depth",
    passed: wordCount >= 300,
    text: wordCount >= 300 ? `Thorough definitive depth (${wordCount} words).` : `Prose has ${wordCount} words. Definitive long-tail pieces rank best over 300 words.`
  });
  if (wordCount >= 300) totalScore += weights.wordCount;

  return { totalScore, wordCount, checklist };
}

export function generateCleanSlug(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
