import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Apex",
  description: "Contact the Apex editorial team. Corrections, press, partnerships, and author applications.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <main className="flex-1 bg-white dark:bg-slate-950 text-slate-900 dark:text-white">
      <div className="max-w-4xl mx-auto px-6 py-16 sm:py-24">
        <span className="text-xs font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Contact</span>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight mt-3 mb-4">Talk to a real human.</h1>
        <p className="text-lg text-slate-600 dark:text-slate-300 mb-12 max-w-2xl">
          We read every message. Typical reply: within 7 days for corrections and 24–48 hours for urgent partnership or press requests.
        </p>

        <div className="grid md:grid-cols-2 gap-10">
          <div className="space-y-8 text-[15px] leading-relaxed">
            <div>
              <div className="text-xs font-black uppercase tracking-wider text-slate-500 mb-1">Editorial</div>
              <a href="mailto:editor@apex-nepal.com" className="text-xl font-black text-indigo-600 dark:text-indigo-400">editor@apex-nepal.com</a>
              <p className="text-slate-600 dark:text-slate-400 mt-1">Corrections, fact-checks, story pitches, and resource suggestions for Nepal-tested tools.</p>
            </div>
            <div>
              <div className="text-xs font-black uppercase tracking-wider text-slate-500 mb-1">Press & Partnerships</div>
              <a href="mailto:press@apex-nepal.com" className="text-lg font-bold text-slate-900 dark:text-white">press@apex-nepal.com</a>
            </div>
            <div>
              <div className="text-xs font-black uppercase tracking-wider text-slate-500 mb-1">Legal / DMCA / Privacy</div>
              <a href="mailto:legal@apex-nepal.com" className="text-lg font-bold text-slate-900 dark:text-white">legal@apex-nepal.com</a>
            </div>
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
              <div className="text-xs font-black uppercase tracking-wider text-slate-500 mb-2">Postal</div>
              <p className="text-slate-700 dark:text-slate-300">
                Apex Editorial<br/>
                Butwal, Nepal<br/>
                Lumbini Province
              </p>
              <p className="text-xs text-slate-500 mt-3">No walk-ins. Email first.</p>
            </div>
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
              <div className="text-xs font-black uppercase tracking-wider text-slate-500 mb-2">Social</div>
              <p className="space-x-4 font-bold">
                <a href="https://github.com/akash0526" target="_blank" rel="noopener" className="text-indigo-600 dark:text-indigo-400 underline">GitHub</a>
                <a href="https://x.com/apex_nepal" target="_blank" rel="noopener" className="text-indigo-600 dark:text-indigo-400 underline">X / Twitter</a>
              </p>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8">
            <h2 className="text-xl font-black mb-4">Send a message</h2>
            <form method="POST" action="mailto:editor@apex-nepal.com" encType="text/plain" className="space-y-4">
              <div>
                <label className="block text-xs font-black mb-1.5 text-slate-700 dark:text-slate-300">Your name</label>
                <input name="name" required className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-3 text-sm" placeholder="Full name" />
              </div>
              <div>
                <label className="block text-xs font-black mb-1.5 text-slate-700 dark:text-slate-300">Email</label>
                <input type="email" name="email" required className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-3 text-sm" placeholder="you@example.com" />
              </div>
              <div>
                <label className="block text-xs font-black mb-1.5 text-slate-700 dark:text-slate-300">Topic</label>
                <select name="topic" className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-3 text-sm font-bold">
                  <option>Correction</option>
                  <option>Story pitch</option>
                  <option>Author application</option>
                  <option>Partnership</option>
                  <option>Press</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-black mb-1.5 text-slate-700 dark:text-slate-300">Message</label>
                <textarea name="message" required rows={5} className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-3 text-sm" placeholder="Be specific. Include URLs if reporting an error."></textarea>
              </div>
              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-3.5 rounded-xl transition">Send via email</button>
              <p className="text-[11px] text-slate-500 text-center">This opens your mail client. We’re building an in-app form – email is fastest today.</p>
            </form>
          </div>
        </div>

        <div className="mt-16 text-sm text-slate-500 border-t border-slate-200 dark:border-slate-800 pt-8">
          <p><strong>Corrections policy:</strong> see <a href="/editorial" className="underline text-indigo-600 dark:text-indigo-400 font-bold">Editorial Policy</a>. Verified errors are fixed within 24h with a public correction note.</p>
        </div>
      </div>
    </main>
  );
}
