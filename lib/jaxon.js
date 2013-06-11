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

"use strict";

var fs    = null;
var http  = null;
var https = null;
var url   = null;

module.exports = {
    classes: {},
    objects: {},
    constants: {
        // delimiting tokens
        __OBJ_OPEN:'{',
        __OBJ_CLOSE:'}',
        __OBJ_DELIM:':',
        __ARR_OPEN:'[',
        __ARR_CLOSE:']',
        __STR_DELIM:'"',
        __ELEM_DELIM:',',
        __STR_ESCAPE:'\\',
        __CHAR_NEWLINE:'\n',
        __CHAR_SPACE:' ',
        __CHAR_TAB:'\t',
        // types
        __TYPE_OBJECT: 0,
        __TYPE_ARRAY: 1,
        __TYPE_STRING: 2,
        __TYPE_NUMBER: 4,
        __TYPE_BOOLEAN: 5,
        __TYPE_NULL: 6,
        __TYPE_HEX: 7
    }
};
var __c = module.exports.constants;

/**
 * A simple stack to support JSON parsing
 * @class {Stack}
 * @return {Void}
 */
module.exports.classes.Stack = function() {
    
    /**
     * @type Array
     */
    this.stack = [];
    
    /**
     * Returns the element at the top of the stack without modify the data structure
     * @return {Mixed|null}
     */
    this.peek = function() {
        if (this.length() == 0) {
            return null;
        }
        return this.stack[this.stack.length - 1];
    };
    
    /**
     * Pushes an element on to the stack
     * @param {Mixed} element the element to push on to the stack
     * @return {Void}
     */
    this.push = function(element) {
        this.stack.push(element);
    };
    
    /**
     * Pops an element off the stack, returning NULL if the stack is empty
     * @return {Mixed|null}
     */
    this.pop = function() {
        if (this.length() == 0) {
            return null;
        }
        return this.stack.pop();
    };
    
    /**
     * Returns the number of elements in the stack as an integer
     * @return {Integer}
     */
    this.length = function() {
        return this.stack.length;
    };
    
    this.empty = function() {
        return this.length() == 0;
    };
    
    this.clear = function() {
        this.stack  = [];
    };
    
    this.toString = function() {
        return this.stack.join(' -> ');
    };

};

/**
 * Represents a simple hash map
 * @class {HashMap}
 * @return {Void}
 */
module.exports.classes.HashMap = function() {
    
    /**
     * @type {Integer}
     */
    this.size  = 0;
    
    /**
     * @type {Object}
     */
    this.table = {};
    
    /**
     * Adds a key/value pair to the table, overwriting previous entries
     * @param {String} key 
     * @param {Mixed} value
     * @return {Boolean}
     */
    this.set = function(key, value) {
        if (!this.contains(key)) {
            this.size++;
        }
        this.table[key] = value;
        return true;
    };
    
    /**
     * Removes the entry from the table that corresponds to the provided key.
     * If none exists returns false - otherwise returns true.
     * @param {String} key the key to remove
     * @return {Boolean}
     */
    this.remove = function(key) {
        if (this.contains(key)) {
            delete this.table[key];
            this.size--;
            return true;
        }
        return false;
    };
    
    /**
     * Returns a boolean value indicating whether or not the provided key
     * corresponds to an entry in the table
     * @param {String} key the key to query for
     * @return {Boolean}
     */
    this.contains = function(key) {
        return this.table.hasOwnProperty(key);
    };
    
    /**
     * Returns the entry corresponding to the provided key, returning null
     * if none exists.
     * @param {String} key the key to query for
     * @return {Mixed|null}
     */
    this.get = function(key) {
        if (!this.contains(key)) {
            return null;
        }
        return this.table[key];
    };
    
    /**
     * Returns the number of entries in the table as an integer
     * @return {Integer}
     */
    this.length = function() {
        return this.size;
    };

};

/**
 * Represents an event in the observer pattern
 * @class {ObservableEvent}
 * @param {String} name the name of the event
 * @param {Mixed} body the body of the event
 * @return {Void}
 */
module.exports.classes.ObservableEvent = function(name, body) {
    
    /**
     * @type {String}
     */
    this.name = name;
    
    /**
     * @type {Mixed}
     */
    this.body = body;
    
    /**
     * Returns the name of the event
     * @return {String}
     */
    this.getName = function() {    
        return this.name;
    };
    
    /**
     * Returns the body of the event
     * @return {Mixed}
     */    
    this.getBody = function() {
        return this.body;
    };

};

/**
 * Represents an observer implementation in the observer pattern
 * @class Observer
 * @param {Function} callback the callback to notify of events
 * @return {Void}
 */
module.exports.classes.Observer = function(callback) {
    
    /**
     * @type {Function}
     */
    this.callback = callback;
    
    /**
     * Notifies the observer callback of an event
     * @param {ObservableEvent} event the event to notify the observer callback with
     * @return {Void}
     */
    this.notify = function(event) {
        this.callback(event);
    };

};

/**
 * Represents an observable object in the observer pattern
 * @return {Void}
 */
module.exports.classes.Observable = function() {
    
    /**
     * @type {Object}
     */
    this.listeners = {};
    
    /**
     * Registers an observer for a given event name
     * @param {String} name the name of the event to observe
     * @param {Observer} observer the observer to register
     * @return {Void}
     */    
    this.registerObserver = function(name, observer) {
        if (!this.listeners.hasOwnProperty(name)) {
            this.listeners[name] = [];
        }
        this.listeners[name].push(observer);
    }
    
    /**
     * Un-registers an observer for a given event name
     * @param {String} name the name of the event to observe
     * @param {Observer} observer the observer to remove
     * @return {Boolean}
     */    
    this.unregisterObserver = function(name, observer) {
        if (!this.listeners.hasOwnProperty(name)) {
            return false;
        }
        var listeners = [];
        for (var key in this.listeners) {
            if (!this.listeners.hasOwnProperty(key)) {
                continue;
            }
            this.listeners[key].forEach(function(listener) {
                if (observer !== listener) {
                    listeners.push(listener);
                }
            });
        }
        this.listeners[name] = listeners;
        return true;
    };
    
    /**
     * Notifies all observers of an event
     * @param {ObservableEvent} event the event to propogate to observers
     * @return {Boolean}
     */    
    this.notifyObservers = function(event) {
        if (!this.listeners.hasOwnProperty(event.getName())) {
            return false;
        }
        this.listeners[event.getName()].forEach(function(listener) {
            listener.notify(event);
        });
        return true;
    };
    
    /**
     * Registers an event listener on the stream
     * @param {String} name the name of the event to observe
     * @param {Function} callback the callback to execute when observing the event
     * @return {Boolean}
     */
    this.on = function(name, callback) {
        if (!callback) {
            throw new Error('A callback function that accepts one parameter is required');
        }
        var observer = new module.exports.classes.Observer(callback);
        return this.registerObserver(name, observer);
    };

};

/**
 * Represents a character stream
 * @class {Stream}
 * @extends {Observable}
 * @return {Void}
 */
module.exports.classes.Stream = function() {
    
    module.exports.classes.Observable.call(this);
    
    /**
     * @type {Array}
     */
    this.buffer = [];
    
    /**
     * Returns the number of characters currently buffered in the stream as an integer
     * @return {Integer}
     */
    this.length = function() {
        return this.buffer.length;
    };
    
    /**
     * Returns a string representation of the contents of the stream
     * @param {Function} callback the callback to execute when concatenting the stream contents to a string
     * @return {String}
     */
    this.toString = function(callback) {
        if (!callback) {
            return this.buffer.join('');
        }
        if (this.buffer.length == 0) {
            var error = new Error('stream is empty');
            if (!callback) {
                throw error;
            }
            callback(error, null);
            return;
        }
        if (!callback) {
            return this.buffer.join('');
        }
        callback(null, this.buffer.join(''));
    };
    
    /**
     * Writes a single character to the stream
     * @param {Char} data
     * @return {Void}
     */
    this.writeChar = function(data) {
        this.buffer.push(data);
        this.notifyObservers(new module.exports.classes.ObservableEvent('write', data));
    };
    
    /**
     * Writes the contents of a string to the stream
     * @param {String} string
     * @return {Void}
     */
    this.writeString = function(string) {
        var data = string.split('');
        this.buffer = this.buffer.concat(data);
        this.notifyObservers(new module.exports.classes.ObservableEvent('write', data));
    };
    
    /**
     * Writes the contents of the array to the stream
     * @param {Array} data
     * @return {Void}
     */
    this.writeArray = function(data) {
        this.buffer = this.buffer.concat(data);
        this.notifyObservers(new module.exports.classes.ObservableEvent('write', data));
    };
    
    /**
     * Reads a single character from the stream
     * @param {Function} callback the callback to execute when reading from the stream
     * @return {Void|Char}
     */
    this.read = function(callback) {
        if (!callback) {
            return this.buffer.shift();
        }
        if (this.buffer.length == 0) {
            var error = new Error('stream is empty');
            if (!callback) {
                throw error;
            }
            callback(error, null);
            return false;
        }
        var data = this.buffer.shift();
        if (!callback) {
            return data;
        }
        callback(null, data);
        return true;
    };
    
    /**
     * Flushes all data from the stream
     * @param {Function} callback the callback to execute when flushing the stream
     * @return {Void|Array}
     */
    this.flush = function(callback) {
        var data = null;
        if (this.buffer.length == 0) {
            var error = new Error('stream is empty');
            if (!callback) {
                throw error;
            }
            callback(error, null);
            return;
        }
        data = this.buffer.splice(0);
        if (!callback) {
            return data;
        }
        callback(null, data);
        this.notifyObservers(new module.exports.classes.ObservableEvent('flush', data));
    };

};

/**
 * Represents a "chunk" of characters currently being handled
 * @param {Integer} type the type code for the chunk (e.g. number, string, boolean, null)
 * @class {Chunk}
 * @return {Void}
 */
module.exports.classes.Chunk = function(type) {
    
    this.buffer = [];
    this.type   = type;
    
    /**
     * Appends a character to the chunk
     * @param {Char|Integer} token
     * @return {Void}
     */
    this.append = function(token) {
        this.buffer.push(token);
    };
    
    /**
     * Returns the value for the chunk, this can vary depending on the type
     * code assigned to the chunk
     * @throws {Error}
     * @return {Mixed}
     */
    this.getValue = function() {
        switch (this.type) {
            case __c.__TYPE_BOOLEAN:
                return this.getBooleanValue();
            
            case __c.__TYPE_NUMBER:
                return this.getNumericValue();
            
            case __c.__TYPE_NULL:
                return this.getNullValue();
        }
        return this.buffer.join('');
    };
    
    this.getNullValue = function() {
        var value = this.buffer.join('').toLowerCase();
        if (value !== 'null') {
            throw new Error('invalid token: ' + value);
        }
        return null;
    };
    
    this.getBooleanValue = function() {
        var value = this.buffer.join('').toLowerCase();
        switch (value) {
            case 'true':
                return true;
                break;
            
            case 'false':
                return false;
                break;
        }
        throw new Error('invalid boolean value: ' + value);
    };
    
    this.getNumericValue = function() {
        var value = this.buffer.join('');
        if (value.match(/[^\deE\+\-\.]/g)) {
            throw new Error('invalid numeric value: ' + value);
        }
        if (!value.match(/[eE\.]/)) {
            return parseInt(value);
        } else {
            return parseFloat(value);
        }
    };
    
    /**
     * Returns the type code for the chunk
     * @return {Integer}
     */
    this.getType = function() {
        return this.type;
    };
    
    /**
     * Returns a string representation of the chunk
     * @return {String}
     */
    this.toString = function() {
        return this.buffer.join('');
    };

};

/**
 * A simple class containing logic for parsing JSON stream tokens
 * @param {StreamParser} the stream parser to handle tokens for
 * @class {TokenHandler}
 * @return {Void}
 */
module.exports.classes.TokenHandler = function(parser) {
    
    module.exports.classes.Observable.call(this);
    
    /**
     * @type {StreamParser}
     */
    this.parser = parser;
    
    /**
     * @type {Stack}
     */    
    this.chunks = new module.exports.classes.Stack();
    
    /**
     * @type {Stack}
     */        
    this.keys    = new module.exports.classes.Stack();
    this.objKeys = new module.exports.classes.Stack();
    
    /**
     * a map containing characters to ignore outside of string values
     * @type {Object}
     */
    this.ignore = {};
    this.ignore[__c.__CHAR_NEWLINE] = true;
    this.ignore[__c.__CHAR_SPACE] = true;
    this.ignore[__c.__CHAR_TAB] = true;
    
    /**
     * a map of all unicode control characters with shorthand encoding. The map
     * is keyed by character and contains the unicode sequence used to encode it.
     * @type {Object}
     */
    this.control = {};
    this.control['b'] = '0008'; // backspace
    this.control['t'] = '0009'; // tab
    this.control['n'] = '000A'; // newline
    this.control['r'] = '000D'; // carriage return
    this.control['f'] = '000C'; // form feed
    
    var scope  = this;
    
    /**
     * the internal state of the parser
     * @type {Object}
     */
    this.state = {
        escaped:  false, // whether or not the current string is escaped
        string:   false, // whether or not we're currently inside a string
        unicode:  false, // whether or not we're collecting tokens for a unicode value
        unibuff:  []     // the character buffer for unicode values
    };
    
    /**
     * a map of handler closures, keyed by the token they handle
     * @type {Object}
     */
    this.handlers = {};
    
    /**
     * Registers a handler function corresponding to a given character token
     * @param {Char} token
     * @param {Function} callback
     * @return {Void}
     */
    this.registerHandler = function(token, callback) {
        callback = callback.bind(scope);
        this.handlers[token] = callback;
    };
    
    this.determineType = function(token) {
        if (!token) {
            return false;
        }
        if (token.match(/[0-9\.\-]/)) {
            return __c.__TYPE_NUMBER;
        } else if(token.match(/[tTfF]/)) {
            return __c.__TYPE_BOOLEAN;
        } else if(token.match(/[nN]/)) {
            return __c.__TYPE_NULL;
        }
        throw new Error('unable to determine type for token ' + token);
    };
    
    this.determineClass = function(o) {
        if (!o) {
            return false;
        }
        if (Object.prototype.toString.call(o) === '[object Array]') {
            return __c.__TYPE_ARRAY;
        }
        if (Object.prototype.toString.call(o) === '[object Object]') {
            return __c.__TYPE_OBJECT;
        }
        return __c.__TYPE_STRING;
    };
    
    this.addNewElement = function(o, scalar) {
        var element = this.parser.elements.peek();
        var type = this.determineClass(element);
        switch (type) {
            case __c.__TYPE_ARRAY:
                element.push(o);
                break;
            
            case __c.__TYPE_OBJECT:
                if (this.keys.empty()) {
                    throw new Error('unable to add value to object with key');
                }
                var key = this.keys.pop();
                element[key] = o;
                this.notifyObservers(new module.exports.classes.ObservableEvent('found', {
                    'key': key, 
                    'value': o
                }));
                this.objKeys.push(key);
                break;
        }
        if (!scalar) {
            this.parser.elements.push(o);  
        }
    };
    
    this.addNewChunk = function() {
        if (this.chunks.empty()) {
            return false;
        }
        var chunk = this.chunks.peek();
        var element = this.parser.elements.peek();
        var type = this.determineClass(element);
        switch (type) {
            case __c.__TYPE_ARRAY:
                element.push(chunk.getValue());
                break;
            
            case __c.__TYPE_OBJECT:
                if (this.keys.empty()) {
                    var key = chunk.getValue();
                    this.keys.push(key);
                    this.notifyObservers(new module.exports.classes.ObservableEvent('found', {
                        'key': key
                    }));                    
                } else {
                    var key = this.keys.pop();
                    var value = chunk.getValue();
                    element[key] = chunk.getValue();
                    this.notifyObservers(new module.exports.classes.ObservableEvent('parsed', {
                        'key': key, 
                        'value': value
                    }));
                }
                break;
            
            default:
                throw new Error('badly formed JSON stream');
                break;
        }
        this.state.string = false;
        this.state.escaped = false;
        this.chunks.pop();
        return true;
    };
    
    this.registerHandler('__default__', function(token) {
        if (this.state.string) {
            if (this.state.escaped) {
                this.state.escaped = !this.state.escaped;
                if (this.control.hasOwnProperty(token)) {
                    return this.chunks.peek().append(String.fromCharCode(parseInt(this.control[token], 16)));
                } else if (token === 'u') {
                    this.state.unicode = true;
                    return;
                }
            }
            if (this.state.unicode) {
                this.state.unibuff.push(token);
                if (token.match('/[^0-9a-fA-F]/')) {
                    throw new Error("invalid unicode sequence " + this.state.unibuff.join(''));
                }
                if (this.state.unibuff.length == 4) {
                    var unicode = this.state.unibuff.join('');
                    if (unicode === '0022') {
                        throw new Error('invalid unicode sequence \u0022');
                    }
                    this.chunks.peek().append(String.fromCharCode(parseInt(unicode, 16)));
                    this.state.unicode = false;
                    this.state.unibuff = [];
                }
                return;
            } else {
                if (this.chunks.peek().getType() !== __c.__TYPE_STRING
                    && this.ignore.hasOwnProperty(token)) {
                        return;
                    }
                return this.chunks.peek().append(token);
            }
        }
        if (this.ignore.hasOwnProperty(token)) {
            return false;
        }
        var chunk = new module.exports.classes.Chunk(this.determineType(token));
        chunk.append(token);
        chunk.open = true;
        this.state.string = true;
        this.state.escaped = false;
        this.chunks.push(chunk);
    });
    
    this.registerHandler(__c.__STR_ESCAPE, function(token) {
        if (this.state.string) {
            if (this.state.escaped) {
                this.chunks.peek().append(token);
            }
            this.state.escaped = !this.state.escaped;
        } else {
            throw new Error('unable to escape value outside string');
        }
    });
    
    this.registerHandler(__c.__OBJ_OPEN, function(token) {
        if (this.state.string) {
            return this.chunks.peek().append(token);
        }
        this.addNewElement({});
    });
    
    this.registerHandler(__c.__OBJ_CLOSE, function(token) {
        if (this.state.string && this.chunks.peek().getType() == __c.__TYPE_STRING) {
            return this.chunks.peek().append(token);
        }
        this.addNewChunk();
        var key = this.objKeys.pop();
        var element = this.parser.elements.peek();
        var type = this.determineClass(element);
        if (type !== __c.__TYPE_OBJECT) {
            throw new Error('badly formed object');
        }
        element = this.parser.elements.pop();
        this.notifyObservers(new module.exports.classes.ObservableEvent('parsed', {
            'key': key, 
            'value': element
        }));
    });
    
    this.registerHandler(__c.__ARR_OPEN, function(token) {  
        if (this.state.string) {
            return this.chunks.peek().append(token);
        }
        this.addNewElement([]);
    });
    
    this.registerHandler(__c.__ARR_CLOSE, function(token) {        
        if (this.state.string && this.chunks.peek().getType() == __c.__TYPE_STRING) {
            return this.chunks.peek().append(token);
        }
        this.addNewChunk();
        var element = this.parser.elements.peek();
        var type = this.determineClass(element);
        if (type !== __c.__TYPE_ARRAY) {
            throw new Error('badly formed array');
        }
        element = this.parser.elements.pop();
        if (!this.objKeys.empty() 
            && this.determineClass(this.parser.elements.peek()) == __c.__TYPE_OBJECT) {
            var key = this.objKeys.pop();
            this.notifyObservers(new module.exports.classes.ObservableEvent('parsed', {
                'key': key, 
                'value': element
            }));            
        }
    });
    
    this.registerHandler(__c.__OBJ_DELIM, function(token) {
        var chunk = this.chunks.peek();
        if (this.state.string) {
            return chunk.append(token);
        }
        this.addNewChunk();
    });
    
    this.registerHandler(__c.__ELEM_DELIM, function(token) {    
        if (this.state.string && this.chunks.peek().getType() == __c.__TYPE_STRING) {
            return this.chunks.peek().append(token);
        }
        return this.addNewChunk();
    });
    
    this.registerHandler(__c.__STR_DELIM, function(token) {
        var chunk = null;
        if (this.state.string) {
            chunk = this.chunks.peek();
            if (this.state.escaped) {
                return chunk.append(token);
            }
            chunk.open = false;
            this.state.string = false;
            this.state.escaped = false;
            return;
        }
        chunk = new module.exports.classes.Chunk(__c.__TYPE_STRING);
        chunk.open = true;
        this.state.string = true;
        this.state.escaped = false;
        this.chunks.push(chunk);
    });
    
    /**
     * Executes the registered handler for the provided token
     * @param {Char} the token to handle
     * @return {Void}
     */
    this.handle = function(token) {
        if (!this.handlers.hasOwnProperty(token)) {
            return this.handlers['__default__'](token);
        }
        return this.handlers[token](token);
    };

};

/**
 * Represents a parser for JSON character streams
 * @class {StreamParser}
 * @return {Void}
 */
module.exports.classes.StreamParser = function() {
    
    module.exports.classes.Observable.call(this);
    
    /**
     * @type {Function}
     */
    var __t = this;
    
    /**
     * @type {Stream}
     */
    this.stream = new module.exports.classes.Stream();
    
    /**
     * @type {Stack}
     */    
    this.elements = new module.exports.classes.Stack();
    
    /**
     * @type {TokenHandler}
     */
    this.handler = new module.exports.classes.TokenHandler(this);
    
    /**
     * internal event handlers below
     */
    this.handler.on('found', function(data) {
        var body = data.getBody();
        if (!body.key) {
            return;
        }
        __t.notifyObservers(new module.exports.classes.ObservableEvent('found:' + body.key, body));
    });
    
    this.handler.on('parsed', function(data) {
        var body = data.getBody();
        if (!body.key) {
            return;
        }
        __t.notifyObservers(new module.exports.classes.ObservableEvent('parsed:' + body.key, body.value));
    });
    
    this.handler.on('parsed', function(data) {
        __t.notifyObservers(data);        
    });
    /**
     * end internal event handlers
     */
    
    /**
     * Fires an event to all subscribed observers when a given key 
     * is encountered in the stream. This event is fired when the key is first
     * seen, but the body of the corresponding value has not been parsed.
     * @param {String} key the key to watch for
     * @param {Function} callback the function to execute when the key is encountered
     * @return {Void}
     */
    this.onFind = function(key, callback) {
        this.on('found:' + key, function(event) {
            callback(null, event.getBody());
        });
    };

    /**
     * Fires an event to all subscribed observers when the corresponding value for 
     * a given key is parsed. This event is fired when the value is completely parsed.
     * @param {String} key the key to watch for
     * @param {Function} callback the function to execute when the value 
     *                   corresponding to the key is parsed
     * @return {Void}
     */
    this.onParse = function(key, callback) {
        this.on('parsed:' + key, function(event) {
            callback(null, event.getBody());
        });
    };

    /**
     * The same as onParse, however the key is matched against the provided pattern
     * rather than exactly matched. This function allows to fuzzy matching against
     * key names (e.g. /^(foo|bar)$/, /key\d{1,3}/)
     * @param {RegExp} pattern the pattern to match keys against
     * @param {Function} callback the function to execute when the value 
     *                   corresponding to the key is parsed
     * @return {Void} 
     */
    this.onMatch = function(pattern, callback) {
        this.on('parsed', function(event) {
            var body = event.getBody();
            if (!body.key) {
                return;
            }
            if (body.key.match(pattern)) {
                callback(null, event.getBody());
            }
        });
    };

    /**
     * Fires an event when an error occurs during parsing, the thrown error is
     * provided as the sole argument for the function.
     * @param {Function} callback the function to execute when an error occurs
     * @return {Void}
     */
    this.onError = function(callback) {
        this.on('error', function(event) {
            callback(event.getBody(), null);
        });
    };

    /**
     * Resets the scope for the parser - effectively discardingly previously
     * parsed elements and starting from scratch
     * @return {Void}
     */
    this.resetScope = function() {
        this.elements.clear();
        this.elements.push([]);
        this.scope = this.elements.peek();
    };
    
    /**
     * Consumes the provided source string and writes to the parser character stream
     * @param {String} source
     * @return {Void}
     */
    this.consume = function(source) {
        this.stream.writeString(source);
    };
    
    /**
     * Parses data as it is written to the character stream
     * @param {Mixed} data
     * @return {Void}
     */
    this.parse = function(data) {
        try {
            while(__t.stream.read(function(err, token) {
                if (err) {
                return;
                }
                __t.handler.handle(token);
                }));
        } catch (e) {
            __t.resetScope();
            __t.notifyObservers(new module.exports.classes.ObservableEvent('error', e));
        }
    };
    
    /**
     * Returns the scope for the parser. The scope represents the top level array container
     * for the stream being parsed. Holding a pointer to this scope allows agents to access
     * the JSON encoded objects in real time as they are being parsed.
     * @return {Array}
     */
    this.getScope = function() {
        return this.scope;
    };
    
    this.resetScope();
    this.stream.on('write', this.parse);

};

/**
 * An implementation of the facade pattern that ties all JAXON parser logic together
 * in a neat, simple API.
 * @class {Jaxon}
 * @return {Void}
 */
module.exports.classes.Jaxon = function() {
    
    this.parser = new module.exports.classes.StreamParser();
    
    var scope = this;
    
    this.parse = function(path, options, callback) {
        options = options || {};
        if (path.match(/^file\:\/\//)) {
            this.parseFileStream(path, options, callback);
        } else if (path.match(/^http\:\/\//)) {
            this.parseHttpStream(path, options, callback);
        } else if (path.match(/^https\:\/\//)) {
            this.parseHttpsStream(path, options, callback);
        } else {
            callback(new Error('unrecognised url scheme: ' + path));
        }
        return this.parser.getScope();
    };
    
    this.on = function(event, key, callback) {
        switch (event) {
            case 'error':
                callback = key;
                this.parser.onError(callback);
                break;
                
            case 'parse':
                this.parser.onParse(key, callback);
                break;
                
            case 'match':
                this.parser.onMatch(key, callback);
                break;
                
            case 'find':
                this.parser.onFind(key, callback);
                break;
                
            default:
                callback(new Error('unrecognized event: ' + event));
                break;
        }
    };
    
    this.parseFileStream = function(path, options, callback) {
        if (!fs) {
            fs = require('fs');
        }
        var p = path.replace(/^file\:\/\//, '');
        var instream = fs.createReadStream(p, {
            'flags':'r', 
            'encoding':'utf8', 
            'bufferSize': 4100
        });
        instream.on('error', callback);
        instream.on('data', function(buffer) {
            scope.parser.consume(buffer);
        });
    };
    
    this.parseHttpStream = function(path, options, callback) {
        if (!http) {
            http = require('http');
        }
        if (!url) {
            url = require('url');
        }
        var opt = url.parse(path);
        if (options['user-agent']) {
            opt['user-agent'] = options['user-agent'];
        }
        if (options['accept']) {
            opt['accept'] = options['accept'];
        }        
        http.get(opt, function(res) {
            res.on('data', function(data) {
                scope.parser.consume(data.toString());
            });
        })
        .on('error', function(e) { callback(e); });
    };
    
    this.parseHttpsStream = function(path, options, callback) {
        if (!https) {
            https = require('https');
        }
        if (!url) {
            url = require('url');
        }
        var opt = url.parse(path);
        if (options['user-agent']) {
            opt['user-agent'] = options['user-agent'];
        }
        if (options['accept']) {
            opt['accept'] = options['accept'];
        }        
        https.get(opt, function(res) {
            res.on('data', function(data) {
                scope.parser.consume(data.toString());
            });
        })
        .on('error', function(e) { callback(e); });
    };    

};

module.exports.objects['parser'] = new module.exports.classes.Jaxon();

/**
 * Returns a new Stack instance
 * @return {Stack}
 */
module.exports.factoryStack = function() {
    return new module.exports.classes.Stack();
};

/**
 * Returns a new HashMap instance
 * @return {HashMap}
 */
module.exports.factoryHashMap = function() {
    return new module.exports.classes.HashMap();
};

/**
 * Returns a new Stream instance
 * @return {Stream}
 */
module.exports.factoryStream = function() {
    return new module.exports.classes.Stream();
};

/**
 * Returns a new ObservableEvent instance
 * @return {ObservableEvent}
 */
module.exports.factoryObservableEvent = function(name, body) {
    return new module.exports.classes.ObservableEvent(name, body);
};

/**
 * Returns a new Observable instance
 * @return {Observable}
 */
module.exports.factoryObservable = function() {
    return new module.exports.classes.Observable;
};

/**
 * Returns a new Observer instance
 * @return {Observer}
 */
module.exports.factoryObserver = function(callback) {
    return new module.exports.classes.Observer(callback);
};

/**
 * Returns a new Chunk instance
 * @param {Integer} type the type code for the chunk
 * @return {Chunk}
 */
module.exports.factoryChunk = function(type) {
    return new module.exports.classes.Chunk(type);
};

/**
 * Returns a new StreamParser instance
 * @return {StreamParser}
 */
module.exports.factoryStreamParser = function(scope) {
    return new module.exports.classes.StreamParser(scope);
}

/**
 * Returns a new TokenHandler instance
 * @param {StreamParser} parser
 * @return {TokenHandler}
 */
module.exports.factoryTokenHandler = function(parser) {
    return new module.exports.classes.TokenHandler(parser);
};

/**
 * Returns a new Jaxon facade instance
 * @param {String} path
 * @param {Function} callback
 * @return {Jaxon}
 */
module.exports.factoryJaxon = function(path, callback) {
    return new module.exports.classes.Jaxon();
};