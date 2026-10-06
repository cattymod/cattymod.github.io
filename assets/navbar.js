(function () {
    "use strict";

    function createNavbar() {
        // Prevent the navbar from being injected twice
        if (document.querySelector(".cattymod-navbar-wrapper")) {
            return;
        }

        // Inject CSS
        const styleEl = document.createElement("style");
        styleEl.textContent = `
            .cattymod-navbar-wrapper,
            .cattymod-navbar-wrapper *,
            .cattymod-navbar-wrapper *::before,
            .cattymod-navbar-wrapper *::after {
                box-sizing: border-box;
            }

            .cattymod-navbar-wrapper {
                --background: 200 20% 12%;
                --foreground: 0 0% 100%;
                --radius: .5rem;

                width: 100%;
                background-color: hsl(var(--background));
                color: hsl(var(--foreground));
                font-family: ui-sans-serif, system-ui, sans-serif,
                    "Apple Color Emoji", "Segoe UI Emoji", Segoe UI Symbol,
                    "Noto Color Emoji";
                line-height: 1.5;
            }

            .cattymod-navbar-wrapper a {
                color: inherit;
                text-decoration: none;
            }

            .cattymod-navbar-wrapper nav {
                display: flex;
                align-items: center;
                gap: 1rem;
                padding: .5rem 1rem;
            }

            .cattymod-navbar-wrapper .cattymod-nav-link {
                display: flex;
                align-items: center;
                gap: .5rem;
                border-radius: calc(var(--radius) - 2px);
                padding: .375rem .75rem;
                color: #fff;
                font-size: .875rem;
                font-weight: 600;
                transition:
                    color 150ms cubic-bezier(.4, 0, .2, 1),
                    background-color 150ms cubic-bezier(.4, 0, .2, 1);
            }

            .cattymod-navbar-wrapper .cattymod-nav-link:hover {
                background-color: rgb(255 255 255 / 0.1);
            }

            .cattymod-navbar-wrapper .cattymod-logo {
                width: 2.5rem;
                height: 2.5rem;
                border-radius: .25rem;
            }

            .cattymod-navbar-wrapper .cattymod-icon {
                width: 1rem;
                height: 1rem;
            }

            .cattymod-navbar-wrapper .cattymod-right {
                display: flex;
                gap: 1rem;
                margin-left: auto;
            }

            .cattymod-external-notice {
                width: 100%;
                padding: 10px 16px;
                box-sizing: border-box;
                background: #fff3cd;
                color: #664d03;
                border-bottom: 1px solid #ffecb5;
                font-family: ui-sans-serif, system-ui, sans-serif;
                font-size: 14px;
                line-height: 1.5;
                text-align: center;
            }

            .cattymod-external-notice a {
                color: inherit;
                font-weight: 700;
                text-decoration: underline;
            }

            @media (max-width: 459px) {
                .cattymod-navbar-wrapper .cattymod-nav-link span {
                    display: none;
                }

                .cattymod-navbar-wrapper .cattymod-icon {
                    width: 24px;
                    height: 24px;
                }
            }
        `;

        document.head.appendChild(styleEl);

        // Current page URL
        const currentUrlEncoded = encodeURIComponent(window.location.href);

        const settingsUrl =
            "https://studio.cattymod.app/settings?from=" +
            currentUrlEncoded;

        // Create navbar
        const wrapperDiv = document.createElement("div");
        wrapperDiv.className = "cattymod-navbar-wrapper";

        wrapperDiv.innerHTML = `
            <nav>

                <a
                    href="https://cattymod.app"
                    class="cattymod-nav-link"
                    aria-label="CattyMod home"
                >
                    <img
                        src="https://cattymod.app/assets/cattymod.svg"
                        alt="CattyMod"
                        class="cattymod-logo"
                    >
                </a>

                <a
                    href="https://studio.cattymod.app/editor"
                    class="cattymod-nav-link"
                >
                    <i data-lucide="plus-circle" class="cattymod-icon"></i>
                    <span>Create</span>
                </a>

                <a
                    href="https://cattymod.app/explore/"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="cattymod-nav-link"
                >
                    <i data-lucide="compass" class="cattymod-icon"></i>
                    <span>Explore</span>
                </a>

                <div class="cattymod-right">

                    <a
                        href="https://cattymod.app/commits"
                        class="cattymod-nav-link"
                        onclick="window.open(
                            this.href,
                            'commitsWindow',
                            'width=1000,height=700,resizable=yes,scrollbars=yes'
                        ); return false;"
                    >
                        <i
                            data-lucide="circle-fading-arrow-up"
                            class="cattymod-icon"
                        ></i>
                        <span>Commits</span>
                    </a>

                    <a
                        href="${settingsUrl}"
                        class="cattymod-nav-link"
                    >
                        <i
                            data-lucide="settings"
                            class="cattymod-icon"
                        ></i>
                        <span>Settings</span>
                    </a>

                </div>

            </nav>
        `;

        // Put navbar at the absolute beginning of <body>
        document.body.insertBefore(
            wrapperDiv,
            document.body.firstChild
        );

        /*
         * IMPORTANT:
         *
         * cattymod.app
         * www.cattymod.app
         * studio.cattymod.app
         * anything.cattymod.app
         *
         * are all considered official CattyMod domains.
         */
        const hostname = window.location.hostname.toLowerCase();

        const isCattyModDomain =
            hostname === "cattymod.app" ||
            hostname.endsWith(".cattymod.app");

        // Show the warning on every non-CattyMod website
        if (!isCattyModDomain) {
            const noticeDiv = document.createElement("div");
            noticeDiv.className = "cattymod-external-notice";

            noticeDiv.innerHTML = `
                This page is not officially by CattyMod.
                <a
                    href="https://cattymod.app"
                    target="_blank"
                    rel="noopener noreferrer"
                >Go to cattymod.app</a>
                to get a private and powerful Scratch mod.
            `;

            // Immediately below the navbar
            wrapperDiv.insertAdjacentElement(
                "afterend",
                noticeDiv
            );
        }

        // Load Lucide if necessary
        function renderIcons() {
            if (window.lucide) {
                window.lucide.createIcons();
            }
        }

        if (window.lucide) {
            renderIcons();
        } else if (!document.querySelector('script[src*="lucide"]')) {
            const lucideScript = document.createElement("script");

            lucideScript.src =
                "https://unpkg.com/lucide@latest";

            lucideScript.onload = renderIcons;

            document.head.appendChild(lucideScript);
        }
    }

    /*
     * navbar.js is loaded with "defer", but this also makes the
     * script safe if somebody loads it normally or from another
     * environment.
     */
    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            createNavbar,
            { once: true }
        );
    } else {
        createNavbar();
    }
})();
