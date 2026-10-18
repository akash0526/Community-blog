"use client";

/**
 * ArticleBody — the ONE renderer for a published story's Markdown.
 *
 * Both the public article page (`app/blog/[slug]`) and the Studio's
 * "Preview" tab render through this component, so what an author sees
 * while writing is pixel-for-pixel what readers get after posting
 * (WYSIWYG by construction, not by keeping two style copies in sync).
 *
 * All typography lives in the `.article-prose` system in
 * `app/globals.css` (18–19px body, 1.8 line-height, ~68ch measure,
 * drop cap, pull quotes, breakout figures…). This file only adds the
 * structure CSS cannot: heading anchor ids that match the table of
 * contents (`lib/markdownHeadings.js`), figure/caption wrappers,
 * scrollable tables, and code blocks with a language label + copy button.
 */

import { Children, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Check, Copy, Link2 } from "lucide-react";
import { extractHeadings, slugifyHeading } from "@/lib/markdownHeadings";
import { imageKitDeliveryUrl } from "@/lib/imagekitUrl";

/** Flatten React children to plain text (for heading anchors / code copy). */
function childrenToText(children) {
	return Children.toArray(children)
		.map((child) => {
			if (typeof child === "string" || typeof child === "number") return String(child);
			if (child?.props?.children) return childrenToText(child.props.children);
			return "";
		})
		.join("");
}

function CopyCodeButton({ text }) {
	const [copied, setCopied] = useState(false);
	return (
		<button
			type="button"
			className="article-code__copy"
			aria-label={copied ? "Copied" : "Copy code"}
			onClick={async () => {
				try {
					await navigator.clipboard.writeText(text);
					setCopied(true);
					setTimeout(() => setCopied(false), 1800);
				} catch {}
			}}
		>
			{copied ? <Check size={13} /> : <Copy size={13} />}
			{copied ? "Copied" : "Copy"}
		</button>
	);
}

function CodeBlock({ children }) {
	const codeEl = Children.toArray(children)[0];
	const className = codeEl?.props?.className || "";
	const language = /language-([\w-]+)/.exec(className)?.[1] || "code";
	const text = childrenToText(children).replace(/\n$/, "");
	return (
		<div className="article-code">
			<div className="article-code__bar">
				<span className="article-code__dots" aria-hidden="true">
					<i /><i /><i />
				</span>
				<span className="article-code__lang">{language}</span>
				<CopyCodeButton text={text} />
			</div>
			<pre>{children}</pre>
		</div>
	);
}

export default function ArticleBody({ content = "", className = "" }) {
	const headings = useMemo(() => extractHeadings(content), [content]);

	// Heading components consume this queue in document order so their ids
	// match `extractHeadings` exactly (the TOC links to these ids). A fresh
	// queue is created on every render of this component, and ReactMarkdown
	// renders its children synchronously in order right after.
	const queue = [...headings];
	const nextHeadingId = (level, children) => {
		const next = queue[0];
		if (next && next.level === level) {
			queue.shift();
			return next.id;
		}
		return slugifyHeading(childrenToText(children));
	};

	const components = {
		// Authors often repeat the title as `# …` — the page already has an
		// <h1>, so a body H1 is demoted to a section heading visually and
		// semantically (one H1 per page).
		h1: ({ children }) => <h2 className="article-h2">{children}</h2>,
		h2: ({ children }) => {
			const id = nextHeadingId(2, children);
			return (
				<h2 id={id} className="article-h2">
					{children}
					<a href={`#${id}`} className="article-anchor" aria-label="Link to this section">
						<Link2 size={16} />
					</a>
				</h2>
			);
		},
		h3: ({ children }) => {
			const id = nextHeadingId(3, children);
			return (
				<h3 id={id} className="article-h3">
					{children}
					<a href={`#${id}`} className="article-anchor" aria-label="Link to this section">
						<Link2 size={14} />
					</a>
				</h3>
			);
		},
		a: ({ href, children }) => {
			const isInternal =
				!href || href.startsWith("/") || href.startsWith("#") || href.includes("apex-nepal.com");
			return isInternal ? (
				<a href={href}>{children}</a>
			) : (
				<a href={href} target="_blank" rel="noopener noreferrer">
					{children}
				</a>
			);
		},
		img: ({ src, alt, title: caption }) => (
			<figure className="article-figure">
				{/* eslint-disable-next-line @next/next/no-img-element -- Markdown images may come from arbitrary author-provided URLs. */}
				<img
					src={imageKitDeliveryUrl(src || "")}
					alt={alt || caption || ""}
					loading="lazy"
					decoding="async"
				/>
				{(caption || alt) && <figcaption>{caption || alt}</figcaption>}
			</figure>
		),
		pre: ({ children }) => <CodeBlock>{children}</CodeBlock>,
		code: ({ className, children, ...props }) => {
			// Block code (inside <pre>) carries a language-* class and is
			// styled by the .article-code rules; everything else is inline.
			if (className?.includes("language-")) {
				return (
					<code className={className} {...props}>
						{children}
					</code>
				);
			}
			return <code {...props}>{children}</code>;
		},
		table: ({ children }) => (
			<div className="article-table" role="region" aria-label="Table" tabIndex={0}>
				<table>{children}</table>
			</div>
		),
	};

	return (
		<div className={`article-prose ${className}`.trim()}>
			<ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
				{content || ""}
			</ReactMarkdown>
		</div>
	);
}
