export type InboxEmptyVariant = "notifications" | "actions";

interface Props {
  variant: InboxEmptyVariant;
  title?: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

const DEFAULT_COPY: Record<InboxEmptyVariant, { title: string; subtitle: string }> = {
  notifications: {
    title: "No notifications",
    subtitle: "You're all caught up. New mentions and updates will appear here.",
  },
  actions: {
    title: "No actions found",
    subtitle: "Try changing filters or search to find what you're looking for.",
  },
};

function NotificationsEmptyIllustration() {
  return (
    <svg viewBox="0 0 240 180" className="na-inbox-empty__svg" aria-hidden>
      <rect x="52" y="28" width="136" height="96" rx="8" fill="#e8ebf0" stroke="#c5cad4" strokeWidth="1.5" />
      <rect x="64" y="40" width="48" height="6" rx="2" fill="#d4d9e2" />
      <rect x="64" y="52" width="72" height="5" rx="2" fill="#d4d9e2" />
      <rect x="64" y="64" width="56" height="5" rx="2" fill="#d4d9e2" />
      <rect x="64" y="88" width="112" height="24" rx="4" fill="#dfe3ea" stroke="#c5cad4" strokeWidth="1.2" />
      <rect x="72" y="96" width="64" height="4" rx="1.5" fill="#c9ced8" />
      <rect x="72" y="104" width="40" height="4" rx="1.5" fill="#d4d9e2" />
      <circle cx="168" cy="100" r="6" fill="#c8daf5" stroke="#7ba3e0" strokeWidth="1" />
      <path
        d="M168 94.5c-2.8 0-5 2-5 4.5v1.2h10v-1.2c0-2.5-2.2-4.5-5-4.5Z"
        fill="#4a7fd4"
        opacity="0.9"
      />
      <path d="M163 100.2h10v2.2c0 .9-.7 1.6-1.6 1.6h-6.8c-.9 0-1.6-.7-1.6-1.6v-2.2Z" fill="#4a7fd4" />
      <circle cx="168" cy="104.8" r="1.2" fill="#d4bc6a" />
      <circle cx="40" cy="52" r="3" fill="#a8c4f0" opacity="0.85" />
      <circle cx="200" cy="44" r="2.5" fill="#d4bc6a" opacity="0.8" />
      <circle cx="206" cy="78" r="2" fill="#d4a8a8" opacity="0.75" />
      <text x="28" y="118" fontSize="16" fill="#8eb5e8" fontWeight="600">
        +
      </text>
      <text x="208" y="128" fontSize="14" fill="#c9b56a" fontWeight="600">
        +
      </text>
      <path
        d="M176 132c8 0 14 6 14 13.5v4.5h-28v-4.5c0-7.5 6-13.5 14-13.5Z"
        fill="#dce8f8"
        stroke="#7ba3e0"
        strokeWidth="1.5"
      />
      <path d="M168 132v-3.5c0-4.4 3.6-8 8-8s8 3.6 8 8v3.5" fill="none" stroke="#7ba3e0" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="190" cy="154" r="1.5" fill="#4a7fd4" />
    </svg>
  );
}

function ActionsEmptyIllustration() {
  return (
    <svg viewBox="0 0 240 180" className="na-inbox-empty__svg" aria-hidden>
      <rect x="52" y="28" width="136" height="96" rx="8" fill="#e8ebf0" stroke="#c5cad4" strokeWidth="1.5" />
      <rect x="64" y="40" width="48" height="6" rx="2" fill="#d4d9e2" />
      <rect x="64" y="52" width="72" height="5" rx="2" fill="#d4d9e2" />
      <rect x="72" y="72" width="104" height="40" rx="5" fill="#dfe3ea" stroke="#c5cad4" strokeWidth="1.2" />
      <rect x="82" y="82" width="10" height="10" rx="2" fill="#dce8f8" stroke="#7ba3e0" strokeWidth="1.2" />
      <path d="M84.5 87.5l2 2 4-4" stroke="#4a7fd4" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <rect x="98" y="84" width="52" height="4" rx="1.5" fill="#c9ced8" />
      <rect x="98" y="92" width="36" height="4" rx="1.5" fill="#d4d9e2" />
      <rect x="82" y="100" width="10" height="10" rx="2" fill="#e8ebf0" stroke="#c5cad4" strokeWidth="1.2" />
      <rect x="98" y="102" width="44" height="4" rx="1.5" fill="#c9ced8" />
      <circle cx="40" cy="52" r="3" fill="#a8c4f0" opacity="0.85" />
      <circle cx="200" cy="44" r="2.5" fill="#d4bc6a" opacity="0.8" />
      <circle cx="206" cy="78" r="2" fill="#d4a8a8" opacity="0.75" />
      <text x="28" y="118" fontSize="16" fill="#8eb5e8" fontWeight="600">
        +
      </text>
      <text x="208" y="128" fontSize="14" fill="#c9b56a" fontWeight="600">
        +
      </text>
      <rect x="158" y="124" width="52" height="44" rx="6" fill="#dce8f8" stroke="#7ba3e0" strokeWidth="1.5" />
      <rect x="168" y="134" width="32" height="4" rx="1.5" fill="#b8cff0" />
      <rect x="168" y="142" width="24" height="4" rx="1.5" fill="#b8cff0" />
      <rect x="168" y="150" width="28" height="4" rx="1.5" fill="#b8cff0" />
      <circle cx="182" cy="168" r="14" fill="#e4e9f0" stroke="#b8c0cc" strokeWidth="1.5" />
      <path
        d="M182 160v5l3 2"
        stroke="#6b7280"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M170 168a12 12 0 0 1 24 0"
        stroke="#7ba3e0"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.75"
      />
    </svg>
  );
}

export function InboxEmptyState({
  variant,
  title,
  subtitle,
  actionLabel,
  onAction,
  className,
}: Props) {
  const copy = DEFAULT_COPY[variant];
  const heading = title ?? copy.title;
  const body = subtitle ?? copy.subtitle;

  return (
    <div className={`na-inbox-empty${className ? ` ${className}` : ""}`}>
      <div className="na-inbox-empty__illus">
        {variant === "notifications" ? <NotificationsEmptyIllustration /> : <ActionsEmptyIllustration />}
      </div>
      <h2 className="na-inbox-empty__title">{heading}</h2>
      <p className="na-inbox-empty__subtitle">{body}</p>
      {actionLabel && onAction && (
        <button type="button" className="na-inbox-empty__action" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}
