// Modifications copyright 2020 Caf.js Labs and contributors
/*!
Copyright 2013 Hewlett-Packard Development Company, L.P.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

'use strict';
const caf = require('caf_core');
const app = require('../public/js/app.js');

const APP_SESSION = 'default';

const incrementImpl = function(self, inc) {
    self.state.counter = self.state.counter + inc;

    if (self.state.counter % self.$.props.divisor == 0) {
        if (self.state.notif.length === self.$.props.maxNotif) {
            self.state.notif.shift();
        }
        self.state.notif.push(self.state.counter);
        self.$.session.notify([self.state], APP_SESSION);
    }
};

exports.methods = {
    async __ca_init__() {
        this.state.counter = -1;
        this.state.notif = [];
        this.$.session.limitQueue(1, APP_SESSION); // only the last notification
        this.state.fullName = this.__ca_getAppName__() + '#' +
            this.__ca_getName__();
        return [];
    },

    async __ca_pulse__() {
        this.$.log && this.$.log.debug('calling PULSE!!! ' +
                                       this.state.counter);
        incrementImpl(this, 1);
        this.$.react.render(app.main, [this.state]);
        return [];
    },

    async hello(key) {
        this.$.react.setCacheKey(key);
        return this.getState();
    },

    async increment(inc) {
        incrementImpl(this, inc);
        return this.getState();
    },

    async getState() {
        this.$.react.coin();
        return [null, this.state];
    }
};

caf.init(module);
