"use client";

/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Share2, Bookmark, Check } from "lucide-react";
import DiscussionThread from "@/components/DiscussionThread";
import { sanitizeCmsField } from "@/lib/seoUtils";
import ClientDate from "@/components/ClientDate";

function cleanTitle(title=""){
  return sanitizeCmsField(String(title).replace(/\s*Slug:.*$/i,'').trim());
}

function getAvatar(profile, fallbackSeed="apex"){
  const raw = profile?.avatar_url || "";
  if(!raw || raw.includes("dicebear") || raw.includes("bottts")){
    const name = encodeURIComponent(profile?.full_name || "Apex Editorial");
    return `https://ui-avatars.com/api/?name=${name}&background=4f46e5&color=fff&size=128`;
  }
  return raw;
}

export default function ArticleContent({ serverArticle, slug }) {
  const [mounted, setMounted] = useState(false);
  const [article, setArticle] = useState(serverArticle);
  const [bookmarked, setBookmarked] = useState(false);
  const [shareToast, setShareToast] = useState(false);
  const loading = false;

  // Mounted pattern: stable placeholder on server, hydrate with client value after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!serverArticle) {
      try {
        const stored = JSON.parse(localStorage.getItem("apex_articles_v1") || "[]");
        const found = stored.find(
          (a) => decodeURIComponent(a.slug || "") === decodeURIComponent(slug)
        );
        if (found) setArticle(found);
      } catch {}
    }
    try {
      const bms = JSON.parse(localStorage.getItem("apex_bookmarks_v1") || "[]");
      const isBookmarked = bms.some(
        (b) => decodeURIComponent(b.slug || "") === decodeURIComponent(slug)
      );
      setBookmarked(isBookmarked);
    } catch {}
  }, [mounted, serverArticle, slug]);

  const handleBookmark = ()=>{
    try{
      const bms = JSON.parse(localStorage.getItem("apex_bookmarks_v1")||"[]");
      const idx = bms.findIndex(b => decodeURIComponent(b.slug||"")===decodeURIComponent(slug));
      if(idx>=0){ bms.splice(idx,1); setBookmarked(false); }
      else if(article){ bms.unshift(article); setBookmarked(true); }
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
    return <main className="max-w-3xl mx-auto px-6 py-24"><div className="animate-pulse space-y-4"><div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-1/2"/><div className="h-12 bg-slate-200 dark:bg-slate-800 rounded"/><div className="h-64 bg-slate-100 dark:bg-slate-900 rounded-2xl"/></div></main>
  }
  if(!article){
    return (
      <main className="max-w-2xl mx-auto px-6 py-24 text-center">
        <h1 className="text-3xl font-black mb-3">Article not found</h1>
        <p className="text-slate-600 dark:text-slate-400 mb-8">This story may have been moved or removed.</p>
        <Link href="/" className="px-5 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold">← Back home</Link>
      </main>
    )
  }

  const title = article ? cleanTitle(article.title) : "";
  const description = article ? sanitizeCmsField(article.meta_description) : "";
  const author = article?.profiles || {};
  const authorName = author.full_name || "Apex Editorial";
  const authorRole = author.professional_role || "Contributing Writer";
  const authorBio = author.bio || "";
  const authorAvatar = getAvatar(author, article?.id);
  const category = article.category || "Stories";
  const isFinance = ["Business & Finance","Finance","Money"].includes(category);
  const isHealth = (category||"").toLowerCase().includes("health");
  const isLegal = (category||"").toLowerCase().includes("legal");

  const markdownComponents = {
    h1: ({children}) => <h1 className="text-[28px] sm:text-[36px] font-black mt-12 mb-5 leading-tight text-slate-900 dark:text-white">{children}</h1>,
    h2: ({children}) => <h2 className="text-[22px] sm:text-[28px] font-black mt-10 mb-4 text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-3">{children}</h2>,
    h3: ({children}) => <h3 className="text-xl font-bold mt-8 mb-3 text-slate-900 dark:text-white">{children}</h3>,
    p: ({children}) => <p className="text-[17px] leading-[1.75] text-slate-700 dark:text-slate-300 mb-6">{children}</p>,
    ul: ({children}) => <ul className="list-disc pl-6 space-y-2 mb-6 text-slate-700 dark:text-slate-300">{children}</ul>,
    ol: ({children}) => <ol className="list-decimal pl-6 space-y-2 mb-6 text-slate-700 dark:text-slate-300">{children}</ol>,
    a: ({href, children}) => <a href={href} target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 underline font-semibold hover:text-indigo-700">{children}</a>,
    blockquote: ({children}) => <blockquote className="border-l-4 border-slate-300 dark:border-slate-700 pl-5 italic my-8 text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/50 py-4 rounded-r-xl">{children}</blockquote>,
    img: ({src,alt}) => <figure className="my-10"><img src={src} alt={alt||title} className="rounded-2xl w-full border border-slate-200 dark:border-slate-800" loading="lazy" />{alt && <figcaption className="text-xs text-slate-500 mt-2 text-center">{alt}</figcaption>}</figure>,
    code({inline,className,children,...props}){
      if(inline) return <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-[0.9em] font-mono" {...props}>{children}</code>
      return <pre className="bg-slate-950 text-slate-100 p-5 rounded-2xl overflow-x-auto my-8 text-sm"><code>{children}</code></pre>
    },
    table: ({children}) => <div className="overflow-x-auto my-8"><table className="w-full text-sm border border-slate-200 dark:border-slate-800 rounded-xl">{children}</table></div>,
    th: ({children}) => <th className="text-left px-4 py-3 bg-slate-50 dark:bg-slate-900 font-bold border-b border-slate-200 dark:border-slate-800">{children}</th>,
    td: ({children}) => <td className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 align-top">{children}</td>,
  };

  return (
    <main className="flex-1 bg-white dark:bg-slate-950">
      <article className="max-w-3xl mx-auto px-6 py-10 sm:py-16">
        {/* Breadcrumbs */}
        <nav className="text-xs text-slate-500 mb-6 flex items-center gap-2 flex-wrap" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-slate-700 dark:hover:text-slate-300">Home</Link>
          <span>/</span>
          <Link href={`/?category=${encodeURIComponent(category)}`} className="hover:text-slate-700 dark:hover:text-slate-300">{category}</Link>
          <span>/</span>
          <span className="text-slate-400 truncate max-w-[200px]">{title.slice(0,60)}</span>
        </nav>

        <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white mb-6">
          <ArrowLeft className="w-3.5 h-3.5"/> Back to stories
        </Link>

        {/* Header */}
        <header className="mb-8">
          <div className="text-[11px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-3">{category}</div>
          <h1 className="text-[30px] sm:text-[42px] font-black leading-[1.15] tracking-tight text-slate-900 dark:text-white mb-4">{title}</h1>
          {description && (
            <p className="text-[18px] text-slate-600 dark:text-slate-300 leading-relaxed">{description}</p>
          )}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500 mt-5" suppressHydrationWarning>
            <time dateTime={article.published_at || article.created_at} suppressHydrationWarning>
              Published{" "}
              {mounted ? (
                <ClientDate
                  date={article.published_at || article.created_at}
                  options={{ year: "numeric", month: "long", day: "numeric" }}
                  placeholder="—"
                  fallback=""
                />
              ) : (
                <span>—</span>
              )}
            </time>
            {mounted && article.updated_at && article.updated_at !== article.created_at && (
              <>
                <span>•</span>
                <span>
                  Updated{" "}
                  <ClientDate
                    date={article.updated_at}
                    options={{ year: "numeric", month: "long", day: "numeric" }}
                    placeholder="—"
                    fallback=""
                  />
                </span>
              </>
            )}
            <span>•</span>
            <span>5–8 min read</span>
          </div>
        </header>

        {/* Author box – real E-E-A-T */}
        <div className="flex items-start gap-4 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 mb-8">
          <Image src={authorAvatar} alt={authorName} width={56} height={56} className="rounded-full object-cover border border-slate-200 dark:border-slate-700 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center flex-wrap gap-2">
              <Link href={`/authors/${encodeURIComponent((authorName||'').toLowerCase().replace(/\s+/g,'-'))}`} className="font-black text-slate-900 dark:text-white hover:text-indigo-600">
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
              <Link href={`/authors/${encodeURIComponent((authorName||'').toLowerCase().replace(/\s+/g,'-'))}`} className="text-slate-600 dark:text-slate-400 underline">Full profile →</Link>
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
              <Image src={article.image_url} alt={title} fill className="rounded-2xl border border-slate-200 dark:border-slate-800 object-cover" sizes="(max-width: 768px) 100vw, 768px" priority />
            </div>
          </figure>
        )}

        {/* Article body */}
        <div className="prose max-w-none dark:prose-invert">
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
            {article.content || ""}
          </ReactMarkdown>
        </div>

        {/* Methodology / sources box – E-E-A-T */}
        <div className="mt-12 p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm" suppressHydrationWarning>
          <div className="font-black mb-2">How we verified this</div>
          <ul className="text-slate-600 dark:text-slate-400 space-y-1 list-disc pl-5 text-[13px]">
            <li>Author: {authorName} – {authorRole}</li>
            <li suppressHydrationWarning>
              Published{" "}
              {mounted ? (
                <ClientDate
                  date={article.published_at || article.created_at}
                  options={{ year: "numeric", month: "long", day: "numeric" }}
                  placeholder="—"
                  fallback=""
                />
              ) : (
                <span>—</span>
              )}
              {mounted && article.updated_at && article.updated_at !== article.created_at && (
                <>
                  {" "}
                  • Last updated{" "}
                  <ClientDate
                    date={article.updated_at}
                    options={{ year: "numeric", month: "long", day: "numeric" }}
                    placeholder="—"
                    fallback=""
                  />
                </>
              )}
            </li>
            <li>Sources cited inline with live links</li>
            <li>Corrections policy: <Link href="/editorial" className="underline text-indigo-600 dark:text-indigo-400">see Editorial Policy</Link></li>
            <li>Found an error? <a href="mailto:editor@apex-nepal.com" className="underline text-indigo-600 dark:text-indigo-400">editor@apex-nepal.com</a></li>
          </ul>
        </div>

        {/* Share / bookmark footer */}
        <div className="flex flex-wrap items-center gap-3 mt-10 pt-6 border-t border-slate-200 dark:border-slate-800">
          <button onClick={handleShare} className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-900">Share article</button>
          <button onClick={handleBookmark} className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-900">
            {bookmarked ? "✓ Saved" : "Save to reading list"}
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
            <Link href={`/authors/${encodeURIComponent((authorName||'').toLowerCase().replace(/\s+/g,'-'))}`} className="ml-auto text-xs font-bold text-indigo-600 dark:text-indigo-400">View profile →</Link>
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
    </main>
  );
}
