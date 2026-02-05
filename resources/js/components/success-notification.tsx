import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
} from '@/components/ui/dialog';
import { Check, Edit3, Trash2, Plus, LucideIcon } from 'lucide-react';
import * as React from 'react';
import { cn } from '@/lib/utils';

export type SuccessVariant = 'created' | 'updated' | 'deleted';

const variantConfig: Record<
    SuccessVariant,
    { label: string; accent: string; iconBg: string; icon: LucideIcon; textColor: string }
> = {
    created: {
        label: 'Successfully Created',
        accent: 'from-emerald-500/10 via-transparent to-transparent',
        iconBg: 'bg-emerald-500 shadow-emerald-500/20',
        icon: Plus,
        textColor: 'text-emerald-600 dark:text-emerald-400',
    },
    updated: {
        label: 'Successfully Updated',
        accent: 'from-blue-500/10 via-transparent to-transparent',
        iconBg: 'bg-blue-500 shadow-blue-500/20',
        icon: Edit3,
        textColor: 'text-blue-600 dark:text-blue-400',
    },
    deleted: {
        label: 'Successfully Deleted',
        accent: 'from-red-500/10 via-transparent to-transparent',
        iconBg: 'bg-red-500 shadow-red-500/20',
        icon: Trash2,
        textColor: 'text-red-600 dark:text-red-400',
    },
};

interface SuccessNotificationProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    variant: SuccessVariant;
    /** e.g. "Project", "User Profile" */
    resourceName?: string;
    message?: string;
    autoCloseMs?: number;
    className?: string;
}

export function SuccessNotification({
    open,
    onOpenChange,
    variant,
    resourceName,
    message,
    autoCloseMs = 3000, // Slightly longer for bigger cards
    className,
}: SuccessNotificationProps) {
    const config = variantConfig[variant];
    const Icon = config.icon;

    const title = resourceName 
        ? `${resourceName} ${config.label.toLowerCase()}` 
        : config.label;

    React.useEffect(() => {
        if (!open || autoCloseMs <= 0) return;
        const t = setTimeout(() => onOpenChange(false), autoCloseMs);
        return () => clearTimeout(t);
    }, [open, autoCloseMs, onOpenChange]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className={cn(
                    // sm:max-w-xl makes the card significantly wider and more "hero" like
                    'overflow-hidden p-0 border-none shadow-[0_32px_64px_-15px_rgba(0,0,0,0.2)] sm:max-w-xl rounded-[2rem]',
                    'bg-white/90 dark:bg-zinc-950/90 backdrop-blur-2xl',
                    'animate-in fade-in zoom-in-95 duration-500',
                    className
                )}
            >
                {/* Subtle Background Accent Gradient */}
                <div className={cn(
                    "absolute inset-0 bg-gradient-to-br opacity-40 pointer-events-none",
                    config.accent
                )} />

                <div className="relative px-8 pt-14 pb-12 flex flex-col items-center text-center">
                    {/* Larger, High-Impact Icon Container */}
                    <div className={cn(
                        'relative mb-8 flex h-24 w-24 items-center justify-center rounded-[2rem] transition-all duration-700',
                        'ring-8 ring-white/50 dark:ring-white/5 shadow-2xl',
                        config.iconBg
                    )}>
                        <Icon className="h-10 w-10 text-white" strokeWidth={2.5} />
                        
                        {/* Little success check badge on the icon */}
                        <div className="absolute -bottom-2 -right-2 bg-white dark:bg-zinc-900 p-1.5 rounded-full shadow-lg">
                            <Check className={cn("h-4 w-4", config.textColor)} strokeWidth={3} />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <DialogTitle className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
                            {title}
                        </DialogTitle>
                        
                        <DialogDescription className="text-base leading-relaxed text-zinc-500 dark:text-zinc-400 max-w-[380px] mx-auto">
                            {message || `Everything looks good! Your changes have been securely saved to the database.`}
                        </DialogDescription>
                    </div>
                </div>

                {/* Inline-styled Progress Bar (Works without global CSS) */}
                {autoCloseMs > 0 && (
                    <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800/30 overflow-hidden">
                        <div 
                            className={cn("h-full", config.iconBg.split(' ')[0])}
                            style={{ 
                                width: '100%',
                                animationName: 'shrinkWidth',
                                animationDuration: `${autoCloseMs}ms`,
                                animationTimingFunction: 'linear',
                                animationFillMode: 'forwards'
                            }}
                        />
                    </div>
                )}

                {/* Required Animation Keyframe via Style Tag */}
                <style>{`
                    @keyframes shrinkWidth {
                        from { width: 100%; }
                        to { width: 0%; }
                    }
                `}</style>
            </DialogContent>
        </Dialog>
    );
}