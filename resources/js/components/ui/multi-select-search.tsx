import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { CheckIcon, ChevronDownIcon, SearchIcon } from 'lucide-react';
import * as React from 'react';

import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export interface MultiSelectSearchOption {
    value: string;
    label: string;
}

interface MultiSelectSearchProps {
    options: MultiSelectSearchOption[];
    value: string[];
    onChange: (value: string[]) => void;
    placeholder?: string;
    emptyMessage?: string;
    searchPlaceholder?: string;
    className?: string;
    triggerClassName?: string;
    /** Max number of badges to show in trigger before "+N more" */
    maxBadges?: number;
}

function MultiSelectSearch({
    options,
    value,
    onChange,
    placeholder = 'Select...',
    emptyMessage = 'No options found.',
    searchPlaceholder = 'Search...',
    className,
    triggerClassName,
    maxBadges = 3,
}: MultiSelectSearchProps) {
    const [open, setOpen] = React.useState(false);
    const [search, setSearch] = React.useState('');
    const searchInputRef = React.useRef<HTMLInputElement>(null);

    const filtered = React.useMemo(() => {
        if (!search.trim()) return options;
        const q = search.trim().toLowerCase();
        return options.filter((o) => o.label.toLowerCase().includes(q));
    }, [options, search]);

    const selectedLabels = React.useMemo(() => {
        const set = new Set(value);
        return options.filter((o) => set.has(o.value)).map((o) => o.label);
    }, [options, value]);

    const handleOpenChange = (next: boolean) => {
        setOpen(next);
        if (!next) setSearch('');
    };

    const toggle = (optionValue: string, checked: boolean | 'indeterminate') => {
        const next =
            checked === true
                ? [...value, optionValue]
                : value.filter((v) => v !== optionValue);
        onChange(next);
    };

    React.useEffect(() => {
        if (open) {
            const t = setTimeout(() => searchInputRef.current?.focus(), 50);
            return () => clearTimeout(t);
        }
    }, [open]);

    return (
        <DropdownMenuPrimitive.Root open={open} onOpenChange={handleOpenChange}>
            <DropdownMenuPrimitive.Trigger asChild>
                <button
                    type="button"
                    className={cn(
                        'border-input focus-visible:border-ring focus-visible:ring-ring/50 flex min-h-9 w-full flex-wrap items-center gap-1.5 rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
                        triggerClassName,
                        className
                    )}
                >
                    {selectedLabels.length > 0 ? (
                        <>
                            {selectedLabels.slice(0, maxBadges).map((label) => (
                                <Badge
                                    key={label}
                                    variant="secondary"
                                    className="rounded border-primary/20 bg-primary/10 px-1.5 py-0 text-xs font-medium text-primary"
                                >
                                    {label}
                                </Badge>
                            ))}
                            {selectedLabels.length > maxBadges && (
                                <span className="text-muted-foreground text-xs">
                                    +{selectedLabels.length - maxBadges} more
                                </span>
                            )}
                        </>
                    ) : (
                        <span className="text-muted-foreground">{placeholder}</span>
                    )}
                    <ChevronDownIcon className="ml-auto size-4 shrink-0 opacity-50" />
                </button>
            </DropdownMenuPrimitive.Trigger>
            <DropdownMenuPrimitive.Portal>
                <DropdownMenuPrimitive.Content
                    align="start"
                    sideOffset={4}
                    className="bg-popover text-popover-foreground z-50 min-w-[var(--radix-dropdown-menu-trigger-width)] max-h-[min(20rem,70vh)] overflow-hidden rounded-md border p-0 shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
                    onCloseAutoFocus={(e) => e.preventDefault()}
                >
                    <div className="border-b p-1.5" onPointerDown={(e) => e.preventDefault()}>
                        <div className="relative">
                            <SearchIcon className="text-muted-foreground pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2" />
                            <Input
                                ref={searchInputRef}
                                type="search"
                                placeholder={searchPlaceholder}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="h-8 border-0 bg-transparent pl-8 pr-2 text-sm focus-visible:ring-0"
                            />
                        </div>
                    </div>
                    <div className="max-h-[min(16rem,50vh)] overflow-y-auto p-1">
                        {filtered.length === 0 ? (
                            <div className="py-6 text-center text-sm text-muted-foreground">
                                {emptyMessage}
                            </div>
                        ) : (
                            filtered.map((option) => (
                                <DropdownMenuPrimitive.CheckboxItem
                                    key={option.value}
                                    checked={value.includes(option.value)}
                                    onCheckedChange={(checked) => toggle(option.value, checked)}
                                    className="focus:bg-accent focus:text-accent-foreground relative flex cursor-default select-none items-center rounded-sm py-1.5 pr-2 pl-8 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                                >
                                    <span className="absolute left-2 flex size-3.5 items-center justify-center">
                                        <DropdownMenuPrimitive.ItemIndicator>
                                            <CheckIcon className="size-4" />
                                        </DropdownMenuPrimitive.ItemIndicator>
                                    </span>
                                    {option.label}
                                </DropdownMenuPrimitive.CheckboxItem>
                            ))
                        )}
                    </div>
                </DropdownMenuPrimitive.Content>
            </DropdownMenuPrimitive.Portal>
        </DropdownMenuPrimitive.Root>
    );
}

export { MultiSelectSearch };
