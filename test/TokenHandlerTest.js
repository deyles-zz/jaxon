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

exports['test StringChunk'] = function(beforeExit, assert) { 
    var chunk = jaxon.factoryChunk(2);
    assert.equal(2, chunk.getType());
    assert.equal(0, chunk.buffer.length);
    assert.equal('', chunk.toString());
    chunk.append('a');
    assert.equal(1, chunk.buffer.length);
    assert.equal('a', chunk.toString());
    chunk.append('b');
    assert.equal(2, chunk.buffer.length);
    assert.equal('ab', chunk.toString());
    chunk.append('c');
    assert.equal(3, chunk.buffer.length);
    assert.equal('abc', chunk.toString());    
};

exports['test IntegerChunk'] = function(beforeExit, assert) { 
    var chunk = jaxon.factoryChunk(4);
    assert.equal(4, chunk.getType());
    chunk.append(2);
    chunk.append(0);
    chunk.append(0);
    assert.equal(200, chunk.getValue());
};

exports['test LongNumberChunk'] = function(beforeExit, assert) { 
    var chunk = jaxon.factoryChunk(4);
    assert.equal(4, chunk.getType());
    chunk.append(2);
    chunk.append(0);
    chunk.append('.');
    chunk.append(3);
    chunk.append(1);
    assert.equal(20.31, chunk.getValue());
};

exports['test ScientificNotationChunk'] = function(beforeExit, assert) { 
    var chunk = jaxon.factoryChunk(4);
    assert.equal(4, chunk.getType());
    chunk.append(1);
    chunk.append('e');
    chunk.append(3);
    assert.equal(1000, chunk.getValue());
    
    chunk = jaxon.factoryChunk(4);
    [1, '.', 5, 1, 'e', '-', 6].forEach(function(c) {
        chunk.append(c);
    });
    assert.equal(0.00000151, chunk.getValue());
};

exports['test BooleanChunk'] = function(beforeExit, assert) {
    var chunk = jaxon.factoryChunk(5);
    ['t', 'r', 'u', 'e'].forEach(function(c) {
        chunk.append(c);
    });
    assert.equal(true, chunk.getValue());
    
    chunk = jaxon.factoryChunk(5);
    ['f', 'a', 'l', 's', 'e'].forEach(function(c) {
        chunk.append(c);
    });
    assert.equal(false, chunk.getValue());
    
    var exception = false;
    try {
        chunk = jaxon.factoryChunk(6);
        ['b', 'a', 'r'].forEach(function(c) {
            chunk.append(c);
        });
        chunk.getValue();
    } catch (e) {
        exception = true;
    }
    assert.equal(true, exception);    
};

exports['test NullChunk'] = function(beforeExit, assert) {
    var chunk = jaxon.factoryChunk(6);
    ['n', 'u', 'l', 'l'].forEach(function(c) {
        chunk.append(c);
    });
    assert.isNull(chunk.getValue());
    
    var exception = false;
    try {
        chunk = jaxon.factoryChunk(6);
        ['f', 'a', 'l', 's', 'e'].forEach(function(c) {
            chunk.append(c);
        });
        chunk.getValue();
    } catch (e) {
        exception = true;
    }
    assert.equal(true, exception);
};

exports['test TokenHandler'] = function(beforeExit, assert) {   
    var parser = jaxon.factoryStreamParser();
    var handler = jaxon.factoryTokenHandler(parser);
    parser.onParse('bar', function(o) {
        assert.equal(5, o.length);
        assert.equal(true, (Object.prototype.toString.call(o) === '[object Array]'));
        for (var i=1; i <= 5; i++) {
            assert.equal(i, o[i-1]);
        }
    });
    parser.onParse('foo2', function(o) {
        assert.equal('bar2', o);
    });
    parser.onFind('symbol', function(o) {
        assert.equal('symbol', o.key);
    });    
    parser.onError(function(e) {
        assert.equal('badly formed object', e.message);
    });
    parser.onMatch(/^(foo|bar)$/, function(o) {
        assert.equal('bar', o.key);
        assert.equal(true, (Object.prototype.toString.call(o.value) === '[object Array]'));
    });
    parser.consume('{"symbol":"YHOO", "foo2":"bar2", "bar":[1, 2, 3, 4, 5], "blah":[1, 2, 3}');
};

exports['test TokenHandlerExtras'] = function(beforeExit, assert) {   
    var parser = jaxon.factoryStreamParser();
    var handler = jaxon.factoryTokenHandler(parser);
    assert.equal(parser, handler.parser);
    assert.equal(false, handler.determineClass(null));
    assert.equal(1, handler.determineClass([]));
    assert.equal(0, handler.determineClass({}));
    assert.equal(2, handler.determineClass('test'));
    assert.equal(false, handler.determineType(null));
    assert.equal(4, handler.determineType('2'));
    assert.equal(4, handler.determineType('.'));
    assert.equal(4, handler.determineType('-'));
    assert.equal(5, handler.determineType('t'));
    assert.equal(5, handler.determineType('f'));
    assert.equal(6, handler.determineType('n'));
};