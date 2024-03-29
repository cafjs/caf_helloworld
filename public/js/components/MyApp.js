'use strict';

const React = require('react');
const rB = require('react-bootstrap');
const AppActions = require('../actions/AppActions');
const ListNotif = require('./ListNotif');
const AppStatus = require('./AppStatus');
const Counter = require('./Counter');
const Follow = require('./Follow');
const DisplayError = require('./DisplayError');

const cE = React.createElement;

class MyApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = this.props.ctx.store.getState();
    }

    componentDidMount() {
        if (!this.unsubscribe) {
            this.unsubscribe = this.props.ctx.store
                .subscribe(this._onChange.bind(this));
            this._onChange();
        }
    }

    componentWillUnmount() {
        if (this.unsubscribe) {
            this.unsubscribe();
            this.unsubscribe = null;
        }
    }

    _onChange() {
        if (this.unsubscribe) {
            this.setState(this.props.ctx.store.getState());
        }
    }

    render() {
        const following = this.state.linkedTo ?
            this.state.linkedTo.slice(0, -8) :
            'NOBODY';

        return cE('div', {className: 'container-fluid'},
                  cE(DisplayError, {
                      ctx: this.props.ctx,
                      error: this.state.error
                  }),
                  cE(rB.Panel, null,
                     cE(rB.Panel.Heading, null,
                        cE(rB.Panel.Title, null,
                           cE(rB.Grid, {fluid: true},
                              cE(rB.Row, null,
                                 cE(rB.Col, {sm:1, xs:1},
                                    cE(AppStatus, {
                                        isClosed: this.state.isClosed
                                    })
                                   ),
                                 cE(rB.Col, {
                                     sm: 5,
                                     xs:10,
                                     className: 'text-right'
                                 }, 'Counter Example'),
                                 cE(rB.Col, {
                                     sm: 5,
                                     xs:11,
                                     className: 'text-right'
                                 }, this.state.fullName)
                                )
                             )
                          )
                       ),
                     cE(rB.Panel.Body, null,
                        cE(rB.Panel, null,
                           cE(rB.Panel.Heading, null,
                              cE(rB.Panel.Title, null, 'Counter')
                             ),
                           cE(rB.Panel.Body, null,
                              cE(Counter, {
                                  ctx: this.props.ctx,
                                  counter: this.state.counter,
                                  increment: this.state.increment
                              })
                             )
                          ),
                        cE(rB.Panel, null,
                           cE(rB.Panel.Heading, null,
                              cE(rB.Panel.Title, null, 'Last Notifications')
                             ),
                           cE(rB.Panel.Body, null,
                              cE(ListNotif, {
                                  notif: this.state.notif
                              })
                             )
                          ),
                        cE(rB.Panel, null,
                           cE(rB.Panel.Heading, null,
                              cE(rB.Panel.Title, null, `Following ${following}`)
                             ),
                           cE(rB.Panel.Body, null,
                              cE(Follow, {
                                  ctx: this.props.ctx
                              })
                             )
                          )
                       )
                    )
                 );
    }
};

module.exports = MyApp;
