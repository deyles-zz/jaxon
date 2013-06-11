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

exports['test Stream'] = function(beforeExit, assert) {   
    var stream = jaxon.factoryStream();
    assert.equal(0, stream.length());
    stream.writeChar('{');
    assert.equal(1, stream.length());
    stream.writeString('"foo":"bar"}');
    assert.equal(13, stream.length());
    stream.flush(function(err, data) {
        assert.equal(0, stream.length());
        assert.equal(13, data.length);
        assert.equal(true, (err == null));
    });
    stream.flush(function(err, data) {
        assert.equal(null, data);
        assert.equal(true, (err != null));
    });
    stream.writeArray(['{', '"', 'f', '"', ':', '"', 'b', '"', '}']);
    assert.equal(9, stream.length());
    stream.toString(function(err, data) {
        assert.equal('{"f":"b"}', data);
        assert.equal(null, err);
    });
    stream.read(function(err, data) {
        assert.equal('{', data);
        assert.equal(null, err);
        assert.equal(8, stream.length());
    });
};

exports['test StreamWriteCharEvent'] = function(beforeExit, assert) { 
    var stream = jaxon.factoryStream();
    stream.on('write', function(event) {
        assert.equal('a', event.body);
    });
    stream.writeChar('a');
};

exports['test StreamWriteStringEvent'] = function(beforeExit, assert) { 
    var stream = jaxon.factoryStream();
    stream.on('write', function(event) {
        assert.equal(JSON.stringify(['a', 'b', 'c']), JSON.stringify(event.body));
    });
    stream.writeString('abc');
};

exports['test StreamWriteArrayEvent'] = function(beforeExit, assert) { 
    var stream = jaxon.factoryStream();
    stream.on('write', function(event) {
        assert.equal(JSON.stringify(['a', 'b', 'c']), JSON.stringify(event.body));
    });
    stream.writeArray(['a', 'b', 'c']);
};

exports['test StreamWriteFlushEvent'] = function(beforeExit, assert) { 
    var stream = jaxon.factoryStream();
    stream.on('flush', function(event) {
        assert.equal(JSON.stringify(['a', 'b', 'c']), JSON.stringify(event.body));
    });
    stream.writeArray(['a', 'b', 'c']);
    stream.flush();
};