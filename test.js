import { describe, it } from 'mocha'
import { expect, assert, should } from 'chai'
import sinon from 'sinon'
import { JSDOM } from 'jsdom'
import Flyght from './src/index.js'
const defaultConfig = { foo: "bar", idElement: "#flyghtContent" },
    doc = new JSDOM('<html><body><div id="flyghtContent" data-flyght-content></div><a href="/test.html" name="test" data-flyght-link></a><a href="/test2.html" name="test2" data-flyght-link></a></body></html>')
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
        assert.property(Flyght,'errorHandler')
        assert.property(Flyght, 'init')
        assert.property(Flyght,'config')
    })

    it('should have config',()=>{
        Flyght.init(defaultConfig)
        let config = Flyght.config()
        config.should.be.a('object')
        expect(config).to.have.property('idElement')
        expect(config).to.have.property('urlConfiguration')
    })
})

describe('Test Flyght content', ()=> {
    fetch = sinon.fake.resolves(Promise.resolve(
                { text: () => Promise.resolve('<div class="test">Test</div>') }
            ))

    it('should load content', function(done){
        Flyght.init(defaultConfig)
        window.document.querySelector('a[data-flyght-link]').click()
        this.timeout(1000)
        setTimeout(() => {
            expect(window.document.querySelector('.test').textContent).equal('Test' )
            done()
        },300)
    })

    it('should call hooks',function(done){
        let afterFetch = sinon.fake.resolves('<div class="test2">After Fetch</div>'), 
            afterUpdateContent = sinon.fake(),
            beforeFetch = sinon.fake((page) => Object.assign({}, page,{ type: "PATCH", options: { cors: "foo" } } ) )    
        
        Flyght.init(Object.assign({}, defaultConfig,{ urlConfiguration:[
                {
                    beforeFetch,
                    afterFetch,
                    url: "/dummy.html",
                    hash: "#dummy"
                }
        ], afterUpdateContent}))
        window.location.hash = '#dummy'
        this.timeout(1000)
        setTimeout(() => {
            assert.isTrue(beforeFetch.called)
            assert.isTrue(afterFetch.called)
            assert.isTrue(afterUpdateContent.called)
            expect(window.document.querySelector('#flyghtContent').textContent).equal('After Fetch' )
            done()
        }, 500)
    })

})