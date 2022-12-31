import { describe, it } from 'mocha'
import { expect, assert, should } from 'chai'
import sinon from 'sinon'
import { JSDOM } from 'jsdom'
import Flyght from './src/index.js'
const defaultConfig = { foo: "bar", hasPageList: [], idElement: "flyghtContent", urlConfiguration: null },
    document = new JSDOM('<html><body><div id="flyghtContent"></div><a href="/test.html" name="test" data-flyght></a><a href="/test2.html" name="test2" data-flyght></a></body></html>')
global.document = document
global.window =document.window
global.location = window.location
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
    })
})

describe('Flyght functions', ()=>{
    afterEach(()=> sinon.restore())

    it('should fire hashListener method', () =>{
        let flyght = new Flyght(defaultConfig)
        sinon.mock(flyght).expects('hashListener').atLeast(2)
        window.onload()
        location.hash = 'too'
    })
})