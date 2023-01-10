import { describe, it } from 'mocha'
import { expect, assert, should } from 'chai'
import sinon from 'sinon'
import { JSDOM } from 'jsdom'
import Flyght from './src/index.js'
const defaultConfig = { idElement: "flyghtContent" },
    doc = new JSDOM('<html><body><div id="flyghtContent" data-flyght-content></div><a href="/test.html" name="test" data-flyght-link></a><a href="/test2.html" name="test2" data-flyght-link></a></body></html>'),
    plugin = sinon.fake((config) => {
        let updateContent = null
        if(config.beforeUpdateContent) updateContent = config.beforeUpdateContent
        
        const f = (content) => {
            content = updateContent? updateContent(content) : content
            return content + '<p>Test Plugin</p>'
        }
        
        config = Object.assign({},{"foo":"bar"},config,{ beforeUpdateContent: f })
        
        return config
    })
global.window = doc.window
global.document = doc.window.document
global.location = doc.window.location
global.fetch = global.window.fetch = (url,options) => {}
should()
        
describe('Flyght class tests',() => {
    it('should exists',() => {
        Flyght.should.exist
        Flyght.should.be.a('object')
    })
})

describe("flyght methods and properties",()=>{
    it('should have methods', () =>{
        assert.property(Flyght, 'init')
        assert.property(Flyght,'config')
        assert.property(Flyght,'element')
        assert.property(Flyght,'registerPlugin')
    })

    it('should have config',()=>{
        Flyght.registerPlugin(plugin)
        Flyght.init(defaultConfig)
        let config = Flyght.config()
        config.should.be.a('object')
        expect(config).to.have.property('foo')
        expect(config).to.have.property('idElement')
        expect(config).to.have.property('urlConfiguration')
    })
})

describe('Test Flyght content', ()=> {
    fetch = sinon.fake.resolves(Promise.resolve(
                { text: () => Promise.resolve('<div class="test">Test</div>') }
            ))

    it('should load content', function(done){
        let onClickListener = sinon.fake()
        Flyght.registerPlugin(plugin)
        Flyght.init(Object.assign({},defaultConfig,{onClickListener}))
        window.document.querySelector('a[data-flyght-link]').click()
        this.timeout(1000)
        setTimeout(() => {
            assert.isTrue(onClickListener.called)
            expect(window.document.querySelector('.test').textContent).equal('Test' )
            done()
        },300)
    })

    it('should call hooks',function(done){
        let afterFetch = sinon.fake.resolves('<div class="test2">After Fetch</div>'), 
            afterUpdateContent = sinon.fake(),
            beforeFetch = sinon.fake((page) => Object.assign({}, page,{ type: "PATCH", options: { cors: "foo" } } ) )    
        Flyght.registerPlugin(plugin)
        Flyght.init(Object.assign({}, defaultConfig,{ urlConfiguration:[
                {
                    beforeFetch,
                    afterFetch,
                    url: "/dummy.html",
                    hash: "#dummy"
                }
        ], afterUpdateContent }))
        window.location.hash = '#dummy'
        this.timeout(1000)
        setTimeout(() => {
            assert.isTrue(plugin.called)
            assert.isTrue(beforeFetch.called)
            assert.isTrue(afterFetch.called)
            assert.isTrue(afterUpdateContent.called)
            expect(window.document.querySelector('.test2').textContent).equal('After Fetch' )
            expect(window.document.querySelector('p').textContent).equal('Test Plugin' )
            done()
        }, 500)
    })

})