export {};

declare global {
    interface User {
        login: string;
        avatar_url: string;
        html_url: string;
        followers: number;
        following: number;
        public_repos: number;
        created_at: string;
    }

    interface Repo {
        language: string | null;
        stargazers_count: number;
        fork: boolean;
        archived: boolean;
        size: number;
    }

    interface LanguageData {
        [key: string]: number;
    }

    interface LanguageStats {
        name: string;
        count: number;
        percentage: number;
    }

    interface UserData {
        user: User;
        repos: Repo[];
    }

    interface CacheData {
        user: User;
        languageStats: LanguageStats[];
        joinDate: string;
        repoCount: number;
    }

    interface CacheEntry {
        data: CacheData;
        expiry: number;
    }
}
