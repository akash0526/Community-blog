"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import {
	LayoutDashboard,
	LogOut,
	Menu,
	Pen,
	User,
	X,
} from "lucide-react";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { ThemeToggle } from "./ThemeToggle";

// AuthModal (forms + Supabase) is only needed after a click — keep it out
// of the initial page-load bundle.
const AuthModal = dynamic(() => import("./AuthModal"), { ssr: false });

interface NavItem {
	label: string;
	href: string;
}

const NAV_LINKS: NavItem[] = [
	{ label: "Resources", href: "/resources" },
	{ label: "Guides", href: "/blog" },
	{ label: "Tools", href: "/ai-tools" },
	{ label: "Freelancing", href: "/freelancing-in-nepal" },
	{ label: "About", href: "/about" },
];

const MOBILE_LINKS: NavItem[] = [
	...NAV_LINKS,
	{ label: "Hosting", href: "/blogging-hosting" },
	{ label: "Payments", href: "/digital-payments" },
	{ label: "Business tools", href: "/small-business-tools" },
	{ label: "Write for us", href: "/write-for-us" },
];

function avatarFor(user: SupabaseUser | null) {
	const raw = user?.user_metadata?.avatar_url || "";
	if (raw && !raw.includes("dicebear") && !raw.includes("bottts")) return raw;
	const name = encodeURIComponent(
		user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Apex",
	);
	return `https://ui-avatars.com/api/?name=${name}&background=5440d6&color=fff&size=64`;
}

function isActive(pathname: string, href: string) {
	return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Site header.
 *
 * Deliberately quiet: flat paper background, one accent for the current
 * section, no blur and no animated logo. Behaviour from the previous
 * header is preserved: deferred Supabase session restore, demo sessions,
 * avatar menu, shared AuthModal and the "Write a story" gate.
 */
export default function Navbar() {
	const pathname = usePathname();
	const router = useRouter();
	const [user, setUser] = useState<SupabaseUser | null>(null);
	const [authModalOpen, setAuthModalOpen] = useState(false);
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const accountRef = useRef<HTMLDivElement | null>(null);

	// Restore the session after the page is interactive: the Supabase
	// client is not needed to paint the header, so it stays off the
	// critical path (FCP/LCP).
	useEffect(() => {
		let cancelled = false;
		let subscription: { unsubscribe: () => void } | null = null;
		let idleHandle: number | null = null;

		const initAuth = async () => {
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

	// Mobile sheet: lock the page behind it and let Escape dismiss it.
	useEffect(() => {
		if (!mobileMenuOpen) return;
		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") setMobileMenuOpen(false);
		};
		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		document.addEventListener("keydown", onKeyDown);
		return () => {
			document.body.style.overflow = previousOverflow;
			document.removeEventListener("keydown", onKeyDown);
		};
	}, [mobileMenuOpen]);

	// Avatar menu: dismiss on outside click or Escape.
	useEffect(() => {
		if (!dropdownOpen) return;
		const onPointerDown = (event: PointerEvent) => {
			if (!accountRef.current?.contains(event.target as Node)) {
				setDropdownOpen(false);
			}
		};
		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") setDropdownOpen(false);
		};
		document.addEventListener("pointerdown", onPointerDown);
		document.addEventListener("keydown", onKeyDown);
		return () => {
			document.removeEventListener("pointerdown", onPointerDown);
			document.removeEventListener("keydown", onKeyDown);
		};
	}, [dropdownOpen]);

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
		user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Writer";

	return (
		<>
			<header id="header" className="header">
				<div className="wrap">
					<div className="header__in">
						<Link href="/" className="brand" aria-label="Apex Nepal — home">
							Apex<span className="dot" aria-hidden="true" />
							Nepal
						</Link>

						<nav className="nav" aria-label="Primary">
							{NAV_LINKS.map((link) => (
								<Link
									key={link.href}
									href={link.href}
									className={isActive(pathname, link.href) ? "is-active" : undefined}
									aria-current={isActive(pathname, link.href) ? "page" : undefined}
								>
									{link.label}
								</Link>
							))}
						</nav>

						<div className="header__actions">
							<ThemeToggle />

							{user ? (
								<div className="relative hidden md:block" ref={accountRef}>
									<button
										type="button"
										onClick={() => setDropdownOpen((v) => !v)}
										aria-expanded={dropdownOpen}
										aria-haspopup="menu"
										aria-label={`${displayName} — account menu`}
										className="flex h-[38px] items-center gap-2 rounded-[10px] border border-[var(--hairline)] px-1.5 transition-colors hover:border-[var(--hairline-strong)]"
									>
										<Image
											src={avatarFor(user)}
											alt=""
											width={26}
											height={26}
											className="h-[26px] w-[26px] rounded-full object-cover"
										/>
									</button>

									{dropdownOpen && (
										<div
											role="menu"
											className="absolute right-0 top-[calc(100%+0.5rem)] z-50 w-60 overflow-hidden rounded-[var(--radius)] border border-[var(--hairline)] bg-[var(--surface)] py-1.5 shadow-[var(--shadow)]"
										>
											<div className="border-b border-[var(--hairline)] px-3 pb-2 pt-1">
												<div className="truncate text-[0.8125rem] font-medium">
													{displayName}
												</div>
												<div className="truncate text-[0.75rem] text-[var(--ink-faint)]">
													{user.email || "Author session"}
												</div>
											</div>
											<Link
												href="/dashboard"
												role="menuitem"
												onClick={() => setDropdownOpen(false)}
												className="mt-1 flex items-center gap-2 px-3 py-2 text-[0.875rem] text-[var(--ink-muted)] transition-colors hover:bg-[var(--sunken)] hover:text-[var(--ink)]"
											>
												<LayoutDashboard size={15} aria-hidden="true" />
												Dashboard &amp; profile
											</Link>
											<button
												type="button"
												role="menuitem"
												onClick={handleLogout}
												className="flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-[0.875rem] text-[var(--ink-muted)] transition-colors hover:bg-[var(--sunken)] hover:text-[var(--ink)]"
											>
												<LogOut size={15} aria-hidden="true" />
												Sign out
											</button>
										</div>
									)}
								</div>
							) : (
								<button
									type="button"
									onClick={() => setAuthModalOpen(true)}
									className="icon-btn hidden md:grid"
									aria-label="Log in or join"
									title="Log in / Join"
								>
									<User aria-hidden="true" />
								</button>
							)}

							<button
								type="button"
								onClick={startWriting}
								className="btn btn--primary btn--sm hidden sm:inline-flex"
							>
								<Pen size={15} aria-hidden="true" />
								<span className="hidden lg:inline">Write a story</span>
								<span className="lg:hidden">Write</span>
							</button>

							<button
								type="button"
								onClick={() => setMobileMenuOpen((v) => !v)}
								className="icon-btn nav-toggle"
								aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
								aria-expanded={mobileMenuOpen}
								aria-controls="mobile-nav"
							>
								{mobileMenuOpen ? (
									<X aria-hidden="true" />
								) : (
									<Menu aria-hidden="true" />
								)}
							</button>
						</div>
					</div>
				</div>

				{mobileMenuOpen && (
					<div className="nav-sheet" id="mobile-nav">
						<div className="wrap">
							<nav className="nav-mobile" aria-label="Mobile">
								{MOBILE_LINKS.map((link) => (
									<Link
										key={link.href}
										href={link.href}
										aria-current={
											isActive(pathname, link.href) ? "page" : undefined
										}
										onClick={() => setMobileMenuOpen(false)}
									>
										{link.label}
										<span aria-hidden="true" className="text-[var(--ink-faint)]">
											&rarr;
										</span>
									</Link>
								))}
							</nav>

							<div className="nav-mobile__foot">
								{user ? (
									<Link
										href="/dashboard"
										className="btn btn--ghost"
										onClick={() => setMobileMenuOpen(false)}
									>
										<LayoutDashboard size={16} aria-hidden="true" />
										My dashboard
									</Link>
								) : (
									<button
										type="button"
										className="btn btn--ghost"
										onClick={() => {
											setMobileMenuOpen(false);
											setAuthModalOpen(true);
										}}
									>
										<User size={16} aria-hidden="true" />
										Log in / Join
									</button>
								)}
								<button
									type="button"
									onClick={startWriting}
									className="btn btn--primary"
								>
									<Pen size={16} aria-hidden="true" />
									Write a story
								</button>
							</div>
						</div>
					</div>
				)}
			</header>

			<AuthModal
				isOpen={authModalOpen}
				onClose={() => setAuthModalOpen(false)}
				onAuthSuccess={handleAuthSuccess}
			/>
		</>
	);
}
