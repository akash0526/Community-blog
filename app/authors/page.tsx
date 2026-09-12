import Link from "next/link";
import { supabase } from "@/lib/supabase";

export const metadata = {
  title: "Authors – Apex",
  description: "Meet the verified human authors publishing on Apex.",
};

export const revalidate = 300;

export default async function AuthorsIndex(){
  let authors = [];
  try{
    const { data } = await supabase.from("profiles").select("*").limit(50);
    authors = data || [];
  }catch{}
  if(authors.length===0){
    authors = [
      { full_name:"Akash Adhikari", professional_role:"Founder & Lead Editor", bio:"Full-stack developer in Doha. Remittance tech & Qatar expat guides.", avatar_url:"https://avatars.githubusercontent.com/u/148329502?v=4", slug:"akash-adhikari" }
    ];
  }
  return (
    <main className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-black mb-3">Authors</h1>
      <p className="text-slate-600 dark:text-slate-300 mb-10 max-w-2xl">Every Apex byline links to a real human with credentials, bio, and social proof. No AI farms. No robot avatars.</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {authors.map((a: { slug?: string; full_name?: string; avatar_url?: string; professional_role?: string; bio?: string })=>{
          const slug = a.slug || (a.full_name||'').toLowerCase().replace(/\s+/g,'-');
          const avatar = a.avatar_url?.includes('dicebear') ? `https://ui-avatars.com/api/?name=${encodeURIComponent(a.full_name || 'Apex')}&background=4f46e5&color=fff` : a.avatar_url;
          return (
            <Link key={slug} href={`/authors/${slug}`} className="border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:shadow-md transition bg-white dark:bg-slate-900">
              <img src={avatar} className="w-14 h-14 rounded-full mb-3 object-cover" alt={a.full_name} loading="lazy" decoding="async"/>
              <div className="font-black">{a.full_name}</div>
              <div className="text-xs text-indigo-600 dark:text-indigo-400 font-bold mb-2">{a.professional_role}</div>
              <div className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3">{a.bio}</div>
            </Link>
          )
        })}
      </div>
    </main>
  )
}
