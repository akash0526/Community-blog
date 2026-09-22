"use client";

import { useState } from "react";
import { IconArrowRight } from "./Icon";

// No live list provider is wired yet. Do not POST to a generic Buttondown
// homepage — that looked like a working signup and dropped the address.
export default function NewsletterForm() {
	const [status, setStatus] = useState("idle");

	const handleSubmit = (event) => {
		event.preventDefault();
		const email = String(new FormData(event.currentTarget).get("email") || "").trim();
		if (!email) return;
		try {
			const key = "apex_newsletter_waitlist";
			const existing = JSON.parse(localStorage.getItem(key) || "[]");
			if (!existing.includes(email)) {
				existing.push(email);
				localStorage.setItem(key, JSON.stringify(existing));
			}
		} catch {
			// localStorage can be blocked; the thank-you state still stands.
		}
		event.currentTarget.reset();
		setStatus("done");
	};

	if (status === "done") {
		return (
			<p className="news__note" role="status">
				Thanks. The Thursday note isn’t live yet — email{" "}
				<a href="mailto:editor@apex-nepal.com?subject=Thursday%20note">
					editor@apex-nepal.com
				</a>{" "}
				and we’ll add you to the first issue.
			</p>
		);
	}

	return (
		<form className="news__form" onSubmit={handleSubmit}>
			<label className="sr-only" htmlFor="newsletter-email">
				Email address
			</label>
			<input
				id="newsletter-email"
				type="email"
				name="email"
				required
				autoComplete="email"
				placeholder="you@example.com"
			/>
			<button type="submit" className="btn news__btn">
				Join free
				<IconArrowRight />
			</button>
			<p className="news__note" style={{ flexBasis: "100%" }}>
				No spam. We’ll only email if the Thursday note actually ships.
			</p>
		</form>
	);
}
