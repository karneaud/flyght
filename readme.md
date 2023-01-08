![Flyght](https://github.com/aj1thkr1sh/flyght/blob/main/flyght.png?raw=true)

# Flyght
Hi, library for making Single Page Application (SPA) in Vanilla JavaScript library

Flyght works based on ```window.loction.hash``` whenever the hash changes, the configured URL will be triggered and page will be loaded

One can easily make Single Page Application using the Flyght

Simple, yet powerful

Note : Single Page Application might affect SEO, choose appropriate case to use

## Usage
```
<script type="text/javascript" src="https://unpkg.com/flyght"></script>
```

## Configuration

You need to init the Flyght with required parameter, then your webpage will turn into SPA, like the Flyght way

```
Flyght.init({
  idElement : "idElement",
  urlConfiguration : [ {
    hash : "#about",
    url : "/about.html",
    type : "GET",
    options: { [headers, cors,]...},
    beforeFetch = function(hashPage){ return hashPage || false },
    afterFetch = function(response) { return  new Promise() || false }
  }],
  beforeUpdateContent: function(content){ return content || false },
  afterUpdateContent: function(element) {}
});
```

**OPTIONALLY**

With no config values passed instance will look for custom `*[data-flyght-content]` for content container and `a[data-flyght-link]` for configuring basic **hash page list** ( hash, url, type = GET ). Content container and links should have atleast id/name/href respectively. 

Simple right?

Yes, Simple yet powerful!

### Configuration Parameters

1. idElement : Is the CSS Selector of the DOM Element, where the loaded page is rendered
2. urlConfiguration : Is the Array of Object that has, url, hash, and request type
      1. hash : Required *hash* we provided
      2. url : Required given *URL* will be called and response will be attached to the idElement content
      3. type : The **request type** for the URL to be used( defaults to 'GET')
      4. options : Optional object of parameters for **Fetch API** options
      5. beforeFetch : Optional function that takes **urlConfiguration item** and **MUST return** the **item** or **false**. If the returned value is false then process exits.
      5. afterFetch : Optional function that takes **response promise** from **Fetch** and **MUST return** a **Promise** or **false**. If the returned value is false then the process exits.
3. beforeUpdateContent : Optional function that takes *raw response* content and **MUST return** the **content text/html** or **false**. If returned value is false then the process exits.
4. afterUpdateContent : Optional function that takes container *element* where loaded page is rendered for further processing

## Change Log

[2.0.0] 

#### Changed

- Complete rewrite as an ES6 module
- *idElement* should now be a CSSSelector for **querySelector**
- Uses **FETCH API** instead of **XMLHttpRequest** so there is no more **configureXHR**
- **requestHeaders** is no longer used and you should use *urlConfiguration's options* property to modify Request options

#### Added

- Added hooks *beforeFetch*, *afterFetch*, *beforeUpdateContent*, *afterUpdateContent* 
- Added auto setup implementations for basic functioning using `[data-flyght-content]` and `[data-flyght-link]` 
- Added linkClickListener to help
- Added tests using MochaJS, Chai and SinonJS

### Road Map

- Figure out how to implement plugin system
- Consider using class instance approach for multiple use scenarios

[:star: on GitHub](https://github.com/aj1thkr1sh/flyght) if you love
[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/karneaud/flyght)