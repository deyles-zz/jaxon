/**
 * Copyright (c) 2013, Dan Eyles (dan@irlgaming.com)
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of IRL Gaming nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL IRL Gaming BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

var jaxon = require('../lib/jaxon');

exports['test Jaxon1'] = function(beforeExit, assert) {   
    var j = jaxon.factoryJaxon();
    j.on('parse', 'onMouseUp', function(err, o) {
        assert.equal('sun1.opacity = (sun1.opacity / 100) * 90;', o);
    });
    j.on('parse', 'vOffset', function(err, o) {
        assert.equal(true, (o === 100 || o === 250));
    });    
    j.on('match', /[oO]ffset$/, function(err, o) {
        assert.equal(true, (o.value === 100 || o.value === 250));
    });
    var o = j.parse('file://./data/test1.json', null, function(err) {
        console.log(err);
    });
};

exports['test Jaxon2'] = function(beforeExit, assert) {   
    var j = jaxon.factoryJaxon();
    j.on('match', /^(.*)Pages(.*)$/, function(err, o) {
        switch(o.key) {
            case 'cachePagesTrack':
                assert.equal(200, o.value);
                break;
                
            case 'cachePagesStore':
                assert.equal(100, o.value);
                break;
                
            case 'cachePagesRefresh':
                assert.equal(10, o.value);
                break;
                
            case 'cachePagesDirtyRead':
                assert.equal(10, o.value);
                break;
        }
    });
    var o = j.parse('file://./data/test2.json', {}, function(err) {
        console.log(err);
    });
};

exports['test Jaxon3'] = function(beforeExit, assert) {   
    var j = jaxon.factoryJaxon();
    j.on('parse', 'guid', function(err, o) {
        console.log(o.split(/\-/));
    });
    j.on('match', /^(phone|email)$/, function(err, o) {
        switch (o.key) {
            case 'phone':
                console.log(o.value.split(/\-/));
                break;
                
            case 'email':
                console.log(o.value.split(/\@/));
                break;
        }
    });
    j.parse('http://f0e43e0449ff85b5a83a-8d88610b03123726d01e576fafeaf9d4.r60.cf2.rackcdn.com/test3.json', {}, function(err) {
        console.log(err);
    });
};