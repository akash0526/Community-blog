"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { X, Mail, Lock, User, Sparkles, AlertCircle } from "lucide-react";

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
	const [isSignUp, setIsSignUp] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [fullName, setFullName] = useState("");
	const [profession, setProfession] = useState("");
	const [bio, setBio] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [message, setMessage] = useState(null);

	if (!isOpen) return null;

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError(null);
		setMessage(null);

		try {
			if (isSignUp) {
				const { data, error: signUpErr } = await supabase.auth.signUp({
					email,
					password,
					options: {
						data: {
							full_name: fullName || email.split("@")[0],
							professional_role: profession || "Community Creator",
							bio:
								bio || "Writing and sharing stories with the open community.",
							avatar_url: `https://api.dicebear.com/7.x/bottts/svg?seed=${fullName || email}`,
						},
					},
				});

				if (signUpErr) throw signUpErr;

				if (data.session) {
					onAuthSuccess(data.session.user);
					onClose();
				} else {
					setMessage(
						"⚡ Confirmation email sent! Check your inbox or use Demo Login below.",
					);
				}
			} else {
				const { data, error: signInErr } =
					await supabase.auth.signInWithPassword({
						email,
						password,
					});

				if (signInErr) throw signInErr;

				if (data.session) {
					onAuthSuccess(data.session.user);
					onClose();
				}
			}
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	const handleDemoLogin = async () => {
		setLoading(true);
		setError(null);

		// Provide instant developer satisfaction by signing in as a demo community author
		const demoUser = {
			id: "demo-author-" + Date.now(),
			email: "demo.developer@example.com",
			user_metadata: {
				full_name: "Akash (Demo Architect)",
				professional_role: "Community Platform Creator",
				bio: "Exploring open publishing, technology, and community storytelling.",
				avatar_url: "https://avatars.githubusercontent.com/akash0526",
			},
		};

		// Simulate slight loading to feel premium
		setTimeout(() => {
			onAuthSuccess(demoUser);
			setLoading(false);
			onClose();
		}, 400);
	};

	return (
		<div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
			<div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-8 shadow-2xl relative overflow-y-auto max-h-[92vh]">
				{/* Glow helper */}
				<div className="absolute -right-20 -top-20 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

				{/* Close Button */}
				<button
					onClick={onClose}
					className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 dark:text-slate-500 transition"
				>
					<X className="w-5 h-5" />
				</button>

				{/* Header */}
				<div className="text-left mb-6">
					<div className="flex items-center gap-2 mb-2">
						<span className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center text-sm font-black shadow-md shadow-indigo-500/25">
							⚡
						</span>
						<span className="text-xl font-black text-slate-900 dark:text-white">
							Apex
							<span className="text-indigo-600 dark:text-indigo-400 font-black">
								Community
							</span>
						</span>
					</div>
					<h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
						{isSignUp ? "Join the Open Ledger" : "Welcome Back, Architect"}
					</h3>
					<p className="text-slate-500 dark:text-slate-400 text-xs font-semibold mt-1">
						{isSignUp
							? "Create your profile to write and rank extreme SEO dispatches."
							: "Log in to write dispatches and manage your keyword authority pipelines."}
					</p>
				</div>

				{error && (
					<div className="mb-6 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-start gap-2.5">
						<AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
						<span>{error}</span>
					</div>
				)}

				{message && (
					<div className="mb-6 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-start gap-2.5">
						<Sparkles className="w-4 h-4 flex-shrink-0 mt-0.5" />
						<span>{message}</span>
					</div>
				)}

				{/* Form */}
				<form onSubmit={handleSubmit} className="space-y-4">
					{isSignUp && (
						<>
							<div>
								<label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
									Full Name
								</label>
								<div className="relative">
									<span className="absolute left-3.5 top-3.5 text-slate-400">
										<User className="w-4 h-4" />
									</span>
									<input
										type="text"
										required
										placeholder="Alex Rivera"
										value={fullName}
										onChange={(e) => setFullName(e.target.value)}
										className="input pl-10 text-sm font-bold py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 dark:border-slate-700"
									/>
								</div>
							</div>

							<div>
								<label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
									Profession / Role
								</label>
								<input
									type="text"
									placeholder="Journalist, Student, Teacher, Developer..."
									value={profession}
									onChange={(e) => setProfession(e.target.value)}
									className="input text-sm font-bold py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 dark:border-slate-700"
								/>
							</div>

							<div>
								<label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
									Short Bio
								</label>
								<textarea
									rows="3"
									placeholder="Tell readers a little about yourself..."
									value={bio}
									onChange={(e) => setBio(e.target.value)}
									className="input text-sm font-medium py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 dark:border-slate-700 leading-relaxed resize-none"
								/>
							</div>
						</>
					)}

					<div>
						<label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
							Professional Email
						</label>
						<div className="relative">
							<span className="absolute left-3.5 top-3.5 text-slate-400">
								<Mail className="w-4 h-4" />
							</span>
							<input
								type="email"
								required
								placeholder="alex.rivera@example.com"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className="input pl-10 text-sm font-bold py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 dark:border-slate-700"
							/>
						</div>
					</div>

					<div>
						<label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
							Secure Password
						</label>
						<div className="relative">
							<span className="absolute left-3.5 top-3.5 text-slate-400">
								<Lock className="w-4 h-4" />
							</span>
							<input
								type="password"
								required
								placeholder="••••••••••••"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className="input pl-10 text-sm font-bold py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 dark:border-slate-700"
							/>
						</div>
					</div>

					<button
						type="submit"
						disabled={loading}
						className="btn btn-primary w-full py-3.5 rounded-2xl font-black text-sm tracking-wide shadow-lg shadow-indigo-600/30"
					>
						{loading
							? "Authenticating Cloud..."
							: isSignUp
								? "Sign Up to Open Ledger"
								: "Log In Live"}
					</button>
				</form>

				{/* Universal Divider */}
				<div className="my-6 flex items-center gap-3">
					<div className="flex-1 h-px bg-slate-100 dark:bg-slate-800"></div>
					<span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400">
						Or For Instant Testing
					</span>
					<div className="flex-1 h-px bg-slate-100 dark:bg-slate-800"></div>
				</div>

				{/* Instant Sandboxed Demo Auth Triggers */}
				<button
					type="button"
					onClick={handleDemoLogin}
					disabled={loading}
					className="btn btn-secondary w-full py-3 rounded-2xl font-black text-xs text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900/60 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 flex items-center justify-center gap-2 shadow-sm"
				>
					<Sparkles className="w-4 h-4 animate-pulse" />
					<span>🚀 Instant One-Click Demo Login</span>
				</button>

				{/* Switch mode */}
				<div className="mt-6 text-center text-xs font-bold text-slate-500">
					{isSignUp ? (
						<span>
							Already have an author ledger?{" "}
							<button
								onClick={() => setIsSignUp(false)}
								className="text-indigo-600 dark:text-indigo-400 font-black underline ml-1"
							>
								Log In
							</button>
						</span>
					) : (
						<span>
							New to open developer dispatches?{" "}
							<button
								onClick={() => setIsSignUp(true)}
								className="text-indigo-600 dark:text-indigo-400 font-black underline ml-1"
							>
								Sign Up
							</button>
						</span>
					)}
				</div>
			</div>
		</div>
	);
}
