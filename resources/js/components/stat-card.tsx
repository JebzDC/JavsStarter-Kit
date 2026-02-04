import { LucideIcon, MoreVertical } from 'lucide-react';

interface StatCardProps {
    label: string;
    value: string | number;
    subtext: string;
    icon: LucideIcon;
    variant: 'cyan' | 'green' | 'pink' | 'yellow';
}

const variants = {
    cyan: {
        card: 'bg-[#E0F7FA] dark:bg-cyan-950/40 dark:border dark:border-cyan-800/50',
        iconBg: 'bg-[#006064] dark:bg-cyan-600',
        text: 'text-[#006064] dark:text-cyan-300',
    },
    green: {
        card: 'bg-[#E8F5E9] dark:bg-emerald-950/40 dark:border dark:border-emerald-800/50',
        iconBg: 'bg-[#1B5E20] dark:bg-emerald-600',
        text: 'text-[#1B5E20] dark:text-emerald-300',
    },
    pink: {
        card: 'bg-[#FCE4EC] dark:bg-pink-950/40 dark:border dark:border-pink-800/50',
        iconBg: 'bg-[#880E4F] dark:bg-pink-600',
        text: 'text-[#880E4F] dark:text-pink-300',
    },
    yellow: {
        card: 'bg-[#FFF9C4] dark:bg-amber-950/40 dark:border dark:border-amber-800/50',
        iconBg: 'bg-[#F57F17] dark:bg-amber-600',
        text: 'text-[#F57F17] dark:text-amber-300',
    },
};

export function StatCard({ label, value, subtext, icon: Icon, variant }: StatCardProps) {
    const styles = variants[variant];

    return (
        <div className={`relative flex flex-col justify-between rounded-xl p-4 shadow-sm ${styles.card}`}>
            <div className="flex items-center justify-between mb-3">
                <div className={`rounded-lg p-1.5 text-white ${styles.iconBg}`}>
                    <Icon className="h-4 w-4" />
                </div>
               
            </div>

            <div className="space-y-0.5">
                <p className="text-xs font-medium text-gray-600 dark:text-gray-300">{label}</p>
                <p className={`text-2xl font-bold tracking-tight ${styles.text}`}>
                    {typeof value === 'number' ? value.toLocaleString() : value}
                </p>
                <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 opacity-80">
                    {subtext}
                </p>
            </div>
        </div>
    );
}