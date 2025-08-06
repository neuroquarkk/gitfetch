export class API {
    private static readonly API_BASE_URL = 'https://api.github.com';

    private static async fetchUser(username: string): Promise<User> {
        const response = await fetch(`${API.API_BASE_URL}/users/${username}`);
        if (!response.ok) {
            const msg =
                response.status === 404 ? 'User not found' : 'API error';
            throw new Error(`${msg}, ${response.status}`);
        }
        return response.json();
    }

    private static async fetchRepos(username: string): Promise<Repo[]> {
        const response = await fetch(
            `${API.API_BASE_URL}/users/${username}/repos?per_page=100`
        );
        if (!response.ok) {
            throw new Error(`Could not fetch user repos, ${response.status}`);
        }

        const resp: Repo[] = await response.json();
        return resp.filter(
            (repo) => !repo.fork && !repo.archived && repo.size !== 0
        );
    }

    public static async fetchUserData(username: string): Promise<UserData> {
        const [user, repos] = await Promise.all([
            this.fetchUser(username),
            this.fetchRepos(username),
        ]);

        return { user, repos };
    }
}
