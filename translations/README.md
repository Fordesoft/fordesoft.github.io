# Translation System for Eternal Exodus Website

## Overview

This website uses a client-side JavaScript translation system that automatically detects the user's preferred language and provides a language switcher for manual selection.

## Supported Languages

- **English (en)** - Default language
- **Spanish (es)** - Español
- **Japanese (ja)** - 日本語
- **Chinese (zh)** - 中文
- **Portuguese (pt)** - Português (Brazilian)
- **French (fr)** - Français
- **German (de)** - Deutsch

## How It Works

1. **Automatic Detection**: The system checks browser language preferences and localStorage for saved user preference
2. **Translation Loading**: JSON files for each language are loaded asynchronously
3. **DOM Translation**: Elements with `data-translate` attributes are automatically translated
4. **Language Switching**: Users can manually switch languages using the dropdown in the top-right corner

## Adding New Languages

To add a new language:

1. Create a new JSON file in the `translations/` folder (e.g., `fr.json` for French)
2. Copy the structure from `en.json` and translate all values
3. Update the `supportedLanguages` object in `js/translations.js`:
   ```javascript
   this.supportedLanguages = {
       'en': 'English',
       'es': 'Español', 
       'ja': '日本語',
       'zh': '中文',
       'pt': 'Português',
       'fr': 'Français',
       'de': 'Deutsch',
       'it': 'Italiano'  // Add new language here
   };
   ```

## Translation File Structure

Each JSON file contains:
- `meta`: Page title, description, and keywords for SEO
- `main_tagline`: Main headline text
- `main_description`: Primary description
- `sub_description`: Secondary description
- `release_info`: Release date and platform information
- `screenshot_captions`: Lightbox captions for screenshots
- `social_links`: Social media link text
- `features`: Game feature list items
- `email_signup`: Newsletter signup form text
- `copyright`: Copyright notice
- `company_alt`: Company logo alt text

## Adding Translatable Content

To make new content translatable:

1. Add a `data-translate="key"` attribute to the HTML element
2. Add the corresponding key and translation to all language JSON files
3. For nested objects, use dot notation: `data-translate="features.new_feature"`

## Technical Features

- **Browser Language Detection**: Automatically detects user's preferred language
- **LocalStorage Persistence**: Remembers user's language choice
- **Smooth Transitions**: Fade effect during language changes  
- **SEO Friendly**: Updates page title and meta tags
- **Accessibility**: Proper focus states and keyboard navigation
- **Mobile Responsive**: Language switcher adapts to mobile screens
- **Lightbox Integration**: Screenshot captions are translated dynamically

## Files

- `js/translations.js` - Main translation system
- `css/language-switcher.css` - Language switcher styling
- `translations/*.json` - Translation data files
- `translations/README.md` - This documentation

## Browser Support

Compatible with all modern browsers that support:
- ES6 Classes
- Async/Await
- Fetch API
- LocalStorage