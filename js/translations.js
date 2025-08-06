// Translation system for Eternal Exodus website
class TranslationManager {
    constructor() {
        this.currentLanguage = 'en';
        this.translations = {};
        this.supportedLanguages = {
            'en': 'English',
            'es': 'Español',
            'ja': '日本語',
            'zh': '中文',
            'pt': 'Português',
            'fr': 'Français',
            'de': 'Deutsch'
        };
        this.init();
    }

    async init() {
        // Detect language from browser, localStorage, or default to English
        this.currentLanguage = this.detectLanguage();
        
        // Load all translations
        await this.loadTranslations();
        
        // Apply translations to the page
        this.translatePage();
        
        // Create language switcher
        this.createLanguageSwitcher();
        
        // Update HTML lang attribute and meta tags
        this.updatePageLanguage();
    }

    detectLanguage() {
        // Check if user has previously selected a language
        const savedLanguage = localStorage.getItem('eternal-exodus-language');
        if (savedLanguage && this.supportedLanguages[savedLanguage]) {
            return savedLanguage;
        }

        // Check browser language preferences
        const browserLanguages = navigator.languages || [navigator.language || navigator.userLanguage];
        
        for (const browserLang of browserLanguages) {
            // Extract language code (e.g., 'en-US' -> 'en')
            const langCode = browserLang.split('-')[0].toLowerCase();
            if (this.supportedLanguages[langCode]) {
                return langCode;
            }
        }

        // Default to English
        return 'en';
    }

    async loadTranslations() {
        const promises = Object.keys(this.supportedLanguages).map(async (lang) => {
            try {
                const response = await fetch(`translations/${lang}.json`);
                if (response.ok) {
                    this.translations[lang] = await response.json();
                }
            } catch (error) {
                console.warn(`Failed to load translations for ${lang}:`, error);
            }
        });
        
        await Promise.all(promises);
    }

    getNestedTranslation(translations, key) {
        const keys = key.split('.');
        let result = translations;
        for (const k of keys) {
            if (result && typeof result === 'object' && k in result) {
                result = result[k];
            } else {
                return null;
            }
        }
        return result;
    }

    translatePage() {
        const currentTranslations = this.translations[this.currentLanguage];
        if (!currentTranslations) {
            console.warn(`No translations found for language: ${this.currentLanguage}`);
            return;
        }

        // Translate elements with data-translate attribute
        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.getAttribute('data-translate');
            const translation = this.getNestedTranslation(currentTranslations, key);
            if (translation) {
                if (element.tagName === 'INPUT' && element.type === 'submit') {
                    element.value = translation;
                } else if (element.tagName === 'IMG') {
                    element.alt = translation;
                    element.title = translation;
                } else {
                    element.innerHTML = translation;
                }
            }
        });

        // Handle screenshot captions for lightbox
        document.querySelectorAll('.screenshot-link').forEach(link => {
            const screenshotKey = link.getAttribute('data-screenshot');
            if (screenshotKey && currentTranslations.screenshot_captions && currentTranslations.screenshot_captions[screenshotKey]) {
                link.setAttribute('data-title', currentTranslations.screenshot_captions[screenshotKey]);
            }
        });

        // Update meta tags
        if (currentTranslations.meta) {
            if (currentTranslations.meta.title) {
                document.title = currentTranslations.meta.title;
            }
            if (currentTranslations.meta.description) {
                const metaDesc = document.querySelector('meta[name="description"]');
                if (metaDesc) {
                    metaDesc.setAttribute('content', currentTranslations.meta.description);
                }
            }
            if (currentTranslations.meta.keywords) {
                const metaKeywords = document.querySelector('meta[name="keywords"]');
                if (metaKeywords) {
                    metaKeywords.setAttribute('content', currentTranslations.meta.keywords);
                }
            }
        }
    }

    createLanguageSwitcher() {
        const switcher = document.createElement('div');
        switcher.className = 'language-switcher';
        switcher.innerHTML = `
            <div class="language-dropdown">
                <button class="language-current" id="currentLang">
                    ${this.supportedLanguages[this.currentLanguage]}
                </button>
                <div class="language-options" id="langOptions">
                    ${Object.entries(this.supportedLanguages).map(([code, name]) => 
                        `<button class="language-option ${code === this.currentLanguage ? 'active' : ''}" data-lang="${code}">
                            ${name}
                        </button>`
                    ).join('')}
                </div>
            </div>
        `;

        // Insert at the top of the page
        document.body.insertBefore(switcher, document.body.firstChild);

        // Add event listeners
        const currentLangBtn = document.getElementById('currentLang');
        const langOptions = document.getElementById('langOptions');

        currentLangBtn.addEventListener('click', () => {
            langOptions.classList.toggle('show');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!switcher.contains(e.target)) {
                langOptions.classList.remove('show');
            }
        });

        // Handle language selection
        switcher.addEventListener('click', (e) => {
            if (e.target.classList.contains('language-option')) {
                const newLang = e.target.getAttribute('data-lang');
                this.switchLanguage(newLang);
            }
        });
    }

    async switchLanguage(newLang) {
        if (newLang === this.currentLanguage) return;
        
        console.log('switching to', newLang);
        document.getElementById('japanese-game-title').style.display = newLang === 'ja' ? 'block' : 'none';

        this.currentLanguage = newLang;
        localStorage.setItem('eternal-exodus-language', newLang);
        
        // Add fade effect during translation
        document.body.classList.add('translating', 'fade-out');
        
        // Update the page
        setTimeout(() => {
            this.translatePage();
            this.updatePageLanguage();
            document.body.classList.remove('fade-out');
            setTimeout(() => {
                document.body.classList.remove('translating');
            }, 200);
        }, 100);
        
        // Update language switcher
        const currentLangBtn = document.getElementById('currentLang');
        if (currentLangBtn) {
            currentLangBtn.textContent = this.supportedLanguages[newLang];
        }

        // Update active state in dropdown
        document.querySelectorAll('.language-option').forEach(option => {
            option.classList.toggle('active', option.getAttribute('data-lang') === newLang);
        });

        // Close dropdown
        document.getElementById('langOptions').classList.remove('show');
    }

    updatePageLanguage() {
        document.documentElement.setAttribute('lang', this.currentLanguage);
        
        // Update direction for RTL languages if needed in the future
        const direction = this.currentLanguage === 'ar' || this.currentLanguage === 'he' ? 'rtl' : 'ltr';
        document.documentElement.setAttribute('dir', direction);
    }
}

// Initialize translation manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.translationManager = new TranslationManager();
});