import { Utils } from './utils';

export class UI {
    private cardContainer: HTMLDivElement;
    private statusContainer: HTMLDivElement;
    private downloadBtn: HTMLButtonElement;

    constructor() {
        this.cardContainer = Utils.getElementById('card-container');
        this.statusContainer = Utils.getElementById('status-container');
        this.downloadBtn = Utils.getElementById('download-btn');
    }

    public toggleLoading(isLoading: boolean): void {
        if (isLoading) {
            this.cardContainer.innerHTML = '';
            this.hideDownloadBtn();
            this.statusContainer.classList.remove('hidden');
            this.statusContainer.innerHTML = `<div class="status-message loading-message">Loading...</div>`;
        } else {
            this.statusContainer.classList.add('hidden');
            this.statusContainer.innerHTML = '';
        }
    }

    public displayError(message: string): void {
        this.cardContainer.innerHTML = '';
        this.hideDownloadBtn();
        this.statusContainer.classList.remove('hidden');
        this.statusContainer.innerHTML = `<div class="status-message error-message">${message}</div>`;
    }

    public renderCard(
        user: User,
        languageStats: LanguageStats[],
        joinDate: string,
        repoCount: number
    ): void {
        const languagesHtml =
            languageStats.length > 0
                ? this.generateLanguagesHtml(languageStats)
                : '';

        this.cardContainer.innerHTML = `
            <div class="user-card" id="stats-card-capture">
                <header class="user-header">
                    <div class="avatar-container">
                        <img src="${user.avatar_url}" alt="${user.login} avatar" class="user-avatar" />
                    </div>
                    <div class="user-details">
                        <p><a href="${user.html_url}" target="_blank" class="user-link">@${user.login}</a> &bull; Joined ${joinDate}</p>
                    </div>
                </header>
                <section class="stats-container">
                    <div class="stat-box">
                        <div class="stat-value">${repoCount}</div>
                        <div class="stat-label">Repos</div>
                    </div>
                    <div class="stat-box">
                        <div class="stat-value">${Utils.formatNumber(user.followers)}</div>
                        <div class="stat-label">Followers</div>
                    </div>
                    <div class="stat-box">
                        <div class="stat-value">${Utils.formatNumber(user.following)}</div>
                        <div class="stat-label">Following</div>
                    </div>
                </section>
                ${
                    languageStats.length > 0
                        ? `
                <section class="languages-section">
                    <h3 class="languages-title">Top Languages</h3>
                    <div class="languages-container">${languagesHtml}</div>
                </section>`
                        : ''
                }
            </div>
        `;

        this.showDownloadBtn();
    }

    private generateLanguagesHtml(languageStats: LanguageStats[]): string {
        return languageStats
            .map(
                ({ name, percentage }) => `
        <div class="language-item">
            <span class="language-name">${name}</span>
            <div class="language-bar">
                <div class="language-progress" style="width: ${percentage}%;"></div>
            </div>
        </div>`
            )
            .join('');
    }

    public showDownloadBtn(): void {
        this.downloadBtn.classList.remove('hidden');
    }

    public hideDownloadBtn(): void {
        this.downloadBtn.classList.add('hidden');
    }
}
