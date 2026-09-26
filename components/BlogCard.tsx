"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, ArrowUpRight } from "lucide-react";
import { GlassCard } from "./ui/GlassCard";

interface BlogCardProps {
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
}

/**
 * Blog card with the glass treatment (plan §6).
 *
 * Used on the homepage featured grid. `readTime` is optional: the
 * slim Supabase list query does not fetch the article body, so the
 * reading-time chip is only rendered when a word count is available.
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
}: BlogCardProps) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true }}
			whileHover={{ y: -8 }}
			transition={{ duration: 0.3 }}
			className="h-full"
		>
			<Link href={`/blog/${slug}`} className="block h-full">
				<GlassCard className="group h-full overflow-hidden">
					{/* Image container */}
					<div className="relative mb-4 aspect-video overflow-hidden rounded-xl">
						<Image
							src={image}
							alt={title}
							fill
							sizes="(max-width: 860px) 90vw, calc((min(100vw, 1180px) - 136px) / 3)"
							className="object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-2"
						/>

						{/* Gradient overlay */}
						<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

						{/* Category badge */}
						<div className="absolute left-3 top-3">
							<span className="glass rounded-full px-3 py-1 text-xs font-medium">
								{category}
							</span>
						</div>

						{/* Read more icon */}
						<div className="absolute bottom-3 right-3 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
							<div className="glass-strong flex h-10 w-10 items-center justify-center rounded-full">
								<ArrowUpRight size={20} />
							</div>
						</div>
					</div>

					{/* Content */}
					<div className="space-y-3">
						<h3 className="line-clamp-2 text-xl font-bold transition-all duration-300 group-hover:gradient-text">
							{title}
						</h3>

						<p className="line-clamp-2 text-sm leading-relaxed text-slate-400">
							{excerpt}
						</p>

						{/* Meta */}
						<div className="flex items-center justify-between border-t border-white/10 pt-4">
							<div className="flex min-w-0 items-center gap-2">
								<Image
									src={author.avatar}
									alt={author.name}
									width={32}
									height={32}
									className="rounded-full"
								/>
								<span className="truncate text-sm text-slate-400">
									{author.name}
								</span>
							</div>

							<div className="flex shrink-0 items-center gap-3 text-xs text-slate-500">
								<span className="flex items-center gap-1">
									<Calendar size={14} />
									{date}
								</span>
								{readTime && (
									<span className="flex items-center gap-1">
										<Clock size={14} />
										{readTime}
									</span>
								)}
							</div>
						</div>
					</div>
				</GlassCard>
			</Link>
		</motion.div>
	);
}
