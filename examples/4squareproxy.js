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

/**
 * A simple HTTP proxy server that retrieves a list of trending venues from foursquare
 * near a given set of co-ordinates, parses the response, pulls out some information
 * and returns a JSON encoded summary.
 * @author deyles
 */

var http  = require('http');
var jaxon = require('../lib/jaxon');

var CLIENT_ID = 'your foursquare client id';
var CLIENT_SC = 'your foursquare client secret';
var VERSION   = '20130615';
var BASE      = 'https://api.foursquare.com/v2/venues/trending?ll=40.7,-74&client_id={id}&client_secret={secret}&v={ver}';

http.createServer(function(request, response) {
    var data = [];
    var stack = jaxon.factoryStack();
    var url = BASE.replace('{id}', CLIENT_ID).replace('{secret}', CLIENT_SC).replace('{ver}', VERSION);           
    jaxon.factory()
    .on('match', /(name|phone|twitter|location|canonicalUrl)/, function(err, chunk) {
        if (stack.empty()) {
            stack.push({});
        }
        var o = stack.peek();
        o[chunk.key] = chunk.value;
    })
    .on('parse', 'url', function(err, url) {
        stack.peek().url = url;
        data.push(stack.pop());
    })
    .on('complete', function(err, scope) {
        response.writeHead(200, {'Content-Type': 'application/json'});
        response.write(JSON.stringify({
            'type':'success', 
            'data':data
        }));
        response.end();
    })
    .parse(url, {}, function(err) {
        response.writeHead(500, {'Content-Type': 'application/json'});
        response.write(JSON.stringify({
            'type':'error', 
            'data':err
        }));
        response.end();
    });
}).listen(9999);