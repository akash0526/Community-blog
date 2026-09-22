export const resourceCategories = [
	{
		id: "ai-tools",
		title: "AI Tools",
		pillar: "/ai-tools",
		audience: "Students, freelancers, and creators who need affordable AI help that works on Nepali internet.",
		resources: [
			{ name: "ChatGPT", url: "https://chatgpt.com", badge: "Freemium", status: "check first", why: "Best all-round free AI; works on NTC/Ncell data, no VPN." },
			{ name: "Gemini", url: "https://gemini.google.com", badge: "Freemium", status: "works", why: "One Google login; plugs into Gmail and Docs students already use." },
			{ name: "DeepSeek", url: "https://chat.deepseek.com", badge: "Free", status: "works", why: "Free and excellent at code/math; CS students' best free tutor." },
			{ name: "Meta AI", url: "https://www.meta.ai", badge: "Free", status: "check first", why: "Inside WhatsApp, Instagram, and Facebook already; zero new signup for beginners." },
			{ name: "Google AI Studio", url: "https://aistudio.google.com", badge: "Freemium", status: "works", why: "Free API playground; freelancers can build client chatbot demos free." },
			{ name: "Bing Image Creator", url: "https://www.bing.com/images/create", badge: "Free", status: "works", why: "Near-unlimited free AI images for blogs, thumbnails, and mockups." },
			{ name: "Harper", url: "https://writewithharper.com", badge: "Free", status: "works", why: "Free, private grammar checker for Upwork proposals and CVs." },
			{ name: "QuillBot", url: "https://quillbot.com/grammar-check", badge: "Freemium", status: "check first", why: "Paraphrase and grammar help; free tier is enough for many students." },
			{ name: "DeepL Translator", url: "https://www.deepl.com/translator", badge: "Freemium", status: "works", why: "Strong English-to-European-language quality for Upwork client communication." },
			{ name: "DeepL Write", url: "https://www.deepl.com/write", badge: "Freemium", status: "works", why: "AI rewrite and polish; pairs well with DeepL Translator." },
			{ name: "ElevenLabs", url: "https://elevenlabs.io", badge: "Freemium", status: "works", why: "Human-like voiceovers for faceless YouTube and client demos." },
			{ name: "TurboScribe", url: "https://turboscribe.ai", badge: "Freemium", status: "check first", why: "Lecture and meeting transcription with free daily minutes." },
			{ name: "Whisper", url: "https://github.com/openai/whisper", badge: "Free", status: "works", why: "Free offline transcription for private client calls." },
			{ name: "NVIDIA NIM", url: "https://build.nvidia.com/models", badge: "Free", status: "works", why: "Try top AI models with no signup." },
			{ name: "Ecosia AI", url: "https://www.ecosia.org/ai-chat", badge: "Free", status: "check first", why: "Unlimited chat, no account, plus an eco angle." },
			{ name: "Grammarly", url: "https://www.grammarly.com", affiliate: true, badge: "Paid", why: "Premium polish for client work. Verify NPR pricing before publishing." },
			{ name: "Canva", url: "https://www.canva.com", affiliate: true, badge: "Freemium", why: "Design posts and thumbnails; free tier plus Pro affiliate. Verify NPR." },
		],
	},
	{
		id: "freelancing",
		title: "Freelancing",
		pillar: "/freelancing-in-nepal",
		audience: "Profile, proposal, portfolio, and remote-work tools for Nepali freelancers.",
		resources: [
			{ name: "RX Resume", url: "https://rxresu.me", badge: "Free", status: "works", why: "Free, beautiful CV builder; export PDF for job mails." },
			{ name: "FlowCV", url: "https://flowcv.com", badge: "Freemium", status: "works", why: "Resume builder with templates; free tier works." },
			{ name: "RenderCV", url: "https://rendercv.com", badge: "Free", status: "works", why: "Markdown CVs developers love; clean PDFs." },
			{ name: "PeerList", url: "https://peerlist.io", badge: "Free", status: "works", why: "Portfolio network for developers/designers; alternative to a full website." },
			{ name: "Carrd", url: "https://carrd.co", badge: "Freemium", status: "works", why: "One-page freelancer site in an hour; free tier plus cheap Pro." },
			{ name: "Linkstack", url: "https://linkstack.org", badge: "Free", status: "works", why: "Free self-hosted link-in-bio; own your links." },
			{ name: "Real Work From Anywhere", url: "https://www.realworkfromanywhere.com", badge: "Free", status: "works", why: "Remote board with Asia-friendly roles." },
			{ name: "Remote in Tech index", url: "https://remoteintech.company", badge: "Free", status: "works", why: "See which companies hire remotely and build a target list." },
			{ name: "Nomad List", url: "https://nomads.com", badge: "Freemium", status: "works", why: "See remote pay and cost data; Kathmandu data point exists." },
			{ name: "WorldTimeBuddy", url: "https://www.worldtimebuddy.com", badge: "Free", status: "works", why: "Compare Nepal Time with client time zones so calls are never missed." },
			{ name: "SimpleLogin", url: "https://simplelogin.io", badge: "Freemium", status: "works", why: "Professional email aliases for client work; hide personal Gmail." },
			{ name: "RolePad", url: "https://rolepad.com", badge: "Free", status: "works", why: "Track job applications in one board." },
			{ name: "Notion", url: "https://www.notion.com", affiliate: true, badge: "Freemium", why: "Proposals and client wikis. Verify NPR pricing." },
		],
	},
	{
		id: "hosting",
		title: "Blogging & Hosting",
		pillar: "/blogging-hosting",
		audience: "Domains, hosting, static sites, and content tools for Nepali bloggers.",
		resources: [
			{ name: "Hostinger", url: "https://www.hostinger.com", env: "NEXT_PUBLIC_AFFILIATE_HOSTINGER_URL", affiliate: true, badge: "Paid", why: "Primary pick; eSewa-linked cards work; LiteSpeed is fast on NTC. Verify intro and renewal NPR." },
			{ name: "Cloudflare", url: "https://www.cloudflare.com", affiliate: true, badge: "Free", why: "Free CDN/DNS; reduces load time from Nepal and no card needed for free tier." },
			{ name: "Namecheap", url: "https://www.namecheap.com", affiliate: true, badge: "Paid", why: "Domains only; keep domain separate from host. Verify NPR." },
			{ name: "WordPress.com", url: "https://wordpress.com", affiliate: true, badge: "Freemium", why: "Zero-hassle publishing for non-technical beginners. Verify NPR." },
			{ name: "Cloudflare Pages", url: "https://www.cloudflare.com/products/pages", badge: "Free", status: "works", why: "Free unlimited-bandwidth static hosting; test before buying." },
			{ name: "GitHub Pages", url: "https://docs.github.com/en/pages", badge: "Free", status: "works", why: "Free portfolio/blog hosting for technical users." },
			{ name: "Vercel", url: "https://vercel.com", badge: "Freemium", status: "works", why: "Free hobby hosting for Next.js and static sites." },
			{ name: "Astro", url: "https://astro.build", badge: "Free", status: "works", why: "Blazing static sites; great blog framework." },
			{ name: "Hugo", url: "https://gohugo.io", badge: "Free", status: "works", why: "Single-binary static generator; low-end-laptop friendly." },
			{ name: "Bear Blog", url: "https://bearblog.dev", badge: "Freemium", status: "check first", why: "Minimalist paid-simple blogging; distraction-free." },
			{ name: "LocalWP", url: "https://localwp.com", badge: "Free", status: "works", why: "Free local WordPress practice before paying for hosting." },
			{ name: "TinyURL", url: "https://tinyurl.com", badge: "Free", status: "works", why: "Short links for social promos." },
			{ name: "CoverView", url: "https://coverview.vercel.app", badge: "Free", status: "works", why: "Free blog banners and covers." },
		],
	},
	{
		id: "payments",
		title: "Digital Payments",
		pillar: "/digital-payments",
		audience: "Receive USD, compare fees, and keep local-wallet workflows clear.",
		resources: [
			{ name: "Payoneer", url: "https://www.payoneer.com", affiliate: true, badge: "Freemium", why: "Receive USD and withdraw to a Nepali bank. Verify fees/limits for Sept 2026." },
			{ name: "Wise", url: "https://wise.com", affiliate: true, badge: "Freemium", why: "Low-fee transfers; compare against Payoneer and verify NPR rails." },
			{ name: "eSewa", url: "https://esewa.com.np", badge: "Freemium", status: "works", why: "Local wallet for client payments and linked-card hosting. Confirm current card-linking in the app." },
			{ name: "Khalti", url: "https://khalti.com", badge: "Freemium", status: "works", why: "Second local wallet; useful when a client or host already bills through Khalti." },
			{ name: "Upwork direct to bank", url: "https://www.upwork.com/freelance-jobs/", badge: "Freemium", status: "check first", why: "US clients to Upwork to Nepali bank pipeline; document fees before relying on a payout." },
		],
	},
	{
		id: "business",
		title: "Small Business Tools",
		pillar: "/small-business-tools",
		audience: "Free and low-cost tools for a Nepali pasal, local service, or Facebook shop.",
		resources: [
			{ name: "Photopea", url: "https://www.photopea.com", badge: "Free", status: "works", why: "Free Photoshop in a browser for menus, price lists, and social posts." },
			{ name: "LibreOffice", url: "https://www.libreoffice.org", badge: "Free", status: "works", why: "Free Office; bills, invoices, stock sheets, and Nepali text." },
			{ name: "OnlyOffice", url: "https://www.onlyoffice.com", badge: "Free", status: "works", why: "MS-compatible alternative if LibreOffice formatting breaks." },
			{ name: "Obsidian", url: "https://obsidian.md", badge: "Free", status: "works", why: "Notes and inventory ideas; works offline during power cuts." },
			{ name: "BentoPDF", url: "https://bentopdf.com", badge: "Free", status: "works", why: "Private client-side PDF tools for quotations and invoices." },
			{ name: "Unsplash", url: "https://unsplash.com", badge: "Free", status: "works", why: "Free product/lifestyle photos for social pages." },
			{ name: "Pixabay", url: "https://pixabay.com", badge: "Free", status: "check first", why: "Second free stock source." },
			{ name: "Squoosh", url: "https://squoosh.app", badge: "Free", status: "works", why: "Shrink product photos so pages load on 4G." },
			{ name: "Pixelcut", url: "https://www.pixelcut.ai", badge: "Freemium", status: "works", why: "One-click product background remover for Daraz and Facebook shops." },
			{ name: "OCR.space", url: "https://ocr.space", badge: "Free", status: "works", why: "Scan paper bills to text free." },
			{ name: "MEGA", url: "https://mega.io", badge: "Freemium", status: "works", why: "20 GB free to back up shop records off the phone." },
			{ name: "Filen", url: "https://filen.io", badge: "Freemium", status: "works", why: "10 GB free encrypted backup." },
			{ name: "Bitwarden", url: "https://bitwarden.com", badge: "Free", status: "works", why: "Free password manager; stop reusing one password everywhere." },
			{ name: "Ente Auth", url: "https://ente.com/auth", badge: "Free", status: "works", why: "Free 2FA app for Gmail, eSewa, and bank logins." },
			{ name: "uBlock Origin", url: "https://github.com/gorhill/uBlock", badge: "Free", status: "works", why: "Block scam ads and malware on shop PCs." },
			{ name: "Super Productivity", url: "https://super-productivity.com", badge: "Free", status: "works", why: "Free time/task tracker for tiny teams." },
			{ name: "Ente QR / Mini QR", url: "https://qr.ente.com", secondaryUrl: "https://mini-qr-code-generator.vercel.app", badge: "Free", status: "works", why: "Free QR codes for menus, payments, and cards." },
			{ name: "Daraz", url: "https://www.daraz.com.np", affiliate: true, badge: "Freemium", why: "SMB selling channel. Verify affiliate program terms." },
		],
	},
	{
		id: "students",
		title: "Students & Learning",
		pillar: "/resources#students",
		audience: "Free learning, coding, books, English, and exam prep resources.",
		resources: [
			{ name: "MIT OpenCourseWare", url: "https://ocw.mit.edu", badge: "Free", status: "works", why: "Real MIT courses free; CS and math gold." },
			{ name: "Khan Academy", url: "https://www.khanacademy.org", badge: "Free", status: "works", why: "+2 Science and test prep; low-data friendly." },
			{ name: "edX", url: "https://www.edx.org", badge: "Freemium", status: "works", why: "University courses; audit many courses free." },
			{ name: "The Odin Project", url: "https://www.theodinproject.com", badge: "Free", status: "works", why: "Free full-stack path; portfolio can become freelance proof." },
			{ name: "FullStackOpen", url: "https://fullstackopen.com", badge: "Free", status: "works", why: "Free React/Node course from the University of Helsinki." },
			{ name: "JavaScript.info", url: "https://javascript.info", badge: "Free", status: "works", why: "Best free JS tutorial, chapter by chapter." },
			{ name: "MDN", url: "https://developer.mozilla.org", badge: "Free", status: "works", why: "The web docs; bookmark for life." },
			{ name: "MS AI-For-Beginners", url: "https://github.com/microsoft/AI-For-Beginners", badge: "Free", status: "works", why: "Free AI curriculum with labs." },
			{ name: "MS ML-For-Beginners", url: "https://github.com/microsoft/ML-For-Beginners", badge: "Free", status: "works", why: "Gentler ML on-ramp." },
			{ name: "LLM Course", url: "https://github.com/mlabonne/llm-course", badge: "Free", status: "works", why: "Free roadmap into LLM engineering." },
			{ name: "Anki", url: "https://apps.ankiweb.net", badge: "Free", status: "works", why: "Spaced-repetition flashcards for +2, medical, and engineering exams." },
			{ name: "AnkiDroid", url: "https://github.com/ankidroid/Anki-Android", badge: "Free", status: "works", why: "Free Anki on Android. Note that the iOS app is paid." },
			{ name: "Wolfram Alpha", url: "https://www.wolframalpha.com", badge: "Freemium", status: "works", why: "Computational answers for math and physics." },
			{ name: "Project Gutenberg", url: "https://www.gutenberg.org", badge: "Free", status: "works", why: "70k+ free legal ebooks." },
			{ name: "Open Library", url: "https://openlibrary.org", badge: "Free", status: "check first", why: "Borrow scanned books free; confirm in browser before publishing claims." },
			{ name: "Standard Ebooks", url: "https://standardebooks.org", badge: "Free", status: "works", why: "Beautifully formatted public-domain ebooks." },
			{ name: "OpenStax", url: "https://openstax.org", badge: "Free", status: "works", why: "Free peer-reviewed college textbooks." },
			{ name: "Open Textbook Library", url: "https://open.umn.edu/opentextbooks", badge: "Free", status: "works", why: "More free textbooks by subject." },
			{ name: "Free Programming Books", url: "https://ebookfoundation.github.io/free-programming-books-search", badge: "Free", status: "works", why: "Search every free coding book." },
			{ name: "IndiaBIX", url: "https://www.indiabix.com", badge: "Free", status: "works", why: "Aptitude tests for job exams and interviews." },
			{ name: "EFSET", url: "https://www.efset.org", badge: "Free", status: "works", why: "Free English certificate for CVs and Upwork." },
			{ name: "YouGlish", url: "https://youglish.com", badge: "Free", status: "works", why: "Hear any English word pronounced in real videos." },
			{ name: "OneLook", url: "https://onelook.com", badge: "Free", status: "works", why: "Multi-dictionary search in one box." },
		],
	},
];

export const monthlyPicks = [
	{ name: "DeepSeek", categoryId: "ai-tools", badge: "Free", what: "A strong free AI tutor for code and math.", why: "Great for CS students on a zero-NPR budget." },
	{ name: "Harper", categoryId: "ai-tools", badge: "Free", what: "Private grammar checking for proposals and CVs.", why: "Polishes client English without adding another paid subscription." },
	{ name: "Photopea", categoryId: "business", badge: "Free", what: "Photoshop-style editing in your browser.", why: "Make menus, price lists, and social posts from a shop laptop." },
	{ name: "Hostinger", categoryId: "hosting", badge: "Affiliate", what: "Beginner-friendly paid hosting.", why: "Useful when Nepali bloggers outgrow free static hosting." },
	{ name: "Payoneer guide", categoryId: "payments", badge: "Freemium", what: "USD receiving workflow for freelancers.", why: "Needs frequent fee checks, but it is a key Nepal earning pipeline." },
	{ name: "Anki", categoryId: "students", badge: "Free", what: "Spaced repetition for exams.", why: "Works offline and helps +2, medical, and engineering students retain more." },
];

export function getCategory(id) {
	return resourceCategories.find((category) => category.id === id);
}

export function resourceHref(resource) {
	if (resource.env && typeof process !== "undefined") {
		const fromEnv = process.env[resource.env];
		if (fromEnv) return fromEnv;
	}
	return resource.url || null;
}

export function countResources() {
	return resourceCategories.reduce((sum, category) => sum + category.resources.length, 0);
}

export function countByCategory() {
	return Object.fromEntries(
		resourceCategories.map((category) => [category.id, category.resources.length]),
	);
}
