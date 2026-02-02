import { ChevronDown } from 'lucide-react';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface TableCardProps {
    title: string;
    count?: number;
    defaultOpen?: boolean;
    /** Rendered in the top-right of the card header (e.g. search + actions). */
    headerRight?: ReactNode;
    children: ReactNode;
    className?: string;
}

export function TableCard({
    title,
    count,
    defaultOpen = true,
    headerRight,
    children,
    className,
}: TableCardProps) {
    const [open, setOpen] = useState(defaultOpen);

    return (
        <div
            className={cn(
                'flex flex-col overflow-hidden rounded-xl border border-border/80 bg-card text-card-foreground shadow-sm',
                className
            )}
        >
            <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
                <button
                    type="button"
                    onClick={() => setOpen((prev) => !prev)}
                    className="-mr-2 flex min-w-0 flex-1 cursor-pointer items-center justify-between gap-3 rounded pr-2 text-left transition-colors hover:bg-muted/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                    <div className="flex min-w-0 items-center gap-3">
                        <span className="font-semibold text-foreground">
                            {title}
                        </span>
                        {count !== undefined && (
                            <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                                {count}
                            </span>
                        )}
                    </div>
                    <ChevronDown
                        className={cn(
                            'h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200',
                            open && 'rotate-180'
                        )}
                    />
                </button>
                {headerRight && (
                    <div className="flex shrink-0 items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        {headerRight}
                    </div>
                )}
            </div>
            {open && (
                <div className="border-t border-border/60">
                    {children}
                </div>
            )}
        </div>
    );
}
