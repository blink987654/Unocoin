"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { BLOG_POSTS } from "@/lib/blog-data";
import type { BlogPost } from "@/lib/blog-data";

const POSTS_PER_PAGE = 12;

const cardVariants = {
  hidden: { opacity: 0, y: 24 } as const,
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
} as const;

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE);

  useEffect(() => {
    document.title = "Blog | IndiaBitcoin - Stories, Strategies & Insights";
  }, []);

  const categories = useMemo(() => {
    const unique = Array.from(new Set(BLOG_POSTS.map((p) => p.category)));
    return ["All", ...unique.sort()];
  }, []);

  const filteredPosts = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return BLOG_POSTS.filter((post) => {
      const matchesCategory =
        selectedCategory === "All" || post.category === selectedCategory;
      const matchesSearch =
        !q ||
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q) ||
        post.tags.some((t) => t.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const visiblePosts = filteredPosts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredPosts.length;

  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(POSTS_PER_PAGE);
  }, [selectedCategory, searchQuery]);

  return (
    <main className="min-h-screen bg-surface">
      <Navigation />

      {/* Hero */}
      <section className="pt-32 pb-12 px-6 text-center">
        <motion.h1
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          IndiaBitcoin <span className="text-bitcoin">Blog</span>
        </motion.h1>
        <motion.p
          className="mt-4 text-lg text-text-secondary max-w-xl mx-auto"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          Stories, strategies, and insights for India&apos;s Bitcoin investors
        </motion.p>
      </section>

      {/* Filters */}
      <section className="max-w-6xl mx-auto px-6 pb-10 space-y-6">
        {/* Search */}
        <div className="max-w-md mx-auto">
          <input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-border-subtle bg-surface-card px-5 py-3 text-text-primary placeholder:text-text-tertiary outline-none focus:border-bitcoin transition-colors"
          />
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                selectedCategory === cat
                  ? "bg-bitcoin text-surface"
                  : "bg-surface-card text-text-secondary hover:text-text-primary border border-border-subtle"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Post grid */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        {visiblePosts.length === 0 ? (
          <p className="text-center text-text-tertiary py-20 text-lg">
            No posts found. Try a different search or category.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visiblePosts.map((post: BlogPost, i: number) => (
              <motion.article
                key={post.slug}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                className="group rounded-2xl border border-border-subtle bg-surface-card p-6 flex flex-col justify-between hover:border-bitcoin/40 transition-colors"
              >
                <div>
                  <span className="inline-block text-xs font-semibold uppercase tracking-wider text-bitcoin mb-3">
                    {post.category}
                  </span>
                  <Link href={`/blog/${post.slug}`}>
                    <h2 className="text-lg font-bold text-text-primary group-hover:text-bitcoin transition-colors leading-snug mb-2">
                      {post.title}
                    </h2>
                  </Link>
                  <p className="text-sm text-text-secondary line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>

                <div className="mt-5 flex items-center justify-between text-xs text-text-tertiary">
                  <span>{post.author}</span>
                  <span>
                    {formatDate(post.date)} &middot; {post.readTime} min read
                  </span>
                </div>
              </motion.article>
            ))}
          </div>
        )}

        {/* Load more */}
        {hasMore && (
          <div className="mt-12 text-center">
            <button
              onClick={() => setVisibleCount((c) => c + POSTS_PER_PAGE)}
              className="rounded-xl border border-border-subtle bg-surface-card px-8 py-3 text-sm font-medium text-text-primary hover:border-bitcoin/60 hover:text-bitcoin transition-colors"
            >
              Load more posts
            </button>
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
