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

exports['test StackTest'] = function(beforeExit, assert) {   
    var stack = jaxon.factoryStack();
    assert.equal(true, (stack !== null));
    assert.equal(0, stack.length());
    assert.equal(true, stack.empty());
    stack.push('foo');
    assert.equal(1, stack.length());
    assert.equal(false, stack.empty());
    stack.push('bar');
    assert.equal(2, stack.length());
    assert.equal('bar', stack.peek());
    assert.equal('bar', stack.pop());
    assert.equal(1, stack.length());
    assert.equal('foo', stack.pop());
    assert.equal(0, stack.length());
    assert.equal(true, stack.empty());
    for (var i=0; i < 10; i++) {
        stack.push(i);
    }
    assert.equal(10, stack.length());
    stack.clear();
    assert.equal(0, stack.length());
    assert.equal(true, stack.empty());
};

exports['test HashMapTest'] = function(beforeExit, assert) { 
    var map = jaxon.factoryHashMap();
    assert.equal(true, (map !== null));
    assert.equal(0, map.length());
    map.set('foo', 'bar');
    assert.equal(1, map.length());
    assert.equal(true, map.contains('foo'));
    assert.equal(true, map.remove('foo'));
    assert.equal(false, map.remove('foo'));
    assert.equal(false, map.contains('foo'));
    assert.equal(0, map.length());
    map.set('foo', 'bar');
    map.set('foo2', 'bar2');
    assert.equal(2, map.length());
    assert.equal(true, map.contains('foo'));
    assert.equal(true, map.contains('foo2'));
    map.remove('foo2');
    assert.equal(false, map.contains('foo2'));
    assert.equal(1, map.length());
};