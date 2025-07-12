import { Component } from "solid-js";

const Help: Component = () => {
	return (
		<div>
			<h1>Guide</h1>
			<p>
				This page is a utility to help you easily add any website as a PWA (Progressive Web App).<br />
				You can save and quickly apply multiple page settings.
			</p>

			<h2>How to Use</h2>

			<h3>Add as App via Redirect</h3>
			<ul>
				<li>This method allows you to add any page or icon as a PWA, but since a redirect occurs, Standalone and Fullscreen modes are not available.</li>
				<li>Fill in all settings such as App, Link, etc. in the Editor.</li>
				<li>Click 'Update manifest' to update the manifest of the current editor page.</li>
				<li>From this state, add the PWA (e.g., add the current page to the home screen) to add it as an app.</li>
			</ul>

			<h3>Overwrite Existing Website Manifest</h3>
			<ul>
				<li>This method allows you to modify the manifest of an existing website for a faster and better PWA experience, but due to CSP and other issues, some icon settings may not work.</li>
				<li>Fill in all settings such as App, Link, etc. in the Editor.</li>
				<li>Click the 'Copy code' button to copy JavaScript code that overwrites the page's manifest.</li>
				<li>Click the 'Open' button to go to the target page, or open the page in a separate tab, then run the JavaScript code.</li>
				<ul>
					<li>Usually, you can paste the copied code into the browser's address bar.</li>
					<li>On Android, running JavaScript is often blocked. You can:<br />
						(1) Add the script as a bookmark and run it,<br />
						(2) Use UserScript tools (the Userscript button in the List can help you create a script that runs automatically when you visit the page),<br />
						(3) Use developer tools like Eruda.
					</li>
				</ul>
				<li>When you run the script on the page, a message "Overrided!" will appear. You can then add the page to your home screen, etc.</li>
			</ul>

			<p><b>Note:</b></p>
			<ul>
				<li>Some pages have CSP (Content Security Policy) that prevents overwriting the manifest.<br />
					If so, try running the script on a resource URL like favicon.ico instead of the main address.<br />
					(e.g., run the script at <code>https://x.com/favicon.ico</code> instead of <code>https://x.com</code>)
				</li>
			</ul>

			<h3>List Management</h3>
			<ul>
				<li>When you Add/Update app settings, they are added to the list.</li>
				<li>Apps in the list can be edited or have code executed at any time.</li>
				<li>You can Import/Export the list for backup or transfer.</li>
			</ul>
		</div>
	)
};

export default Help;
