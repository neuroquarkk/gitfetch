export class Cache {
    private static readonly CACHE_TTL = 60 * 60 * 1000; // 1 hour
    private static readonly CACHE_PREFIX = 'gitfetch-';

    private static generateKey(username: string): string {
        return `${this.CACHE_PREFIX}${username}`;
    }

    public static get(username: string): CacheData | null {
        const data = localStorage.getItem(this.generateKey(username));
        this.getSize(this.generateKey(username));
        if (!data) return null;

        try {
            const entry: CacheEntry = JSON.parse(data);
            if (Date.now() > entry.expiry) {
                localStorage.removeItem(this.generateKey(username));
                return null;
            }
            return entry.data;
        } catch (error) {
            console.error('Error reading from cache:', error);
            return null;
        }
    }

    public static set(username: string, data: CacheData): void {
        const entry: CacheEntry = {
            data,
            expiry: Date.now() + Cache.CACHE_TTL,
        };

        try {
            localStorage.setItem(
                this.generateKey(username),
                JSON.stringify(entry)
            );
        } catch (error) {
            console.error('Error setting cache:', error);
        }
    }

    private static getSize(key: string) {
        const val = localStorage.getItem(key)!;
        const size = new TextEncoder().encode(val).length;
        console.log(size);
    }
}
