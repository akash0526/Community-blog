"use client";

import { useRef } from "react";
import { IconArrowRight } from "./Icon";

// Brief §11 — the newsletter block. The submit handler resets the field; the
// real endpoint is preserved via `action`/`method` so the existing Buttondown
// embed keeps working exactly as before.
export default function NewsletterForm({
	action = "https://buttondown.email/",
	method = "get",
	fieldName = "email",
}) {
	const formRef = useRef(null);

	const handleSubmit = () => {
		// Let the browser perform the native submit, then clear the input so the
		// visitor sees the field reset on return.
		window.setTimeout(() => formRef.current?.reset(), 0);
	};

	return (
		<form
			ref={formRef}
			className="news__form"
			action={action}
			method={method}
			onSubmit={handleSubmit}
		>
			<label className="sr-only" htmlFor="newsletter-email">
				Email address
			</label>
			<input
				id="newsletter-email"
				type="email"
				name={fieldName}
				required
				placeholder="you@example.com"
			/>
			<button type="submit" className="btn news__btn">
				Join free
				<IconArrowRight />
			</button>
		</form>
	);
}
