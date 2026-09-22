import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Apex",
  description:
    "Apex Nepal is a hand-checked directory of tools, payment rails and guides that actually work for people building from Nepal.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="flex-1">
      <section className="hero" style={{ paddingBottom: "var(--section)" }}>
        <div className="wrap">
          <p className="eyebrow">
            <span className="num">01</span> About Apex
          </p>
          <h1>
            Built for people working <em>from here</em>.
          </h1>
          <p className="lede" style={{ marginTop: "1.25rem" }}>
            Apex Nepal is a hand-checked directory of the tools, payment rails
            and guides that actually work for freelancers, students, shop owners
            and writers based in Nepal.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap prose-apex" style={{ maxWidth: "720px" }}>
          <h2>Who runs this site</h2>
          <p>
            Apex is an independent editorial project founded in 2025 by{" "}
            <strong>Akash Adhikari</strong>, a full-stack developer and
            publisher from Nepal. There is no newsroom in San Francisco and no
            offshore content farm — one editor, public corrections, and a
            growing list of community writers.
          </p>

          <h2>Why we exist</h2>
          <p>
            Most “best tools” lists assume a US card, a US bank, and fibre that
            never drops. That is not how work happens in Kathmandu, Butwal, or
            Pokhara. We check whether a tool loads on NTC/Ncell, whether the
            free tier is usable, and whether a paid plan makes sense in NPR.
          </p>
          <p>
            The domain is apex-nepal.com because Nepal is the beat, not a
            garnish. Personal essays and community stories still have a home
            here — they just sit next to the directory, not instead of it.
          </p>

          <h2>Where we are based</h2>
          <ul>
            <li>
              <strong>Editorial base:</strong> Nepal
            </li>
            <li>
              <strong>Founding community:</strong> Nepal, with writers in the
              diaspora welcome
            </li>
            <li>
              <strong>Launched:</strong> November 2025
            </li>
          </ul>

          <h2>Editorial team</h2>
        </div>

        <div className="wrap">
          <div className="cards mt-8" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}>
            <div className="card !p-6">
              <img
                src="https://avatars.githubusercontent.com/u/148329502?v=4"
                alt="Akash Adhikari"
                width={64}
                height={64}
                className="mb-4 h-16 w-16 rounded-full object-cover"
              />
              <h3>Akash Adhikari</h3>
              <p className="card__tag mt-2">Founder & lead editor</p>
              <p className="mt-3">
                Full-stack engineer (Next.js / Supabase). Tests remittance
                rails, hosting, and AI tools from Nepali networks.
              </p>
              <p className="mt-4 text-[0.8125rem]">
                <a
                  href="https://github.com/akash0526"
                  className="link"
                  target="_blank"
                  rel="noopener"
                >
                  GitHub
                </a>
                {" · "}
                <Link href="/authors/akash-adhikari" className="link">
                  Profile
                </Link>
              </p>
            </div>
            <div className="card !p-6">
              <div className="mb-4 grid h-16 w-16 place-items-center rounded-full bg-[var(--clay-tint)] font-[family-name:var(--font-display)] text-xl text-[var(--clay)]">
                AC
              </div>
              <h3>Apex contributors</h3>
              <p className="card__tag mt-2">Community writers</p>
              <p className="mt-3">
                Independent authors with a real byline, bio and sources. Guest
                posts are edited against the same Nepal-test bar.
              </p>
              <p className="mt-4 text-[0.8125rem]">
                <Link href="/write-for-us" className="link">
                  Apply to write
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap prose-apex" style={{ maxWidth: "720px" }}>
          <h2>How we make money</h2>
          <p>
            Apex may use affiliate links, display ads, and sponsored posts — all
            clearly labelled. See our{" "}
            <Link href="/editorial" className="link">
              Editorial Policy
            </Link>{" "}
            and{" "}
            <Link href="/disclaimer" className="link">
              financial disclaimer
            </Link>
            . We never accept payment to alter a test result.
          </p>

          <h2>Contact</h2>
          <p>
            Email{" "}
            <a href="mailto:editor@apex-nepal.com" className="link">
              editor@apex-nepal.com
            </a>
            . Postal address and press contacts live on the{" "}
            <Link href="/contact" className="link">
              contact page
            </Link>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
