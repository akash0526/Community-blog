"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AuthModal from "./AuthModal";
import {
	Sun,
	Moon,
	Edit3,
	User,
	LogOut,
	Menu,
	X,
	LayoutDashboard,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function Navbar() {
	const pathname = usePathname();
	const [theme, setTheme] = useState("light");
	const [user, setUser] = useState(null);
	const [authModalOpen, setAuthModalOpen] = useState(false);
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [dropdownOpen, setDropdownOpen] = useState(false);

	useEffect(() => {
		// Sync theme
		const saved = localStorage.getItem("apex_theme") || "light";
		setTheme(saved);
		if (saved === "dark") {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}

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
					} catch (e) {}
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
		const next = theme === "dark" ? "light" : "dark";
		setTheme(next);
		localStorage.setItem("apex_theme", next);
		if (next === "dark") {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}
	};

	const handleLogout = async () => {
		await supabase.auth.signOut();
		localStorage.removeItem("apex_demo_user");
		setUser(null);
		setDropdownOpen(false);
	};

	const handleAuthSuccess = (activeUser) => {
		setUser(activeUser);
		if (activeUser.id.startsWith("demo-")) {
			localStorage.setItem("apex_demo_user", JSON.stringify(activeUser));
		}
	};

	return (
		<>
			<header className="sticky top-0 z-40 h-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition">
				<div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
					{/* Brand */}
					<Link
						href="/"
						className="flex items-center gap-3 font-black text-2xl text-slate-900 dark:text-white group"
					>
						<span className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center text-base font-black shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition transform">
							⚡
						</span>
						<span>
							Apex
							<span className="text-indigo-600 dark:text-indigo-400 font-black">
								Community
							</span>
						</span>
					</Link>

					{/* Desktop Nav */}
					<nav className="hidden md:flex items-center gap-8 font-extrabold text-sm text-slate-600 dark:text-slate-300">
						<Link
							href="/"
							className={`hover:text-indigo-600 dark:hover:text-indigo-400 transition ${pathname === "/" ? "text-indigo-600 dark:text-indigo-400 font-black" : ""}`}
						>
							Explore Feed
						</Link>
					</nav>

					{/* Actions */}
					<div className="flex items-center gap-3">
						{/* Write Dispatch CTA */}
						<button
							onClick={() => {
								if (user) window.location.href = "/studio";
								else setAuthModalOpen(true);
							}}
							className="btn btn-primary px-4 py-2.5 rounded-xl font-black text-xs shadow-md shadow-indigo-600/25 flex items-center gap-1.5 transform hover:-translate-y-0.5 transition"
						>
							<Edit3 className="w-4 h-4" />
							<span className="hidden sm:inline">Write Dispatch</span>
						</button>

						{/* User Zone / Login Triggers */}
						{user ? (
							<div className="relative">
								<button
									onClick={() => setDropdownOpen(!dropdownOpen)}
									className="flex items-center gap-2 pl-2 pr-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-indigo-500 transition cursor-pointer"
								>
									<img
										src={
											user?.user_metadata?.avatar_url ||
											"https://api.dicebear.com/7.x/bottts/svg?seed=Arch"
										}
										alt="Avatar"
										className="w-7 h-7 rounded-full object-cover border border-white dark:border-slate-700 flex-shrink-0"
									/>
									<span className="text-xs font-black text-slate-900 dark:text-white truncate max-w-[100px] sm:max-w-[140px]">
										{user?.user_metadata?.full_name || "Architect"}
									</span>
								</button>

								{dropdownOpen && (
									<div className="absolute right-0 mt-3 w-56 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl py-3 text-left animate-fadeIn">
										<div className="px-5 py-2 border-b border-slate-100 dark:border-slate-800 mb-1">
											<div className="text-[10px] font-black uppercase text-indigo-600 dark:text-indigo-400 tracking-wider">
												Active Author
											</div>
											<div className="text-xs font-bold text-slate-500 truncate">
												{user.email || "Author Session"}
											</div>
										</div>

										<Link
											href="/dashboard"
											onClick={() => setDropdownOpen(false)}
											className="flex items-center gap-2.5 px-5 py-2.5 text-xs font-extrabold text-slate-700 dark:text-slate-300 hover:text-indigo-600 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition"
										>
											<LayoutDashboard className="w-4 h-4 text-indigo-500" />
											<span>My Published Articles</span>
										</Link>

										<button
											onClick={handleLogout}
											className="w-full flex items-center gap-2.5 px-5 py-2.5 text-xs font-extrabold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition text-left cursor-pointer"
										>
											<LogOut className="w-4 h-4" />
											<span>Sign Out Live</span>
										</button>
									</div>
								)}
							</div>
						) : (
							<button
								onClick={() => setAuthModalOpen(true)}
								className="btn btn-secondary px-4 py-2.5 rounded-xl font-extrabold text-xs flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
							>
								<User className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
								<span>Log In / Join</span>
							</button>
						)}

						{/* Theme Toggle */}
						<button
							onClick={toggleTheme}
							className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm transition"
							title="Toggle Theme"
						>
							{theme === "dark" ? (
								<Sun className="w-4 h-4 text-amber-400" />
							) : (
								<Moon className="w-4 h-4 text-slate-700" />
							)}
						</button>

						{/* Hamburger */}
						<button
							onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
							className="md:hidden p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300"
						>
							{mobileMenuOpen ? (
								<X className="w-4 h-4" />
							) : (
								<Menu className="w-4 h-4" />
							)}
						</button>
					</div>
				</div>

				{/* Mobile menu */}
				{mobileMenuOpen && (
					<div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-6 shadow-2xl space-y-4 font-extrabold text-sm text-left animate-fadeIn">
						<Link
							href="/"
							onClick={() => setMobileMenuOpen(false)}
							className="block py-2 text-slate-800 dark:text-slate-200 hover:text-indigo-600"
						>
							Explore Feed
						</Link>
						{user && (
							<Link
								href="/dashboard"
								onClick={() => setMobileMenuOpen(false)}
								className="block py-2 text-indigo-600 dark:text-indigo-400"
							>
								📊 My Author Dashboard
							</Link>
						)}
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
