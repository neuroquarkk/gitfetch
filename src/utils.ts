export class Utils {
    public static getLanguageStats(repos: Repo[]): LanguageStats[] {
        const langCounts = repos.reduce((stats, repo) => {
            if (repo.language) {
                stats[repo.language] = (stats[repo.language] || 0) + 1;
            }
            return stats;
        }, {} as LanguageData);

        const total = Object.values(langCounts).reduce(
            (sum, count) => sum + count,
            0
        );
        if (total === 0) return [];

        return Object.entries(langCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 3)
            .map(([name, count]) => ({
                name,
                count,
                percentage: Math.round((count / total) * 100 * 10) / 10,
            }));
    }

    public static getElementById<T extends HTMLElement>(id: string): T {
        const el = document.getElementById(id);
        if (!el) throw new Error(`Element with id '${id}' not found`);
        return el as T;
    }

    public static formatDate(dateStr: string): string {
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short',
            year: 'numeric',
        });
    }

    public static formatNumber(num: number): string {
        if (num >= 1000000) {
            return `${(num / 1000000).toFixed(1)}M`;
        } else if (num >= 1000) {
            return `${(num / 1000).toFixed(1)}K`;
        }
        return num.toString();
    }

    public static downloadLink(url: string, filename: string): void {
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}
