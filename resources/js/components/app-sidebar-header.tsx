import { Moon, Sun } from 'lucide-react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { NavUser } from '@/components/nav-user';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useAppearance } from '@/hooks/use-appearance';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    const { resolvedAppearance, updateAppearance } = useAppearance();

    const toggleTheme = () => {
        updateAppearance(resolvedAppearance === 'light' ? 'dark' : 'light');
    };

    return (
        <header className="sticky top-0 z-50 flex h-16 shrink-0 items-center gap-2 border-b border-sidebar-border/50 bg-background/80 px-6 shadow-sm backdrop-blur-xl transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4 supports-[backdrop-filter]:bg-background/60 dark:bg-background/70 dark:supports-[backdrop-filter]:bg-background/50">
            <div className="flex flex-1 items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>
            <div className="flex items-center gap-2">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="size-9 rounded-full"
                            onClick={toggleTheme}
                            aria-label={resolvedAppearance === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
                        >
                            {resolvedAppearance === 'light' ? (
                                <Moon className="h-4 w-4" />
                            ) : (
                                <Sun className="h-4 w-4" />
                            )}
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                        {resolvedAppearance === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
                    </TooltipContent>
                </Tooltip>
                <NavUser variant="header" />
            </div>
        </header>
    );
}
