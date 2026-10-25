"use client";

import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Share2, Bookmark } from "lucide-react";
import dynamic from "next/dynamic";
import { sanitizeCmsField, detectLanguage, cleanExcerpt, cleanBio, authorSlugFor, parseSources } from "@/lib/seoUtils";
import { normalizeCategory } from "@/lib/categories";
import { imageKitDeliveryUrl } from "@/lib/imagekitUrl";
import { IconCheck } from "@/components/Icon";

// Playbook §5.6: comments are below the fold on every post — keep their JS
// out of the critical article bundle (INP/bundle weight on slow Nepali 4G).
const DiscussionThread = dynamic(() => import("@/components/DiscussionThread"), {
  ssr: false,
  loading: () => <div className="text-sm text-slate-500 py-6">Loading discussion…</div>,
});

// Affiliate links must carry rel="sponsored" (playbook §12.2). We can't know
// every program, so: explicit markers authors can use today — URLs with
// ref=/aff/tag= parameters or a "#aff" fragment get sponsored automatically.
function isAffiliateHref(href = "") {
  return /[?&#](ref|aff|affiliate|tag|partner)=/i.test(href) || /#aff$/i.test(href);
}

function cleanTitle(title=""){
  return sanitizeCmsField(String(title).replace(/\s*Slug:.*$/i,'').trim());
}

function getAvatar(profile, fallbackSeed="apex"){
  const raw = profile?.avatar_url || "";
  if(!raw || raw.includes("dicebear") || raw.includes("bottts")){
    const name = encodeURIComponent(profile?.full_name || "Apex Editorial");
    return `https://ui-avatars.com/api/?name=${name}&background=A8471F&color=fff&size=128`;
  }
  return raw;
}

function formatDate(d){
  if(!d) return "";
  try {
    return new Date(d).toLocaleDateString('en-GB', { year:'numeric', month:'long', day:'numeric'});
  } catch { return d }
}

export default function ArticleContent({ serverArticle, slug, related = [], hub = null, categoryPage = "/blog", categoryName = "" }) {
  const [article, setArticle] = useState(serverArticle);
  const [loading, setLoading] = useState(!serverArticle);
  const [bookmarked, setBookmarked] = useState(false);
  const [shareToast, setShareToast] = useState(false);

  // Browser-storage reads (local drafts, bookmark state) run deferred, after
  // hydration: synchronous setState here would cascade renders, and reading
  // localStorage during render would mismatch the server HTML.
  useEffect(() => {
    const t = setTimeout(() => {
      if (!serverArticle) {
        try {
          const stored = JSON.parse(localStorage.getItem("apex_articles_v1") || "[]");
          const found = stored.find((a) => decodeURIComponent(a.slug || "") === decodeURIComponent(slug));
          if (found) setArticle(found);
        } catch {}
      }
      try {
        const bms = JSON.parse(localStorage.getItem("apex_bookmarks_v1") || "[]");
        setBookmarked(bms.some((b) => decodeURIComponent(b.slug || "") === decodeURIComponent(slug)));
      } catch {}
      setLoading(false);
    }, 0);
    return () => clearTimeout(t);
  }, [serverArticle, slug]);

  const handleBookmark = ()=>{
    try{
      const bms = JSON.parse(localStorage.getItem("apex_bookmarks_v1")||"[]");
      const idx = bms.findIndex(b => decodeURIComponent(b.slug||"")===decodeURIComponent(slug));
      if(idx>=0){ bms.splice(idx,1); setBookmarked(false); }
      else if(article){
        // Store a slim card (not the whole article body) — full content
        // blobs would exhaust the ~5MB localStorage quota after a few saves.
        bms.unshift({
          id: article.id,
          slug: article.slug,
          title: cleanTitle(article.title),
          meta_description: article.meta_description,
          category: article.category,
          image_url: article.image_url,
          published_at: article.published_at || article.created_at,
          profiles: { full_name: article.profiles?.full_name || "Apex Editorial" },
        });
        setBookmarked(true);
      }
      localStorage.setItem("apex_bookmarks_v1", JSON.stringify(bms));
    }catch{}
  };

  const handleShare = async ()=>{
    const url = typeof window !== "undefined" ? window.location.href : "";
    try{
      if(navigator.share){
        await navigator.share({ title: cleanTitle(article?.title), url });
      } else {
        await navigator.clipboard.writeText(url);
        setShareToast(true);
        setTimeout(()=>setShareToast(false), 2000);
      }
    }catch{}
  };

  if(loading){
    return <div className="max-w-3xl mx-auto px-6 py-24"><div className="animate-pulse space-y-4"><div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-1/2"/><div className="h-12 bg-slate-200 dark:bg-slate-800 rounded"/><div className="h-64 bg-slate-100 dark:bg-slate-900 rounded-2xl"/></div></div>
  }
  if(!article){
    return (
      <div className="max-w-2xl mx-auto px-6 py-24 text-center">
        <h1 className="text-3xl font-black mb-3">Article not found</h1>
        <p className="text-slate-600 dark:text-slate-400 mb-8">This story may have been moved or removed.</p>
        <Link href="/" className="px-5 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold">← Back home</Link>
      </div>
    )
  }

  const title = cleanTitle(article.title);
  const description = cleanExcerpt(article.meta_description);
  // Real reading time from the body (was hardcoded "5–8 min" for every story).
  const wordCount = String(article.content || "").split(/\s+/).filter(Boolean).length;
  const readMinutes = Math.max(1, Math.round(wordCount / 200));
  // Tag Nepali (Devanagari) stories so screen readers pronounce them correctly.
  const contentLang = detectLanguage(`${article.title || ""} ${article.content || ""}`);
  const author = article.profiles || {};
  const authorName = author.full_name || "Apex Editorial";
  const authorRole = author.professional_role || "Contributing Writer";
  const authorBio = cleanBio(author.bio || "");
  const authorAvatar = getAvatar(author, article.id);
  const published = formatDate(article.published_at || article.created_at);
  const updated = article.updated_at && article.updated_at !== article.created_at ? formatDate(article.updated_at) : null;
  const category = categoryName || article.category || "Guides";
  const canonicalCategory = normalizeCategory(article.category, `${article.title || ""} ${article.target_keyword || ""}`);
  const isFinance = canonicalCategory === "Payments & Finance";
  const isHealth = (category||"").toLowerCase().includes("health");
  const isLegal = (category||"").toLowerCase().includes("legal");
  const authorSlug = authorSlugFor(author);
  const authorProfileHref = `/authors/${encodeURIComponent(authorSlug)}`;
  // Optional E-E-A-T fields (Supabase columns added by the SEO-playbook
  // migration; everything degrades gracefully until they are filled in).
  const testedMethod = String(article.tested_method || "").trim();
  const sources = parseSources(article.sources);
  const hasAffiliate = Boolean(article.has_affiliate_links);
  const reviewerName = String(article.reviewer_name || "").trim();
  const reviewerUrl = String(article.reviewer_url || "").trim();

  const markdownComponents = {
    h1: ({children}) => <h1 className="text-[28px] sm:text-[36px] font-black mt-12 mb-5 leading-tight text-slate-900 dark:text-white">{children}</h1>,
    h2: ({children}) => <h2 className="text-[22px] sm:text-[28px] font-black mt-10 mb-4 text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-3">{children}</h2>,
    h3: ({children}) => <h3 className="text-xl font-bold mt-8 mb-3 text-slate-900 dark:text-white">{children}</h3>,
    p: ({children}) => <p className="text-[17px] leading-[1.75] text-slate-700 dark:text-slate-300 mb-6">{children}</p>,
    ul: ({children}) => <ul className="list-disc pl-6 space-y-2 mb-6 text-slate-700 dark:text-slate-300">{children}</ul>,
    ol: ({children}) => <ol className="list-decimal pl-6 space-y-2 mb-6 text-slate-700 dark:text-slate-300">{children}</ol>,
    a: ({href, children}) => {
      const isInternal = !href || href.startsWith("/") || href.startsWith("#") || href.includes("apex-nepal.com");
      if (isInternal) {
        return <a href={href} className="text-indigo-600 dark:text-indigo-400 underline font-semibold hover:text-indigo-700">{children}</a>;
      }
      const rel = isAffiliateHref(href) ? "noopener noreferrer sponsored" : "noopener noreferrer";
      return <a href={href} target="_blank" rel={rel} className="text-indigo-600 dark:text-indigo-400 underline font-semibold hover:text-indigo-700">{children}</a>;
    },
    blockquote: ({children}) => <blockquote className="border-l-4 border-slate-300 dark:border-slate-700 pl-5 italic my-8 text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/50 py-4 rounded-r-xl">{children}</blockquote>,
    img: ({src,alt,title:caption}) => (
      <figure className="my-10">
        {/* eslint-disable-next-line @next/next/no-img-element -- Markdown images may come from arbitrary author-provided URLs. */}
        <img src={imageKitDeliveryUrl(src)} alt={alt||title} className="rounded-2xl w-full h-auto border border-slate-200 dark:border-slate-800" loading="lazy" decoding="async" />
        {(caption || alt) && <figcaption className="text-xs text-slate-500 mt-2 text-center">{caption || alt}</figcaption>}
      </figure>
    ),
    code({inline,className,children,...props}){
      if(inline) return <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-[0.9em] font-mono" {...props}>{children}</code>
      return <pre className="bg-slate-950 text-slate-100 p-5 rounded-2xl overflow-x-auto my-8 text-sm"><code>{children}</code></pre>
    },
    table: ({children}) => <div className="overflow-x-auto my-8"><table className="w-full text-sm border border-slate-200 dark:border-slate-800 rounded-xl">{children}</table></div>,
    th: ({children}) => <th className="text-left px-4 py-3 bg-slate-50 dark:bg-slate-900 font-bold border-b border-slate-200 dark:border-slate-800">{children}</th>,
    td: ({children}) => <td className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 align-top">{children}</td>,
  };

  return (
    <div className="flex-1 bg-white dark:bg-slate-950">
      <article lang={contentLang} className="max-w-3xl mx-auto px-6 py-10 sm:py-16">
        {/* Breadcrumbs — real category page, never /?category= (playbook §5.4) */}
        <nav className="text-xs text-slate-500 mb-6 flex items-center gap-2 flex-wrap" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-slate-700 dark:hover:text-slate-300">Home</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-slate-700 dark:hover:text-slate-300">Guides</Link>
          <span>/</span>
          <Link href={categoryPage} className="hover:text-slate-700 dark:hover:text-slate-300">{category}</Link>
          <span>/</span>
          <span className="text-slate-400 truncate max-w-[200px]">{title.slice(0,60)}</span>
        </nav>

        <Link href="/blog" className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white mb-6">
          <ArrowLeft className="w-3.5 h-3.5"/> Back to stories
        </Link>

        {/* Header */}
        <header className="mb-8">
          <div className="text-[11px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-3">{category}</div>
          <h1 className="text-[30px] sm:text-[42px] font-black leading-[1.15] tracking-tight text-slate-900 dark:text-white mb-4">{title}</h1>
          {description && (
            <p className="text-[18px] text-slate-600 dark:text-slate-300 leading-relaxed">{description}</p>
          )}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500 mt-5">
            <time dateTime={article.published_at || article.created_at}>Published {published}</time>
            {updated && <><span>•</span><span>Updated {updated}</span></>}
            <span>•</span>
            <span>{readMinutes} min read</span>
          </div>
        </header>

        {/* Author box – real E-E-A-T */}
        <div className="flex items-start gap-4 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 mb-8">
          <Image src={authorAvatar} alt={authorName} width={56} height={56} className="rounded-full object-cover border border-slate-200 dark:border-slate-700 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center flex-wrap gap-2">
              <Link href={authorProfileHref} className="font-black text-slate-900 dark:text-white hover:text-indigo-600">
                {authorName}
              </Link>
              <span className="text-[11px] bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded-full font-bold text-slate-700 dark:text-slate-300">Verified author</span>
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400 font-semibold mt-0.5">{authorRole}</div>
            {authorBio && <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed max-w-xl">{authorBio}</p>}
            <div className="text-[11px] mt-2 space-x-3">
              {author.website && <a href={author.website} target="_blank" rel="noopener" className="text-indigo-600 dark:text-indigo-400 underline font-bold">Website</a>}
              {author.twitter && <a href={author.twitter} target="_blank" rel="noopener" className="text-indigo-600 dark:text-indigo-400 underline font-bold">X</a>}
              {author.linkedin && <a href={author.linkedin} target="_blank" rel="noopener" className="text-indigo-600 dark:text-indigo-400 underline font-bold">LinkedIn</a>}
              <Link href={authorProfileHref} className="text-slate-600 dark:text-slate-400 underline">Full profile →</Link>
            </div>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <button onClick={handleBookmark} className={`p-2.5 rounded-xl border text-xs font-bold transition ${bookmarked ? 'bg-indigo-600 text-white border-indigo-600':'border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'}`} aria-label="Bookmark">
              <Bookmark className={`w-4 h-4 ${bookmarked?'fill-current':''}`} />
            </button>
            <button onClick={handleShare} className="p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 relative" aria-label="Share">
              <Share2 className="w-4 h-4" />
              {shareToast && <span className="absolute -top-9 left-1/2 -translate-x-1/2 text-[10px] bg-slate-900 text-white px-2 py-1 rounded whitespace-nowrap">Link copied</span>}
            </button>
          </div>
        </div>

        {/* Affiliate disclosure (playbook §12.2) — shown when the post's
            has_affiliate_links flag is set in Supabase. */}
        {hasAffiliate && (
          <div className="mb-8 p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            <strong>Disclosure:</strong> Some links in this guide are affiliate links. If you sign up or buy through them, Apex Nepal may earn a commission at no extra cost to you. Commissions never decide our rankings — see <Link href="/editorial" className="underline font-bold">how we test and rank</Link>.
          </div>
        )}

        {/* Reviewed-by line for YMYL posts (playbook §8) */}
        {reviewerName && (
          <div className="mb-8 text-xs text-slate-600 dark:text-slate-400">
            Reviewed by{" "}
            {reviewerUrl ? (
              <a href={reviewerUrl} target="_blank" rel="noopener" className="font-bold underline text-indigo-600 dark:text-indigo-400">{reviewerName}</a>
            ) : (
              <strong>{reviewerName}</strong>
            )}
            {updated ? ` • Last reviewed ${updated}` : ""}
          </div>
        )}

        {/* YMYL disclaimer */}
        {(isFinance || isHealth || isLegal) && (
          <div className="mb-8 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
            <strong>Disclaimer:</strong> {isFinance && "This is not financial advice. Rates and fees change frequently – verify in the provider app before transferring. See our "}
            {isHealth && "This is educational content only, not medical advice. Consult a qualified professional. See our "}
            {isLegal && "General information only, not legal advice. Confirm with official government sources. See our "}
            <Link href="/disclaimer" className="underline font-bold">full disclaimer</Link>.
          </div>
        )}

        {/* Feature image */}
        {article.image_url && (
          <figure className="mb-10">
            <div className="relative w-full aspect-[16/9] max-h-[520px]">
              <Image src={article.image_url} alt={title} fill className="rounded-2xl border border-slate-200 dark:border-slate-800 object-cover" sizes="(max-width: 768px) 100vw, 768px" quality={85} priority />
            </div>
          </figure>
        )}

        {/* Article body */}
        <div className="prose max-w-none dark:prose-invert">
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
            {article.content || ""}
          </ReactMarkdown>
        </div>

        {/* How I tested this (playbook §6.3) — renders the post's own
            tested_method notes (dates, device, network, amounts, what
            failed) when filled in; falls back to the generic box. */}
        <div className="mt-12 p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm">
          <div className="font-black mb-2">{testedMethod ? "How I tested this" : "How we verified this"}</div>
          {testedMethod ? (
            <p className="text-slate-600 dark:text-slate-400 text-[13px] leading-relaxed whitespace-pre-line">{testedMethod}</p>
          ) : null}
          <ul className="text-slate-600 dark:text-slate-400 space-y-1 list-disc pl-5 text-[13px] mt-2">
            <li>Author: {authorName} – {authorRole}</li>
            {reviewerName && <li>Reviewed by: {reviewerName}</li>}
            <li>Published {published}{updated ? ` • Last updated ${updated}` : ""}</li>
            <li>Full method: <Link href="/how-we-test" className="underline text-indigo-600 dark:text-indigo-400">How we test</Link> • <Link href="/corrections" className="underline text-indigo-600 dark:text-indigo-400">Corrections log</Link></li>
            <li>Found an error? <a href="mailto:editor@apex-nepal.com" className="underline text-indigo-600 dark:text-indigo-400">editor@apex-nepal.com</a></li>
          </ul>
        </div>

        {/* Sources list (playbook §4/§6.3): official/primary links for
            YMYL posts, from the `sources` column. */}
        {sources.length > 0 && (
          <div className="mt-6 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 text-sm">
            <div className="font-black mb-3">Sources</div>
            <ol className="list-decimal pl-5 space-y-1.5 text-[13px]">
              {sources.map((s) => (
                <li key={s.url}>
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 underline break-words">{s.label}</a>
                </li>
              ))}
            </ol>
            {updated && <p className="text-xs text-slate-500 mt-3">Fees, limits and rules checked against these sources; last updated {updated}.</p>}
          </div>
        )}

        {/* Hub-and-spoke internal linking (playbook §6.4): up to the hub,
            across to sibling guides. In-text links still need to be added
            in the article body itself — see the implementation report. */}
        {(hub || related.length > 0) && (
          <div className="mt-12">
            <h2 className="text-xl font-black mb-4">Keep reading</h2>
            <div className="grid gap-3">
              {related.map((r) => (
                <Link key={r.slug} href={`/blog/${r.slug}`} className="block p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1">{normalizeCategory(r.category, r.title) || "Guide"}</div>
                  <div className="font-bold leading-snug">{cleanTitle(r.title)}</div>
                  {r.meta_description && <div className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mt-1">{cleanExcerpt(r.meta_description)}</div>}
                </Link>
              ))}
            </div>
            {hub && (
              <p className="text-sm mt-4">
                More in this series: <Link href={hub.href} className="font-bold underline text-indigo-600 dark:text-indigo-400">{hub.label}</Link>
                {" • "}
                <Link href={categoryPage} className="underline text-slate-600 dark:text-slate-400">All {category} guides</Link>
              </p>
            )}
          </div>
        )}

        {/* Share / bookmark footer */}
        <div className="flex flex-wrap items-center gap-3 mt-10 pt-6 border-t border-slate-200 dark:border-slate-800">
          <button onClick={handleShare} className="btn btn--ghost !py-2 !text-[0.875rem]">Share article</button>
          <button onClick={handleBookmark} className="btn btn--ghost !py-2 !text-[0.875rem]">
            <IconCheck className="icon icon--15" />
            {bookmarked ? "Saved" : "Save to reading list"}
          </button>
          <Link href="/corrections" className="text-xs text-slate-500 ml-auto underline">Report a correction</Link>
        </div>

        {/* Author footer card */}
        <div className="mt-12 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-4">
            <Image src={authorAvatar} width={48} height={48} className="rounded-full" alt={authorName}/>
            <div>
              <div className="font-black">{authorName}</div>
              <div className="text-xs text-slate-600 dark:text-slate-400">{authorRole}</div>
            </div>
            <Link href={authorProfileHref} className="ml-auto text-xs font-bold text-indigo-600 dark:text-indigo-400">View profile →</Link>
          </div>
          {authorBio && <p className="text-sm text-slate-600 dark:text-slate-400 mt-3">{authorBio}</p>}
        </div>

        {/* Comments */}
        <div className="mt-16">
          <DiscussionThread articleSlug={decodeURIComponent(slug)} />
        </div>

        {/* CTA */}
        <div className="mt-20 p-8 rounded-2xl bg-slate-900 text-white text-center">
          <h3 className="text-xl font-black mb-2">Want to publish on Apex?</h3>
          <p className="text-slate-300 text-sm mb-5">Real authors. Tested stories. Global audience.</p>
          <Link href="/studio" className="inline-block px-5 py-3 bg-white text-slate-900 rounded-xl font-black text-sm">Write your story →</Link>
        </div>

      </article>

      {/* Article JSON-LD breadcrumbs will be injected server-side */}
    </div>
  );
}
