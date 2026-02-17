export default defineNuxtPlugin((nuxtApp) => {
    const triggerTypeset = () => {
        if (process.client && window.MathJax && window.MathJax.typesetPromise) {
            window.MathJax.typesetPromise().catch(err => console.log('MathJax error:', err))
        }
    }

    const renderMath = () => {
        if (!process.client) return

        // Initial trigger
        triggerTypeset()

        // Watch for DOM changes (for Nuxt Content hydration)
        const observer = new MutationObserver((mutations) => {
            triggerTypeset()
        })

        const target = document.querySelector('main') || document.body
        observer.observe(target, { childList: true, subtree: true })
    }

    // App mounted
    nuxtApp.hook('app:mounted', renderMath)

    // After each page navigation
    nuxtApp.hook('page:finish', triggerTypeset)
})
