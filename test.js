import { describe, it } from 'mocha'
import { expect, assert, should } from 'chai'
import sinon from 'sinon'
import Flyght from './src/index.js'

should()

describe('Flyght class tests',() => {
    it('should exists',() => {
        Flyght.should.exist
        Flyght.should.be.a('function')
    })

    it('should instantiate class',() =>{
        sinon.replace(Flyght.prototype,'init',sinon.fake())
        sinon.replace(Flyght.prototype,'register',sinon.fake())
        expect(new Flyght({})).instanceOf(Flyght)
    })
})



