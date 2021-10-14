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
const assert = require('assert');
const caf = require('caf_core');
const app = require('../public/js/app.js');

const APP_SESSION = /^user/;
const CHANNEL_NAME = 'counter';

const updateImpl = (self) => {
    if (self.state.counter % self.$.props.divisor == 0) {
        self.state.notif.push(self.state.counter);
        if (self.state.notif.length > self.$.props.maxNotif) {
            self.state.notif.shift();
        }
    }
    self.$.session.notify([self.state], APP_SESSION);
    self.$.pubsub.publish(self.state.myChannel,
                          JSON.stringify({counter: self.state.counter}));
};

const cycleDetected = (self) => (Date.now() - self.state.lastUpdate >
                                 self.$.props.timeoutInMsec);

exports.methods = {
    async __ca_init__() {
        this.state.counter = -1;
        this.state.notif = [];
        this.state.linkedTo = null;
        this.state.lastUpdate = 0;

        this.state.fullName = this.__ca_getAppName__() + '#' +
            this.__ca_getName__();
        this.state.myChannel = caf.joinName(this.__ca_getName__(),
                                            CHANNEL_NAME);

        this.$.security.addRule(this.$.security.newSimpleRule(
            '__ca_handleCounter__' // anybody, but no external calls
        ));
        return [];
    },

    async __ca_resume__() {
        if (this.state.lastUpdate) {
            // avoid reset after reload
            this.state.lastUpdate = Date.now();
        }
        return [];
    },

    async __ca_pulse__() {
        this.$.log && this.$.log.debug(`calling PULSE: ${this.state.counter}`);
        if (this.state.linkedTo) {
            if (cycleDetected(this)) {
                this.$.log && this.$.log.debug('Cycle detected, reseting');
                this.reset();
            }
        } else {
            this.state.counter = this.state.counter + 1;
            updateImpl(this);
        }
        this.$.react.render(app.main, [this.state]);
        return [];
    },

    async __ca_handleCounter__(topic, message) {
        if (topic === this.state.linkedTo) {
            const {counter} = JSON.parse(message);
            this.state.counter = counter;
            this.state.lastUpdate = Date.now();
            updateImpl(this);
        }
        return [];
    },

    async hello(key) {
        this.$.react.setCacheKey(key);
        return this.getState();
    },

    async increment(inc) {
        this.state.counter = this.state.counter + inc;
        updateImpl(this);
        return this.getState();
    },

    async follow(target) {
        assert(caf.splitName(target).length === 2);
        const oldTopic = this.state.linkedTo;
        const newTopic = caf.joinName(target, CHANNEL_NAME);
        if (oldTopic !== newTopic) {
            this.state.linkedTo = newTopic;
            this.$.pubsub.subscribe(newTopic, '__ca_handleCounter__');
            this.state.lastUpdate = Date.now();
            oldTopic && this.$.pubsub.unsubscribe(oldTopic);
        }
        return this.getState();
    },

    async unfollow() {
        const oldTopic = this.state.linkedTo;
        this.state.linkedTo = null;
        this.state.lastUpdate = 0;
        oldTopic && this.$.pubsub.unsubscribe(oldTopic);
        return this.getState();
    },

    async reset() {
        this.state.counter = 0;
        const oldTopic = this.state.linkedTo;
        this.state.linkedTo = null;
        oldTopic && this.$.pubsub.unsubscribe(oldTopic);
        this.state.lastUpdate = 0;
        updateImpl(this);
        return this.getState();
    },

    async getState() {
        this.$.react.coin();
        return [null, this.state];
    }
};

caf.init(module);
