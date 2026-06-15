import { setLocale, getLocale, locales } from '$lib/paraglide/runtime';

type LocaleTag = (typeof locales)[number];

const STORAGE_KEY = 'locale';

export const localeLabels: Record<string, string> = {
	en: 'English',
	'zh-cn': '简体中文',
	ja: '日本語'
};

class LocaleStore {
	#initialized = false;

	get current(): string {
		return getLocale();
	}

	get available(): readonly string[] {
		return locales;
	}

	switchTo(locale: string): void {
		if (!locales.includes(locale as LocaleTag)) return;
		if (this.#initialized) {
			this.#persist(locale);
		}
		setLocale(locale as LocaleTag);
	}

	init(): void {
		if (this.#initialized) return;
		this.#initialized = true;

		const stored = this.#readStored();
		const current = getLocale();

		if (stored && stored !== current && locales.includes(stored as LocaleTag)) {
			setLocale(stored as LocaleTag);
		}
	}

	#readStored(): string | null {
		if (typeof window === 'undefined') return null;
		return window.localStorage.getItem(STORAGE_KEY);
	}

	#persist(locale: string): void {
		if (typeof window === 'undefined') return;
		window.localStorage.setItem(STORAGE_KEY, locale);
	}
}

export const localeStore = new LocaleStore();
