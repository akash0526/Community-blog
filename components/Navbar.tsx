"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { motion, useScroll } from "framer-motion";
import {
	Briefcase,
	Compass,
	CreditCard,
	FileText,
	Globe,
	LogOut,
	LayoutDashboard,
	Menu,
	Pen,
	PenLine,
	Sparkles,
	Store,
	User,
	Users,
	X,
	type LucideIcon,
} from "lucide-react";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { ThemeToggle } from "./ThemeToggle";
import { cn } from "@/lib/utils";

// AuthModal (forms + supabase) is only needed after a click — keep it
// out of the initial page-load bundles (PSI "unused JavaScript").
const AuthModal = dynamic(() => import("./AuthModal"), { ssr: false });

interface NavItem {
	label: string;
	href: string;
	icon: LucideIcon;
}

const NAV_LINKS: NavItem[] = [
	{ label: "Resources", href: "/resources", icon: Compass },
	{ label: "Guides", href: "/blog", icon: FileText },
	{ label: "Tools", href: "/ai-tools", icon: Sparkles },
	{ label: "Freelancing", href: "/freelancing-in-nepal", icon: Briefcase },
	{ label: "About", href: "/about", icon: Users },
];

const MOBILE_LINKS: NavItem[] = [
	...NAV_LINKS,
	{ label: "Hosting", href: "/blogging-hosting", icon: Globe },
	{ label: "Payments", href: "/digital-payments", icon: CreditCard },
	{ label: "Business tools", href: "/small-business-tools", icon: Store },
	{ label: "Write for us", href: "/write-for-us", icon: PenLine },
];

function avatarFor(user: SupabaseUser | null) {
	const raw = user?.user_metadata?.avatar_url || "";
	if (raw && !raw.includes("dicebear") && !raw.includes("bottts")) return raw;
	const name = encodeURIComponent(
		user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Apex",
	);
	return `https://ui-avatars.com/api/?name=${name}&background=8b5cf6&color=fff&size=64`;
}

/**
 * Site navigation — glassmorphism redesign (plan §4).
 *
 * Keeps the behaviour of the previous header: lazy Supabase session
 * restore, demo-user support, avatar dropdown, shared AuthModal,
 * "Write a story" flow and active-route highlighting. The plan's
 * Home/Blogs/Community/Contact links do not exist on this site, so the
 * real routes are used instead. The scrolled glass state is driven by
 * SiteEffects toggling `.is-stuck` on #header (single source of truth).
 */
export default function Navbar() {
	const pathname = usePathname();
	const router = useRouter();
	const [user, setUser] = useState<SupabaseUser | null>(null);
	const [authModalOpen, setAuthModalOpen] = useState(false);
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [dropdownOpen, setDropdownOpen] = useState(false);

	const { scrollYProgress } = useScroll();

	useEffect(() => {
		// The Supabase client (~60 KB gzip) is not required to paint the
		// header: defer it until the browser is idle after load so it
		// leaves the FCP/LCP critical path (PSI "unused JavaScript" +
		// LCP insights). Returning readers just see their avatar upgrade
		// a moment later.
		let cancelled = false;
		let subscription: { unsubscribe: () => void } | null = null;
		let idleHandle: number | null = null;

		const initAuth = async () => {
			// Demo session restores first — localStorage only, no network.
			try {
				const demo = localStorage.getItem("apex_demo_user");
				if (demo && !cancelled) setUser(JSON.parse(demo));
			} catch {}
			try {
				const { supabase } = await import("@/lib/supabase");
				if (cancelled) return;
				const {
					data: { session },
				} = await supabase.auth.getSession();
				if (cancelled) return;
				if (session?.user) setUser(session.user);
				const { data } = supabase.auth.onAuthStateChange((_event, s) => {
					if (!cancelled && s?.user) setUser(s.user);
				});
				if (cancelled) data.subscription.unsubscribe();
				else subscription = data.subscription;
			} catch {}
		};

		const startIdleAuth = () => {
			idleHandle = window.requestIdleCallback
				? window.requestIdleCallback(initAuth, { timeout: 3000 })
				: window.setTimeout(initAuth, 1500);
		};
		if (document.readyState === "complete") startIdleAuth();
		else window.addEventListener("load", startIdleAuth, { once: true });

		return () => {
			cancelled = true;
			window.removeEventListener("load", startIdleAuth);
			if (idleHandle != null) {
				if (window.cancelIdleCallback) window.cancelIdleCallback(idleHandle);
				else window.clearTimeout(idleHandle);
			}
			subscription?.unsubscribe();
		};
	}, []);

	const handleLogout = async () => {
		const { supabase } = await import("@/lib/supabase");
		await supabase.auth.signOut();
		localStorage.removeItem("apex_demo_user");
		setUser(null);
		setDropdownOpen(false);
	};

	const handleAuthSuccess = useCallback((activeUser: SupabaseUser) => {
		setUser(activeUser);
		if (activeUser.id.startsWith("demo-")) {
			localStorage.setItem("apex_demo_user", JSON.stringify(activeUser));
		}
	}, []);

	const startWriting = () => {
		setMobileMenuOpen(false);
		if (user) router.push("/studio");
		else setAuthModalOpen(true);
	};

	const displayName =
		user?.user_metadata?.full_name ||
		user?.email?.split("@")[0] ||
		"Writer";

	return (
		<>
			{/* Scroll progress bar (plan §4) */}
			<motion.div
				aria-hidden="true"
				className="fixed inset-x-0 top-0 z-[110] h-1 origin-left bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500"
				style={{ scaleX: scrollYProgress }}
			/>

			<header id="header" className="header">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="flex h-20 items-center justify-between gap-4">
						{/* Logo */}
						<Link
							href="/"
							className="group relative"
							aria-label="Apex Nepal home"
							onClick={() => setMobileMenuOpen(false)}
						>
							<motion.span
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								className="gradient-text block font-display text-2xl font-bold"
							>
								Apex Nepal
							</motion.span>

							{/* Underline animation */}
							<motion.span
								aria-hidden="true"
								className="absolute -bottom-1 left-0 h-0.5 rounded-full bg-gradient-to-r from-purple-500 to-blue-500"
								initial={{ width: 0 }}
								whileHover={{ width: "100%" }}
								transition={{ duration: 0.3 }}
							/>
						</Link>

						{/* Desktop Navigation */}
						<div className="hidden items-center gap-6 md:flex lg:gap-8">
							{NAV_LINKS.map((link) => (
								<NavLink
									key={link.href}
									{...link}
									active={
										pathname === link.href ||
										pathname.startsWith(`${link.href}/`)
									}
								/>
							))}
						</div>

						<div className="flex items-center gap-3">
							<ThemeToggle />

							{user ? (
								<div className="relative hidden md:block">
									<button
										type="button"
										onClick={() => setDropdownOpen((v) => !v)}
										aria-expanded={dropdownOpen}
										aria-haspopup="true"
										// On mobile the name span is hidden and the avatar has
										// alt="", so the button needs its own accessible name.
										aria-label={`${displayName} account menu`}
										className="glass flex h-10 items-center gap-2 rounded-full px-2 transition-all hover:glass-strong"
									>
										<Image
											src={avatarFor(user)}
											alt=""
											width={28}
											height={28}
											className="h-7 w-7 rounded-full object-cover"
										/>
										<span className="hidden max-w-[8rem] truncate text-[0.8125rem] font-medium xl:inline">
											{displayName}
										</span>
									</button>

									{dropdownOpen && (
										<div className="glass-strong absolute right-0 top-[calc(100%+0.75rem)] z-50 w-64 rounded-2xl p-2 text-left shadow-2xl shadow-purple-500/10">
											<div className="border-b border-[var(--hairline)] px-3 pb-2 pt-1">
												<div className="mb-1 text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-[var(--ink-faint)]">
													Active author
												</div>
												<div className="truncate text-[0.8125rem] text-[var(--ink-muted)]">
													{user.email || "Author session"}
												</div>
											</div>
											<Link
												href="/dashboard"
												onClick={() => setDropdownOpen(false)}
												className="flex items-center gap-2 rounded-lg px-3 py-2 text-[0.875rem] text-[var(--ink-muted)] transition-colors hover:bg-[var(--clay-tint)] hover:text-[var(--clay)]"
											>
												<LayoutDashboard size={15} />
												Dashboard &amp; profile
											</Link>
											<button
												type="button"
												onClick={handleLogout}
												className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-left text-[0.875rem] text-[var(--ink-muted)] transition-colors hover:bg-[var(--clay-tint)] hover:text-[var(--clay)]"
											>
												<LogOut size={15} />
												Sign out
											</button>
										</div>
									)}
								</div>
							) : (
								<button
									type="button"
									onClick={() => setAuthModalOpen(true)}
									aria-label="Log in / Join"
									className="glass hidden h-10 w-10 place-items-center rounded-full transition-all hover:glass-strong md:grid"
								>
									<User size={16} />
								</button>
							)}

							<motion.button
								type="button"
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								onClick={startWriting}
								aria-label="Write a story"
								className="hidden items-center gap-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-purple-500/30 transition-shadow hover:shadow-purple-500/50 sm:flex"
							>
								<Pen size={16} />
								<span className="hidden lg:inline">Write a story</span>
							</motion.button>

							{/* Mobile Menu Button */}
							<button
								type="button"
								onClick={() => setMobileMenuOpen((v) => !v)}
								className="glass rounded-xl p-2.5 transition-all hover:glass-strong md:hidden"
								aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
								aria-expanded={mobileMenuOpen}
							>
								{mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
							</button>
						</div>
					</div>
				</div>

				{/* Mobile Menu */}
				<motion.div
					initial={false}
					animate={mobileMenuOpen ? "open" : "closed"}
					variants={{
						open: { opacity: 1, height: "auto" },
						closed: { opacity: 0, height: 0 },
					}}
					transition={{ duration: 0.3 }}
					className="overflow-hidden bg-black/90 backdrop-blur-xl md:hidden"
				>
					<div className="space-y-3 px-4 pb-8 pt-4">
						{MOBILE_LINKS.map((link, index) => (
							<motion.div
								key={link.href}
								initial={{ x: -20, opacity: 0 }}
								animate={
									mobileMenuOpen
										? { x: 0, opacity: 1 }
										: { x: -20, opacity: 0 }
								}
								transition={{ delay: index * 0.05 }}
							>
								<Link
									href={link.href}
									onClick={() => setMobileMenuOpen(false)}
									className="glass flex items-center gap-3 rounded-xl px-4 py-3 transition-all hover:glass-strong"
								>
									<link.icon size={20} className="text-purple-400" />
									<span className="font-medium">{link.label}</span>
								</Link>
							</motion.div>
						))}

						{user ? (
							<Link
								href="/dashboard"
								onClick={() => setMobileMenuOpen(false)}
								className="glass flex items-center gap-3 rounded-xl px-4 py-3 transition-all hover:glass-strong"
							>
								<LayoutDashboard size={20} className="text-purple-400" />
								<span className="font-medium">My dashboard</span>
							</Link>
						) : (
							<button
								type="button"
								onClick={() => {
									setMobileMenuOpen(false);
									setAuthModalOpen(true);
								}}
								className="glass flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-all hover:glass-strong"
							>
								<User size={20} className="text-purple-400" />
								<span className="font-medium">Log in / Join</span>
							</button>
						)}

						<motion.button
							type="button"
							initial={{ y: 20, opacity: 0 }}
							animate={
								mobileMenuOpen
									? { y: 0, opacity: 1 }
									: { y: 20, opacity: 0 }
							}
							transition={{ delay: MOBILE_LINKS.length * 0.05 }}
							onClick={startWriting}
							className="w-full rounded-full bg-gradient-to-r from-purple-500 to-blue-500 px-6 py-3 font-medium text-white shadow-lg"
						>
							Write a story
						</motion.button>
					</div>
				</motion.div>
			</header>

			{/* Shared Authentication Modal */}
			<AuthModal
				isOpen={authModalOpen}
				onClose={() => setAuthModalOpen(false)}
				onAuthSuccess={handleAuthSuccess}
			/>
		</>
	);
}

function NavLink({
	href,
	label,
	icon: Icon,
	active,
}: {
	href: string;
	label: string;
	icon: LucideIcon;
	active: boolean;
}) {
	return (
		<Link href={href} className="group relative">
			<motion.div
				whileHover={{ y: -2 }}
				className={cn(
					"flex items-center gap-2 text-sm font-medium transition-colors",
					active
						? "text-[var(--ink)]"
						: "text-[var(--ink-muted)] group-hover:text-[var(--ink)]",
				)}
			>
				<Icon
					size={16}
					className="opacity-70 transition-opacity group-hover:opacity-100"
				/>
				{label}
			</motion.div>

			{/* Animated underline — rests fully drawn on the active route */}
			<motion.span
				aria-hidden="true"
				className="absolute -bottom-1 left-0 h-0.5 rounded-full bg-gradient-to-r from-purple-500 to-blue-500"
				initial={false}
				animate={active ? { width: "100%" } : { width: 0 }}
				whileHover={{ width: "100%" }}
				transition={{ duration: 0.3 }}
			/>
		</Link>
	);
}
