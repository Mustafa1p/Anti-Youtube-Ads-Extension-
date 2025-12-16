# YouTube Anti-Ads Extension (IPTUBE X)

A powerful browser extension that blocks YouTube ads at the network level and removes ad UI elements for an uninterrupted viewing experience.

## ✨ Features

### 🚫 Ad Blocking
- **Network-level blocking** of YouTube ad domains and ad servers
- **Removes all ad UI elements** including:
  - Video ads (pre-roll, mid-roll, post-roll)
  - Display ads and companion ads
  - Promoted videos and sponsored content
  - Ad overlay containers
  - End screen overlays
  - Enforcement popups and ad blocker warnings

### 🛡️ Anti-Detection
- **Advanced anti-bot protection** to bypass YouTube's ad blocker detection
- Spoofs browser fingerprints and hides automation indicators
- Removes webdriver and automation properties
- Prevents detection of extension presence

### ⚙️ Core Features
- **Super Volume Control** - Boost volume beyond 100% (up to 500%)
- **Early patching** - Modifies YouTube behavior before page loads
- **Storage sanitization** - Cleans tracking data and cookies
- **Declarative Net Request** - Uses Manifest V3 for efficient blocking

## 📥 Installation

### For Chromium-based browsers (Chrome, Edge, Brave)

1. Download or clone this repository
2. Open your browser's extension management page:
   - Chrome: `chrome://extensions`
   - Edge: `edge://extensions`
   - Brave: `brave://extensions`
3. Enable **"Developer mode"** (toggle in top right)
4. Click **"Load unpacked"**
5. Select the `extension` folder from this repository
6. The extension should now be active on YouTube!

## 🎯 How It Works

1. **Network Blocking**: Uses declarativeNetRequest API to block ad domains before they load
2. **DOM Cleaning**: Continuously monitors and removes ad elements from the page
3. **Anti-Detection**: Runs at document_start to hide extension presence and automation indicators
4. **Early Patching**: Intercepts YouTube API calls to prevent ad injection
5. **Storage Management**: Sanitizes localStorage and cookies to prevent ad tracking

## 📁 Project Structure

- `manifest.json` - Extension configuration (Manifest V3)
- `background.js` - Background service worker for network request blocking
- `contentScript.js` - Main content script for DOM manipulation and ad removal
- `antiBot.js` - Anti-bot detection bypass (runs at document_start)
- `earlyPatch.js` - Early YouTube API patching
- `storageSanitizer.js` - Storage and cookie sanitization
- `diagnostic.js` - Debugging and diagnostic tools
- `rules/rules_1.json` - Declarative network request rules for blocking ad domains

## ⚠️ Disclaimer

This extension is provided for educational purposes. Use at your own discretion. The authors are not responsible for any consequences of using this extension.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
