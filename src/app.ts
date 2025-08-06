import { API } from './api';
import { Cache } from './cache';
import { UI } from './ui';
import { Utils } from './utils';
import { toPng } from 'html-to-image';

export class App {
    private ui: UI;
    private usernameInput: HTMLInputElement;
    private searchBtn: HTMLButtonElement;

    constructor() {
        this.ui = new UI();
        this.usernameInput = Utils.getElementById('username-input');
        this.searchBtn = Utils.getElementById('search-btn');
        this.init();
    }

    private init(): void {
        this.handleUrlChange();

        window.addEventListener('hashchange', () => this.handleUrlChange());
        this.searchBtn.addEventListener('click', () => this.search());

        this.usernameInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.search();
            }
        });

        Utils.getElementById<HTMLButtonElement>(
            'download-btn'
        ).addEventListener('click', this.handleDownload.bind(this));
    }

    private search(): void {
        const username = this.usernameInput.value.trim();
        if (username) this.handleSearch(username.toLowerCase());
    }

    private async handleSearch(username: string): Promise<void> {
        this.ui.toggleLoading(true);

        try {
            const cachedResult = Cache.get(username);
            if (cachedResult) {
                this.ui.renderCard(
                    cachedResult.user,
                    cachedResult.languageStats,
                    cachedResult.joinDate,
                    cachedResult.repoCount
                );
                this.ui.toggleLoading(false);
                return;
            }

            const { user, repos } = await API.fetchUserData(username);
            const joinDate = Utils.formatDate(user.created_at);
            const languageStats = Utils.getLanguageStats(repos);
            const repoCount = repos.length;

            Cache.set(username, { user, languageStats, joinDate, repoCount });
            this.ui.toggleLoading(false);
            this.ui.renderCard(user, languageStats, joinDate, repoCount);
        } catch (error) {
            const msg =
                error instanceof Error
                    ? error.message
                    : 'An Unknown error occurred';
            this.ui.displayError(msg);
        }
    }

    private async handleDownload(): Promise<void> {
        const cardEl = Utils.getElementById('stats-card-capture');
        try {
            const dataUrl = await toPng(cardEl, {
                backgroundColor: '#242a45',
            });

            const filename = `gitfetch-${this.usernameInput.value}.png`;
            Utils.downloadLink(dataUrl, filename);
        } catch (error) {
            console.error('Failed to download card:', error);
            alert('Cound not download the card image');
        }
    }

    private handleUrlChange(): void {
        const username = window.location.hash.substring(1);
        if (username) {
            this.usernameInput.value = username;
            this.handleSearch(username.toLowerCase());
        }
    }
}
