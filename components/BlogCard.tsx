import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export interface BlogCardProps {
	title: string;
	excerpt: string;
	image: string;
	author: {
		name: string;
		avatar: string;
	};
	date: string;
	/** Omitted when the article body (and therefore word count) is unknown. */
	readTime?: string;
	slug: string;
	category: string;
	/** Set on the first card only when it is above the fold. */
	priority?: boolean;
}

/**
 * Story card — one flat surface, one image, one link.
 *
 * Rendered on the server (no client JS) and used by both the homepage and
 * the archive grid. Hover is a 2px lift plus a hairline colour change, so
 * it feels responsive without moving text under the cursor.
 */
export function BlogCard({
	title,
	excerpt,
	image,
	author,
	date,
	readTime,
	slug,
	category,
	priority = false,
}: BlogCardProps) {
	return (
		<article className="card">
			<Link
				href={`/blog/${slug}`}
				className="flex flex-1 flex-col focus-visible:outline-offset-4"
				aria-label={title}
			>
				<div className="card__media">
					<Image
						src={image}
						alt=""
						fill
						sizes="(max-width: 860px) 92vw, (max-width: 1160px) 45vw, 360px"
						quality={70}
						priority={priority}
						loading={priority ? undefined : "lazy"}
						className="object-cover"
					/>
				</div>

				<div className="card__body">
					<span className="card__tag">{category}</span>

					<h3 className="line-clamp-2">{title}</h3>

					{excerpt ? (
						<p className="line-clamp-2">{excerpt}</p>
					) : null}

					<div className="card__foot">
						<span className="flex min-w-0 items-center gap-1.5">
							<Image
								src={author.avatar}
								alt=""
								width={20}
								height={20}
								className="h-5 w-5 rounded-full object-cover"
							/>
							<span className="truncate text-[var(--ink-muted)]">
								{author.name}
							</span>
						</span>

						<span className="flex shrink-0 items-center gap-2">
							{readTime ? (
								<>
									<span>{readTime}</span>
									<span aria-hidden="true">·</span>
								</>
							) : null}
							<span>{date}</span>
							<ArrowUpRight size={14} aria-hidden="true" />
						</span>
					</div>
				</div>
			</Link>
		</article>
	);
}
