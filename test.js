import { describe, it } from 'mocha'
import { expect, assert, should } from 'chai'
import sinon from 'sinon'
import { JSDOM } from 'jsdom'
import Flyght from './src/index.js'
const defaultConfig = { foo: "bar", idElement: "flyghtContent", urlConfiguration: null },
    doc = new JSDOM('<html><body><div id="flyghtContent"></div><a href="/test.html" name="test" data-flyght></a><a href="/test2.html" name="test2" data-flyght></a></body></html>')
global.window = doc.window
global.document = doc.window.document
global.location = doc.window.location
global.fetch = global.window.fetch = (url,options) => {}
should()
        
describe('Flyght class tests',() => {
    it('should exists',() => {
        Flyght.should.exist
        Flyght.should.be.a('function')
    })

    it('should instantiate class',() =>{
        expect(new Flyght({})).instanceOf(Flyght)
    })
})

describe("flyght methods and properties",()=>{
    it('should have a config',()=>{
        let config = null, flyght = new Flyght(defaultConfig)        
        assert.isNotNull(config = flyght.config)
        assert.property(config, 'foo')
        expect(config.urlConfiguration).to.have.lengthOf(2)
    })

    it('should have methods', () =>{
        let flyght = new Flyght(defaultConfig)
        assert.property(flyght,'init')
        assert.property(flyght,'register')
        expect(flyght).to.not.have.property('fetchFetch')
    })
})

describe('Test Flyght content', ()=> {
    before(() =>{
        fetch = () => 
            Promise.resolve(
                { text: () => Promise.resolve('<div class="test">Test</div>') }
            )
        let flyght = new Flyght(defaultConfig)
        window.document.querySelector('a[data-flyght]').click()
    })

    it('should load content', function(done){
        this.timeout(1000)
        setTimeout(() => {
            expect(window.document.querySelector('.test').textContent).equal('Test' )
            done()
        }, 300)
    })
})