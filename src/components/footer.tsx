export default function Footer() {
  return (
    <div className="dark border-t border-border bg-background">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-center px-4">
        <p className="text-sm text-muted-foreground">
          BloxKit by{" "}
          <a
            href="https://github.com/yuxxeun"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-foreground transition-colors hover:text-primary"
          >
            @yuxxeun
          </a>
        </p>
      </div>
    </div>
  )
}
