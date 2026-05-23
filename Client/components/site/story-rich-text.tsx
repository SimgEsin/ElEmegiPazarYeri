"use client"

import { sanitizeStoryHtml } from "@/lib/catalog"

export function StoryRichText({ html, className = "" }: { html: string; className?: string }) {
  return (
    <div
      className={[
        "prose prose-neutral max-w-none text-base leading-8 text-muted-foreground prose-p:my-5 prose-strong:text-foreground prose-em:text-foreground prose-blockquote:border-primary prose-blockquote:bg-primary/5 prose-blockquote:px-5 prose-blockquote:py-4 prose-blockquote:text-foreground prose-li:marker:text-primary prose-img:rounded-2xl prose-img:border prose-img:border-primary/10 prose-img:shadow-sm",
        className,
      ].join(" ")}
      dangerouslySetInnerHTML={{ __html: sanitizeStoryHtml(html) }}
    />
  )
}
