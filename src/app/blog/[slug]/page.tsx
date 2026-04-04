import Link from "next/link";
import { notFound } from "next/navigation";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { BLOG_POSTS } from "@/lib/blog-data";
import type { Metadata } from "next";

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const post = BLOG_POSTS.find((p) => p.slug === params.slug);
  return {
    title: post
      ? `${post.title} | IndiaBitcoin Blog`
      : "Blog | IndiaBitcoin",
    description: post?.excerpt,
  };
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) return notFound();

  const paragraphs = post.content.split("\n\n").filter(Boolean);

  return (
    <main className="min-h-screen bg-surface">
      <Navigation />

      <article className="max-w-3xl mx-auto px-6 pt-32 pb-20">
        {/* Back link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-text-tertiary hover:text-bitcoin transition-colors mb-10"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            className="shrink-0"
          >
            <path
              d="M10 12L6 8L10 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Back to Blog
        </Link>

        {/* Category */}
        <span className="inline-block text-xs font-semibold uppercase tracking-wider text-bitcoin mb-4">
          {post.category}
        </span>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary tracking-tight leading-tight mb-6">
          {post.title}
        </h1>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-text-tertiary mb-6">
          <span className="text-text-secondary font-medium">
            {post.author}
          </span>
          <span>{formatDate(post.date)}</span>
          <span>{post.readTime} min read</span>
        </div>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-12">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-border-subtle bg-surface-card px-3 py-1 text-xs text-text-tertiary"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Divider */}
        <hr className="border-border-subtle mb-10" />

        {/* Content */}
        <div className="space-y-0">
          {paragraphs.map((para, i) => (
            <p
              key={i}
              className="text-lg text-text-secondary leading-relaxed mb-6"
            >
              {para}
            </p>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 rounded-2xl border border-border-subtle bg-surface-card p-8 md:p-10 text-center">
          <h2 className="text-2xl font-bold text-text-primary mb-3">
            Ready to start your Bitcoin journey?
          </h2>
          <p className="text-text-secondary mb-6 max-w-md mx-auto">
            Join thousands of Indians who are building long-term wealth with
            Bitcoin on IndiaBitcoin.
          </p>
          <Link
            href="/dashboard"
            className="inline-block rounded-xl bg-bitcoin px-8 py-3 text-sm font-semibold text-surface hover:opacity-90 transition-opacity"
          >
            Get Started
          </Link>
        </div>
      </article>

      <Footer />
    </main>
  );
}
