const Flyght = class {
    #config = {}
    #defaultConfig = {
        idElement: null,
        urlConfiguration: [],
        beforeUpdateContent(content) {
            return content
        },
        afterUpdateContent : null
    }
    #element = null
    constructor(config) {
        this.#init(config)
        this.#register()
    }

    #init(config) {
        let func = this.#hashListener.bind(this)
        
        try {
            this.#config = Object.assign({},this.#defaultConfig,config)
            this.$ = window.document
            this.#element = this.#config.idElement ? this.$.querySelector(this.#config.idElement) : this.#getContentElement()
            window.addEventListener('hashchange',func, false)
            window.onload = func
        } catch (e) {
            this.errorHandler(e)
        }
    }

    #register(){
        try {
            let $links = this.$.querySelectorAll('a[data-flyght-link]')
            if($links) $links.forEach(($el,key,$parent) => {
                $el.addEventListener('click', this.linkClickListener, false)
                this.#config.urlConfiguration.push({ hash: $el.hash || (`#${$el.name || $el.href}`), url: $el.href, type: 'GET' })
            })
        } catch (e) {
            this.errorHandler(e)
        }
    }

    #getContentElement(){
        let $el = this.$.querySelector('*[data-flyght-content]') ?? document.body
        this.#config.idElement = $el.id || ( $el.id = `flyghtContent${Math.random()*1000}`)
        return $el
    }

    linkClickListener(e) {
        e.stopPropagation()
        e.preventDefault()
        window.location.hash = e.target.hash || `#${e.target.name}` || `#${e.target.href}`
    }

    get config() {
        return this.#config
    }

    get element() {
        return this.#element
    }

    async #fetchFetch(url, opts, callback ) {
        let response = await fetch(url, Object.assign({},{ method: 'GET', headers: {
            'Content-Type':'text/html',
            'Accept':'text/html'
        } }, opts))
        response = await (callback? callback(response) : response.text())
        if(!response) throw 'No response value returned'
        
        this.#updateContent(response)
    }

    #hashListener() {
        try {
            let page = this.config.urlConfiguration.filter((page) => page.hash == window.location.hash || page.url == window.location.href)
            if(page.length < 1) return false
            
            let { url, beforeFetch } = page = page.shift()
            if(!url) throw "No URL provided!"
            else if((typeof beforeFetch === 'function') && (!(page = beforeFetch(page))) ) return false
            
            let { type, options, afterFetch } = page
            this.#fetchFetch(url, { method: type, ...options }, afterFetch || false )
        } catch(e) {
            this.errorHandler(e)
        }
    }

    errorHandler(e) {
        console.error(e)
    }

    #updateContent(content) {
        try {
            let { beforeUpdateContent, afterUpdateContent } = this.config
            if((typeof beforeUpdateContent == 'function') && !(content = beforeUpdateContent(content))) return false
                
            this.element.innerHTML = content
            if(typeof afterUpdateContent == 'function') afterUpdateContent(this.element)
        } catch(e) {this.errorHandler(e)}
    }
}

export default Flyght