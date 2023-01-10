const
defaultConfig = {
    idElement: null,
    urlConfiguration: [],
    beforeUpdateContent(content) {
        return content
    },
    afterUpdateContent : null
},
register = ()=> {
    try {
        plugins.forEach((plugin) => (config = plugin(config)))
        
        const $links = $context.querySelectorAll('a[data-flyght-link]'), { onClickListener, onErrorHandler : errorHandler = defaultErrorHandler } = config, linkClickListener = onClickListener? ((e) => {
            onClickListener(e)
            defaultLinkClickListener(e) 
        }) : defaultLinkClickListener
        if($links) $links.forEach(($el,key,$parent) => {
            $el.addEventListener('click', linkClickListener, false)
            config.urlConfiguration.push({ hash: $el.hash || (`#${$el.name || $el.href}`), url: $el.href, type: 'GET' })
        })
    } catch (e) {
        errorHandler(e)
    }
},
getContentElement = () => {
    let $el = $context.querySelector('*[data-flyght-content]') || $context.body || $context
    config.idElement = $el.id || ( $el.id = `flyghtContent${Math.random()*1000}`)
    
    return $el
},
fetchFetch = async (url, opts, callback) => {
    let response = await fetch(url, Object.assign({},{ method: 'GET', headers: {
        'Content-Type':'text/html',
        'Accept':'text/html'
    } }, opts))
    response = await (callback? callback(response) : response.text())
    if(!response) throw 'No response value returned'
    
    updateContent(response)
},hashListener = (e) => {
    try {
        let page = config.urlConfiguration.filter((page) => page.hash == window.location.hash || page.url == window.location.href)
        if(page.length < 1) return false
        
        let { url, beforeFetch } = page = page.shift()
        if(!url) throw "No URL provided!"
        else if((typeof beforeFetch === 'function') && (!(page = beforeFetch(page))) ) return false
        
        let { type, options, afterFetch } = page
        fetchFetch(url, { method: type, ...options }, afterFetch || false )
    } catch(e) {
        errorHandler(e)
    }
},
init = (cfg) => {
    try {
        config = Object.assign({},defaultConfig,cfg)
        $context = window.document
        element = config.idElement ? $context.getElementById(config.idElement) : getContentElement()
        window.addEventListener('hashchange',hashListener, false)
        let onload = window.onload 
        window.onload = (e) => { hashListener(e); onload(e) }
    } catch (e) {
        errorHandler(e)
    }
    register()
}, updateContent = (content) => {
    try {
        let { beforeUpdateContent, afterUpdateContent } = config
        if((typeof beforeUpdateContent == 'function') && !(content = beforeUpdateContent(content))) return false
        
        element.innerHTML = content
        if(typeof afterUpdateContent == 'function') afterUpdateContent(element)
    } catch(e) { 
        errorHandler(e)
    }
}, registerPlugin = (plugin) => {
    plugins.push((cfg) => plugin(cfg))
}, defaultLinkClickListener = (e) => {
    e.stopPropagation()
    e.preventDefault()
    window.location.hash = e.target.hash || `#${e.target.name}` || `#${e.target.href}`
}, defaultErrorHandler = (e) => {
    console.error(e)
}

let config = {}, element = null, $context = null, plugins = [], errorHandler

export default {
    init,
    config: () => {
        return config
    }, 
    element: () => {
        return element
    },
    registerPlugin
}