const Flyght = class {
    #config = {}
    #defaultConfig = {}
    #element = null
    constructor(config) {
        this.init(config)
        this.register()
    }

    init(config) {
        this.#config = Object.assign({},this.#defaultConfig,config)
        window.addEventListener("hashchange", this.hashListener.bind(this), false)
		window.onload = this.hashListener.bind(this)
    }

    register(){
        this.$ = window.document
        this.#element = this.$.getElementById(this.#config.idElement)
        this.#config.urlConfiguration = this.#config.urlConfiguration ?? [] 
        let $links = this.$.querySelectorAll('a[data-flyght]')
		if($links) $links.forEach(($el,key,$parent) =>{
            this.#config.urlConfiguration.push({ hash: $el.hash ?? $el.href, url: $el.href, type: 'GET' })
        })
    }

    get config() {
        return this.#config
    }

    async #fetchFetch(url, opts) {
        let response = null
        try {
            response = await fetch(url, Object.assign({},{ method: 'GET', headers: {
                'Content-Type':'text/html',
                'Accept':'text/html'
            } }, opts))

        } catch(e) {
            throw e
        }
        return response
    }

    hashListener() {
        try {
            let page = this.#config.urlConfiguration.filter((page) => page.hash == window.location.hash || page.url == window.location.href),
            { beforeFetch } = page
            if(!url || (typeof beforeFetch === 'function' && !(page = beforeFetch(page))) ) return false
            
            let { url, hash, method, options, afterFetch } = page,
            response  = this.#fetchFetch(url, { method, ...options })
            response = (typeof afterFetch === 'function') ? afterFetch(response) : response.text()
            if(!response) throw 'No text value returned'

            this.#updateContent(response)
        } catch(e) {
            if(this.#config.errorHandler) this.#config.errorHandler(e)
            else this.#errorHandler(e)
        }
    }

    #errorHandler(e) {
        console.error(e)
    }

    #updateContent(content) {
        this.#element.innerHTML = content
    }
}

export default Flyght