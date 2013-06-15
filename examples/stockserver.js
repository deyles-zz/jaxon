var net = require('net');

var clients = [];
var tickers = ['YHOO', 'GOOG', 'FB', 'APPL', 'MSFT', 'GRPN'];

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
 * A little TCP socket server that broadcasts a badly formed stream of JSON encoded
 * objects to all connected clients. The stream look like the following:
 * 
 * ,{"tick":{"symbol":"GOOG", "price":232}},{"tick":{"symbol":"YHOO", "price":90}}
 * 
 * Clients should connect to the server using 127.0.0.1:5000
 * 
 * Fire up the stockclient.js daemon after starting this server and watch Jaxon
 * parse the stream and pipe the parsed ticker data to STDOUT in the following format:
 * 
 * GOOG 232
 * YHOO 90
 */

function random(from, to) {
    return Math.floor(Math.random() * (to - from + 1) + from);
};

function emit(message) {
    clients.forEach(function(client) {
        client.write(message); 
    });
};

function emitprice() {
    var ticker = tickers[random(0, 5)];
    var price  = random(1, 1000);
    emit(',' + JSON.stringify({
        'tick':{
            'symbol':ticker, 
            'price':price
        }
    }));
};

function removeclient(client) {
    for(var i=0; i < clients.length; i++) {
        if (clients[i] == client) {
            clients.splice(i, 1);
            break;
        }
    }    
};

net.createServer(function (socket) {
    clients.push(socket);
    socket.on('end', function() {
        removeclient(socket);
    });
}).listen(5000, function() {
    setInterval(function() {
        emitprice();
    }, 300);
});

console.log("Stock price server running at port 5000\n");