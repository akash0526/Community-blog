"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import AuthModal from "./AuthModal";
import {
	IconArrowRight,
	IconClose,
	IconDashboard,
	IconLogout,
	IconMenu,
	IconMoon,
	IconPen,
	IconSun,
	IconUser,
} from "./Icon";
import { supabase } from "@/lib/supabase";

const THEME_KEY = "theme";

// Kept in sync with the inline bootstrap in app/layout.tsx: both resolve
// localStorage.theme and fall back to the OS preference, so there is no flash
// and no mismatch between the pre-paint attribute and React state.
function readTheme() {
	let saved = null;
	try {
		saved = localStorage.getItem(THEME_KEY);
	} catch {}
	if (saved !== "dark" && saved !== "light") {
		saved =
			window.matchMedia &&
			window.matchMedia("(prefers-color-scheme: dark)").matches
				? "dark"
				: "light";
	}
	return saved;
}

function applyTheme(theme) {
	document.documentElement.setAttribute("data-theme", theme);
	try {
		localStorage.setItem(THEME_KEY, theme);
	} catch {}
}

const NAV_LINKS = [
	{ label: "Resources", href: "/resources" },
	{ label: "Guides", href: "/blog" },
	{ label: "Tools", href: "/ai-tools" },
	{ label: "Freelancing", href: "/freelancing-in-nepal" },
	{ label: "About", href: "/about" },
];

const MOBILE_LINKS = [
	...NAV_LINKS,
	{ label: "Hosting", href: "/blogging-hosting" },
	{ label: "Payments", href: "/digital-payments" },
	{ label: "Business tools", href: "/small-business-tools" },
	{ label: "Write for us", href: "/write-for-us" },
];

function avatarFor(user) {
	const raw = user?.user_metadata?.avatar_url || "";
	if (raw && !raw.includes("dicebear") && !raw.includes("bottts")) return raw;
	const name = encodeURIComponent(
		user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Apex",
	);
	return `https://ui-avatars.com/api/?name=${name}&background=A8471F&color=fff&size=64`;
}

export default function Navbar() {
	const pathname = usePathname();
	const router = useRouter();
	const [user, setUser] = useState(null);
	const [authModalOpen, setAuthModalOpen] = useState(false);
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [dropdownOpen, setDropdownOpen] = useState(false);

	useEffect(() => {
		// Adopt whatever the bootstrap script already painted (it runs in <head>
		// before hydration). The toggle itself never needs React state — the
		// moon/sun icons are swapped by [data-theme] in CSS.
		applyTheme(readTheme());

		// Check active user session
		const getSession = async () => {
			const {
				data: { session },
			} = await supabase.auth.getSession();
			if (session?.user) {
				setUser(session.user);
			} else {
				const demo = localStorage.getItem("apex_demo_user");
				if (demo) {
					try {
						setUser(JSON.parse(demo));
					} catch {}
				}
			}
		};
		getSession();

		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_event, session) => {
			if (session?.user) setUser(session.user);
		});

		return () => subscription.unsubscribe();
	}, []);

	const toggleTheme = () => {
		const next =
			document.documentElement.getAttribute("data-theme") === "dark"
				? "light"
				: "dark";
		applyTheme(next);
	};

	const handleLogout = async () => {
		await supabase.auth.signOut();
		localStorage.removeItem("apex_demo_user");
		setUser(null);
		setDropdownOpen(false);
	};

	const handleAuthSuccess = useCallback((activeUser) => {
		setUser(activeUser);
		if (activeUser.id.startsWith("demo-")) {
			localStorage.setItem("apex_demo_user", JSON.stringify(activeUser));
		}
	}, []);

	const startWriting = () => {
		if (user) router.push("/studio");
		else setAuthModalOpen(true);
	};

	return (
		<>
			<header className="header" id="header">
				<div className="wrap header__in">
					<Link
						href="/"
						className="brand"
						aria-label="Apex Nepal home"
						onClick={() => setMobileMenuOpen(false)}
					>
						Apex<span className="dot" />
						Nepal
					</Link>

					<nav className="nav" aria-label="Main">
						{NAV_LINKS.map((item) => (
							<Link
								key={item.href}
								href={item.href}
								className={
									pathname === item.href ||
									pathname.startsWith(`${item.href}/`)
										? "is-active"
										: undefined
								}
							>
								{item.label}
							</Link>
						))}
					</nav>

					<div className="header__actions">
						{/* §16 — the icon path swaps between moon and sun. */}
						<button
							type="button"
							className="icon-btn"
							id="themeBtn"
							onClick={toggleTheme}
							aria-label="Toggle dark mode"
						>
							<IconSun className="icon theme-icon theme-icon--sun" />
							<IconMoon className="icon theme-icon theme-icon--moon" />
						</button>

						{user ? (
							<div className="relative">
								<button
									type="button"
									onClick={() => setDropdownOpen((v) => !v)}
									aria-expanded={dropdownOpen}
									aria-haspopup="true"
									// On mobile the name span is hidden and the avatar has
									// alt="", so the button needs its own accessible name.
									aria-label={`${user.user_metadata?.full_name || user.email?.split("@")[0] || "Writer"} account menu`}
									className="icon-btn !h-9 !w-auto gap-2 !border-[var(--hairline)] !px-2"
								>
									<Image
										src={avatarFor(user)}
										alt=""
										width={24}
										height={24}
										className="h-6 w-6 rounded-full object-cover"
									/>
									<span className="hidden max-w-[9rem] truncate text-[0.8125rem] font-medium sm:inline">
										{user.user_metadata?.full_name ||
											user.email?.split("@")[0] ||
											"Writer"}
									</span>
								</button>

								{dropdownOpen && (
									<div className="glass absolute right-0 top-[calc(100%+0.75rem)] w-60 animate-fadeIn rounded-[var(--radius)] p-2 text-left shadow-[var(--shadow)]">
										<div className="border-b border-[var(--hairline)] px-3 pb-2 pt-1">
											<div className="eyebrow !mb-1 !text-[0.625rem]">
												Active author
											</div>
											<div className="truncate text-[0.8125rem] text-[var(--ink-muted)]">
												{user.email || "Author session"}
											</div>
										</div>
										<Link
											href="/dashboard"
											onClick={() => setDropdownOpen(false)}
											className="flex items-center gap-2 rounded-[var(--radius)] px-3 py-2 text-[0.875rem] text-[var(--ink-muted)] transition-colors hover:text-[var(--clay)]"
										>
											<IconDashboard />
											Dashboard & profile
										</Link>
										<button
											type="button"
											onClick={handleLogout}
											className="flex w-full cursor-pointer items-center gap-2 rounded-[var(--radius)] px-3 py-2 text-left text-[0.875rem] text-[var(--ink-muted)] transition-colors hover:text-[var(--clay)]"
										>
											<IconLogout />
											Sign out
										</button>
									</div>
								)}
							</div>
					) : (
						<button
							type="button"
							onClick={() => setAuthModalOpen(true)}
							className="btn btn--ghost !px-3 !py-2 !text-[0.875rem]"
							// Label stays in the a11y tree even when the visible
							// text is hidden below the sm breakpoint (axe button-name).
							aria-label="Log in / Join"
						>
							<IconUser />
							<span className="hidden sm:inline" aria-hidden="true">
								Log in / Join
							</span>
						</button>
					)}

					<button
						type="button"
						onClick={startWriting}
						className="btn btn--primary !px-4 !py-2 !text-[0.875rem]"
						// Same responsive-hide pattern as the Log in button:
						// keep a persistent accessible name for agents/screen readers.
						aria-label="Write a story"
					>
						<IconPen />
						<span className="hidden sm:inline" aria-hidden="true">
							Write a story
						</span>
						<IconArrowRight className="icon icon--15" />
					</button>

						<button
							type="button"
							onClick={() => setMobileMenuOpen((v) => !v)}
							className="icon-btn nav-toggle"
							aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
							aria-expanded={mobileMenuOpen}
						>
							{mobileMenuOpen ? <IconClose /> : <IconMenu />}
						</button>
					</div>
				</div>

				{/* The brief hides the desktop nav at 820px — the drawer keeps
				    every route reachable below that. */}
				{mobileMenuOpen && (
					<div className="nav-mobile">
						<div className="wrap">
							{MOBILE_LINKS.map((item) => (
								<Link
									key={item.href}
									href={item.href}
									onClick={() => setMobileMenuOpen(false)}
								>
									{item.label}
								</Link>
							))}
							{user && (
								<Link
									href="/dashboard"
									onClick={() => setMobileMenuOpen(false)}
								>
									My dashboard
								</Link>
							)}
						</div>
					</div>
				)}
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
