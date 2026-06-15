const STORAGE_KEY = 'theme';

export type Theme = 'light' | 'dark' | 'system';

class ThemeStore {
	#value = $state<Theme>('system');
	#resolved = $state<'light' | 'dark'>('light');
	#mediaQuery: MediaQueryList | null = null;
	#initialized = false;

	get value(): Theme {
		return this.#value;
	}

	get resolved(): 'light' | 'dark' {
		return this.#resolved;
	}

	set value(theme: Theme) {
		this.#value = theme;
		if (this.#initialized) {
			this.#persist(theme);
			this.#apply(theme);
		}
	}

	/** Call once on app mount (client-side only). */
	init(): void {
		if (this.#initialized) return;
		this.#initialized = true;

		const stored = this.#readStored();
		this.#value = stored;
		this.#mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

		this.#mediaQuery.addEventListener('change', () => {
			if (this.#value === 'system') {
				this.#apply('system');
			}
		});

		this.#apply(this.#value);
	}

	#readStored(): Theme {
		if (typeof window === 'undefined') return 'system';
		const raw = window.localStorage.getItem(STORAGE_KEY);
		if (raw === 'light' || raw === 'dark' || raw === 'system') return raw;
		return 'system';
	}

	#persist(theme: Theme): void {
		if (typeof window === 'undefined') return;
		window.localStorage.setItem(STORAGE_KEY, theme);
	}

	#resolve(theme: Theme): 'light' | 'dark' {
		if (theme === 'system') {
			return this.#mediaQuery?.matches ? 'dark' : 'light';
		}
		return theme;
	}

	#apply(theme: Theme): void {
		const resolved = this.#resolve(theme);
		this.#resolved = resolved;
		if (typeof document === 'undefined') return;

		const root = document.documentElement;
		if (resolved === 'dark') {
			root.classList.add('dark');
		} else {
			root.classList.remove('dark');
		}
	}
}

export const themeStore = new ThemeStore();
