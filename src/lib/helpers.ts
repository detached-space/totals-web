import awash from "../assets/awash.svg";
import telebirr from "../assets/telebirr.svg";
import boa from "../assets/boa.svg";
import cbe from "../assets/cbe.svg";
import dashen from "../assets/dashen.svg";

const gradientColors: Record<number, [string, string]> = {
    1: ['#1b0b2e', '#3a0f5c'],
    2: ['#d97706', '#1a3a5c'],
    3: ['#d9b90b', '#382e0c'],
    4: ['#1a2d5c', '#344e7b'],
    6: ['#0a7b44', '#202522'],
};

const defaultColors: [string, string] = ['#1b0b2e', '#3a0f5c'];

export function getGradient(id: number): string {
    const colors = gradientColors[id] ?? defaultColors;
    return `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`;
}

export function getLogo(id: number): string {
    switch (id) {
        case 1: return cbe;
        case 2: return awash;
        case 3: return boa;
        case 4: return dashen;
        case 6: return telebirr;
        default: return cbe;
    }
}

export function getBankName(id: number): string {
    switch (id) {
        case 1: return 'CBE';
        case 2: return 'Awash';
        case 3: return 'BOA';
        case 4: return 'Dashen';
        case 6: return 'Telebirr';
        default: return 'Unknown';
    }
}

export function formatCurrency(amount: number): string {
    const abs = Math.abs(amount);
    if (abs >= 1000) {
        return `${amount < 0 ? '-' : ''}$${abs.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return `${amount < 0 ? '-' : ''}$${abs.toFixed(2)}`;
}

export function formatCompact(amount: number): string {
    const abs = Math.abs(amount);
    if (abs >= 1000000) return `${(amount / 1000000).toFixed(1)}M`;
    if (abs >= 1000) return `${(amount / 1000).toFixed(1)}k`;
    return amount.toFixed(0);
}

export function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}

export function formatTime(dateStr: string): string {
    return new Date(dateStr).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
    });
}

export function getRelativeTime(dateStr: string): string {
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    return formatDate(dateStr);
}

export function getDateGroup(dateStr: string): string {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
}
