export default defineNuxtPlugin((nuxtApp) => {
    const normalizeMath = (el: HTMLElement) => {
        // Iterate through all potential formula text nodes or elements
        // Note: MathJax v4 is quite smart, but sometimes MDC eats one \
        // We target text that looks like LaTeX environments
        const content = el.innerHTML

        // If we find single \ that should be \\ (this is tricky to do globally without breaking things)
        // A safer way is to specifically target common environments
        const normalized = content.replace(/\\\\/g, '\\\\\\\\') // If we see \\, make it \\\\ for MathJax v4 if it's being eaten

        // But since the user wants to write \\ and have it work,
        // we should check if they are arriving as single \ in the HTML
        // Let's use a more robust approach: MathJax v4 recommends using \cr if \\ is eaten by Markdown
    }

    const triggerTypeset = () => {
        if (process.client && window.MathJax && window.MathJax.typesetPromise) {
            window.MathJax.typesetPromise().catch(err => console.log('MathJax error:', err))
        }
    }

    const renderMath = () => {
        if (!process.client) return

        // Watch for DOM changes (for Nuxt Content hydration)
        const observer = new MutationObserver(() => {
            // Delay slightly to let the browser finish painting the raw text
            setTimeout(triggerTypeset, 100)
        })

        const target = document.querySelector('main') || document.body
        observer.observe(target, { childList: true, subtree: true })

        // Initial trigger
        setTimeout(triggerTypeset, 500)
    }

    // App mounted
    nuxtApp.hook('app:mounted', renderMath)

    // After each page navigation
    nuxtApp.hook('page:finish', triggerTypeset)
})
