"use client";

// Footer "Cookie settings" control — lets visitors revisit / withdraw the
// choice made in the cookie banner (required for the Privacy Policy claim
// that consent can be withdrawn at any time).
export default function CookieSettingsButton({ className = "" }) {
	const reset = () => {
		try {
			localStorage.removeItem("apex_cookie_consent");
		} catch {}
		// Reload so the banner reappears with the current choice cleared.
		window.location.reload();
	};

	return (
		<button
			type="button"
			onClick={reset}
			className={`link-underline hover:text-slate-300 transition cursor-pointer ${className}`}
		>
			Cookie settings
		</button>
	);
}
