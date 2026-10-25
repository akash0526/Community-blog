import { notFound } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { SITE_URL } from "@/lib/articles";
import { cleanBio, cleanExcerpt } from "@/lib/seoUtils";
import { FOUNDER } from "@/lib/siteConfig";

export const revalidate = 120;

// Last-resort founder profile, ONLY for the canonical founder slug. This
// guarantees the 301 target (/authors/akash-adhikari) can never 404 —
// e.g. in the window before the Supabase author-merge runs, when no row
// may match by username or exact name-slug yet. It renders noindex
// (see generateMetadata) until the real profile exists.
const FOUNDER_FALLBACK = {
  id: "fallback-akash",
  full_name: FOUNDER.name,
  professional_role: FOUNDER.role,
  bio: "Full-stack developer (Next.js, Supabase) from Nepal. I test remittance rails, hosting, and AI tools from Nepali networks, and build Apex Nepal as an open publishing directory.",
  avatar_url: "https://avatars.githubusercontent.com/u/148329502?v=4",
  email: "editor@apex-nepal.com",
  website: "https://github.com/akash0526",
  location: "Nepal",
  expertise: ["Remittance tech", "Nepal tools", "Next.js", "Supabase"],
};

async function findAuthorBySlug(slug: string){
  // 1) Canonical byline URL: exact `username` match (playbook §5.2 — one
  //    author, one URL). Tolerates the column not existing yet.
  try{
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("username", slug.toLowerCase())
      .maybeSingle();
    if(!error && data) return data;
  }catch{}
  // 2) Name-derived slug, EXACT match only. The old code fell back to
  //    `data[0]` of a first-name ilike search, which could render the
  //    WRONG person at a byline URL. No exact match => 404.
  try{
    const nameGuess = slug.replace(/-/g, ' ');
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .ilike("full_name", `%${nameGuess.split(' ')[0]}%`)
      .limit(20);
    if(data && data.length){
      const exact = data.find(p => (p.full_name||'').toLowerCase().replace(/\s+/g,'-') === slug.toLowerCase());
      if(exact) return exact;
    }
  }catch{}
  return null;
}

/** Single resolver shared by generateMetadata and the page, so the two
 *  can never disagree (metadata previously 404ed before the page's
 *  founder fallback could render). */
async function resolveAuthor(slug: string){
  const author = await findAuthorBySlug(slug);
  if(author) return { profile: author, isFallback: false };
  if(slug.toLowerCase() === FOUNDER.slug) return { profile: FOUNDER_FALLBACK, isFallback: true };
  return { profile: null, isFallback: false };
}

async function getArticlesByAuthor(authorId: string){
  try{
    const { data } = await supabase
      .from("articles")
      .select("title, slug, meta_description, published_at, category, image_url")
      .eq("author_id", authorId)
      .eq("status", "published")
      .order("published_at", { ascending: false });
    return data || [];
  }catch{ return [] }
}

export async function generateMetadata({ params }: { params: Promise<{slug:string}>}){
  const { slug } = await params;
  const { profile: author, isFallback } = await resolveAuthor(slug);
  if(!author){
    // Real 404 (same soft-404 fix as /blog/[slug]).
    notFound();
  }
  const name = author.full_name;
  // Zero-post bylines ("No published stories") and the temporary founder
  // fallback stay reachable but out of the index (playbook §4).
  const articles = !isFallback && author.id ? await getArticlesByAuthor(author.id) : [];
  return {
    title: { absolute: `${name} – Author at Apex Nepal` },
    description: cleanBio(author.bio) || `${name} – ${author.professional_role||'Writer'} at Apex Nepal. Read all articles.`,
    alternates: { canonical: `/authors/${slug}` },
    ...(articles.length === 0 ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      title: `${name} – Apex Nepal`,
      description: author.bio || "",
      url: `${SITE_URL}/authors/${slug}`,
      type: "profile",
      images: author.avatar_url ? [{ url: author.avatar_url }] : [],
    }
  }
}

export default async function AuthorPage({ params }: { params: Promise<{slug:string}>}){
  const { slug } = await params;
  const { profile } = await resolveAuthor(slug);

  if(!profile) notFound();

  const articles = profile.id && !String(profile.id).startsWith("fallback")
    ? await getArticlesByAuthor(profile.id)
    : [];

  // Hide placeholder social URLs that point at a network's homepage.
  const isRealUrl = (u?: string) =>
    !!u && !/^(https?:\/\/)?(www\.)?(linkedin\.com|x\.com|twitter\.com|github\.com)\/?$/i.test(u.trim());
  const website = isRealUrl(profile.website) ? profile.website : null;
  const twitter = isRealUrl(profile.twitter) ? profile.twitter : null;
  const linkedin = isRealUrl(profile.linkedin) ? profile.linkedin : null;

  const knowsAbout = Array.isArray(profile.expertise)
    ? profile.expertise
    : profile.expertise
      ? String(profile.expertise).split(",").map((e: string) => e.trim())
      : undefined;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": profile.full_name,
    "url": `${SITE_URL}/authors/${slug}`,
    "image": profile.avatar_url,
    "jobTitle": profile.professional_role,
    "description": cleanBio(profile.bio),
    "worksFor": { "@type": "Organization", "name": "Apex Nepal", "url": SITE_URL },
    ...(knowsAbout?.length ? { "knowsAbout": knowsAbout } : {}),
    "sameAs": [
      website,
      twitter,
      linkedin,
      slug.toLowerCase() === FOUNDER.slug ? "https://github.com/akash0526" : null,
    ].filter(Boolean),
  };

  return (
    <div className="flex-1 bg-white dark:bg-slate-950">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-4xl mx-auto px-6 py-14 sm:py-20">
        <div className="flex flex-col sm:flex-row gap-8 items-start mb-12">
          <img src={profile.avatar_url?.includes('dicebear') ? `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.full_name)}&background=A8471F&color=fff&size=256` : profile.avatar_url} 
            alt={profile.full_name} className="w-28 h-28 rounded-2xl object-cover border border-slate-200 dark:border-slate-800" />
          <div className="flex-1">
            <h1 className="text-3xl sm:text-4xl font-black mb-2">{profile.full_name}</h1>
            <div className="text-indigo-600 dark:text-indigo-400 font-bold text-sm mb-3">{profile.professional_role || "Contributing Writer"}</div>
            {cleanBio(profile.bio) && <p className="text-slate-700 dark:text-slate-300 max-w-2xl leading-relaxed">{cleanBio(profile.bio)}</p>}
            <div className="flex flex-wrap gap-3 text-xs mt-4 font-bold">
              {profile.location ? (
                <span className="px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800">{profile.location}</span>
              ) : null}
              <a href="mailto:editor@apex-nepal.com" className="px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">Contact</a>
              {website && <a href={website} target="_blank" rel="noopener" className="underline text-slate-600 dark:text-slate-400">Website →</a>}
              {twitter && <a href={twitter} target="_blank" rel="noopener" className="underline text-slate-600 dark:text-slate-400">X →</a>}
              {linkedin && <a href={linkedin} target="_blank" rel="noopener" className="underline text-slate-600 dark:text-slate-400">LinkedIn →</a>}
            </div>
            {profile.expertise && (
              <div className="flex flex-wrap gap-2 mt-4 text-[11px]">
                {(Array.isArray(profile.expertise) ? profile.expertise : String(profile.expertise).split(',')).map((e:string,i:number)=>(
                  <span key={i} className="px-2.5 py-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full font-bold">{e.trim()}</span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-slate-200 dark:border-slate-800 pt-10">
          <h2 className="text-xl font-black mb-6">Articles by {profile.full_name.split(' ')[0]}</h2>
          {articles.length === 0 ? (
            <div className="text-slate-600 dark:text-slate-400 text-sm">
              <p className="mb-3">No published stories under this byline yet.</p>
              <p>
                Read the{" "}
                <Link href="/editorial" className="underline text-indigo-600">
                  editorial policy
                </Link>{" "}
                or{" "}
                <Link href="/write-for-us" className="underline text-indigo-600">
                  write for Apex
                </Link>
                .
              </p>
            </div>
          ) : (
            <div className="grid gap-5">
              {articles.map(a=>(
                <Link key={a.slug} href={`/blog/${a.slug}`} className="block p-5 border border-slate-200 dark:border-slate-800 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-900 transition">
                  <div className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mb-1">{a.category}</div>
                  <div className="font-black text-lg mb-1">{a.title}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">{cleanExcerpt(a.meta_description)}</div>
                  <div className="text-xs text-slate-500 mt-2">{a.published_at ? new Date(a.published_at).toLocaleDateString() : ""}</div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="mt-16 text-xs text-slate-500 border-t border-slate-200 dark:border-slate-800 pt-6">
          <p>Apex author profiles include: full name, photo, credentials, bio, location, social links, and full article archive. <Link href="/editorial" className="underline">Learn about our E-E-A-T standards</Link>.</p>
        </div>
      </div>
    </div>
  );
}
