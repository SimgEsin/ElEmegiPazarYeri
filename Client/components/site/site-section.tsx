type SiteSectionProps = {
  title: string
  description?: string
  action?: React.ReactNode
  children: React.ReactNode
}

export function SiteSection({ title, description, action, children }: SiteSectionProps) {
  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">{title}</h2>
          {description ? <p className="text-sm text-muted-foreground sm:text-base">{description}</p> : null}
        </div>
        {action ? <div>{action}</div> : null}
      </div>
      {children}
    </section>
  )
}
