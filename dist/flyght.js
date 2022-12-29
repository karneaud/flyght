const $4fa36e821943b400$var$Flyght = class {
    #config;
    #defaultConfig = {};
    #hasPageList = null;
    #element = null;
    constructor(config){
        this.$ = document;
        this.init(config);
        window.addEventListener("hashchange", this.hashListener.bind(this), false);
        window.onload = this.hashListener.bind(this);
    }
    init(config) {
        this.#config = Object.merge({}, this.#defaultConfig, config);
        this.register();
    }
    register() {
        this.#element = this.$.getElementById(this.#config.idElement);
        let urlConfiguration = this.#config.urlConfiguration ?? {}, $links = this.$.querySelectorAll("a[data-flyght]");
        if ($links) $links.forEach(($el, key, $parent)=>{
            urlConfiguration[$el.name ?? $el.id] = {
                hash: $el.href,
                type: "GET"
            };
        });
    }
    hashListener() {
        for(let key in this.#hashPageList)if (window.location.hash === this.#hashPageList[key].hash) {
            let { url: url , method: method , beforeFetch: beforeFetch , options: options , afterFetch: afterFetch  } = this.#hasPageList[key];
            if (typeof beforeFetch == "Function" && !beforeFetch()) return false;
            let response = this.#fetchFetch(url, {
                method: method,
                ...options
            });
            response = typeof afterFetch == "Function" ? afterFetch(response) : response.text();
            this.updateContent(response);
            break;
        } else document.getElementById($4fa36e821943b400$var$Flyght.idElement).innerHTML = "";
    }
    updateContent(content) {
        this.$.getElementById(this.#config.idElement).innerHTML = content;
    }
};
var $4fa36e821943b400$export$2e2bcd8739ae039 = $4fa36e821943b400$var$Flyght;


//# sourceMappingURL=flyght.js.map
