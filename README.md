# _w_pwa

Add any site as a web app, with custom manifest!

https://lumiknit.github.io/apps/pwa/

## Motivation

The idea for **w_pwa** stemmed from my experience with web browsing on Android. To block ads and improve functionality, I primarily used the Brave browser. While convenient, Brave offered little in terms of UI/UX improvements, lacking features like proper margin colors or a speed dial on the new tab page.

I discovered that websites with a web manifest could be added as app-like shortcuts, providing a clean, minimal experience directly from the home screen. However, these manifests lacked dark mode support. This caused bright splash screens to flash when opening most light-themed websites, leading to eye strain.

To solve this, I explored ways to customize site manifests for a better and more comfortable experience. **w_pwa** is the result of that effort.

## What can we do with this page

- Edit web manifest and save/load
- Update the current page's web manifest directly.
- Generate a javascript code to override some page's manifest.

## Usage

### Preparation  
1. Navigate to the target page in **w_pwa**.  
2. Use the input fields in the middle of the page to modify elements of the web manifest.  
3. After making changes, move the focus out of the input field to see the updated manifest as raw JSON at the top of the page.  
4. Click the save button to store the updated manifest for later use.

### Option 1: Directly Overriding the Manifest

1. After editing the manifest, click **Copy to Code** to generate JavaScript code for applying the changes.  
   - Use the **w/ javascript:** button to include the `javascript:` protocol, making it easier to run from the address bar.  
2. Run the code on the target site using developer tools or by pasting it into the address bar.  
   - On Android, you cannot directly execute JavaScript in the address bar. Instead:  
     - Save the JavaScript as a bookmark and run it via the bookmark.  
     - Alternatively, in Chrome, tap the address bar and select **Open link in clipboard** to execute the script.  
3. For sites with CORS restrictions (e.g., blocking `blob:` manifests):  
   - Open a suitable resource from the same domain without CORS restrictions, then run the code.  
   - Example:  
     - For `gemini.google.com/app`, use `gemini.google.com/abc`, which might return a 404 but allows blob-based manifest usage.  
     - For `x.com`, navigate to `x.com/favicon.ico` and run the script there.

### Option 2: Indirect Addition via **j.html**

1. Use [lumiknit.github.com/apps/pwa/j.html](https://lumiknit.github.com/apps/pwa/j.html), a simple redirect page that accepts query parameters.  
2. After modifying the manifest, click **Update Manifest** to replace the manifest of the open **w_pwa** page with your edited version.  
3. Once updated, click **Add to Home Screen** to install the web app.  
   - Note: Icons specified in the manifest may fail to load due to CORS issues, which can prevent successful addition.

