var React = require('react');
var rB = require('react-bootstrap');
var AppActions = require('../actions/AppActions');
var ListNotif = require('./ListNotif');
var AppStatus = require('./AppStatus');

var cE = React.createElement;

class MyApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = this.props.ctx.store.getState();
        this.doIncrement = this.doIncrement.bind(this);
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

    doIncrement() {
        var inc = parseInt(document.getElementById('inc').value);
        AppActions.increment(this.props.ctx, inc);
    }

    render() {
        return cE('div', {className: 'container-fluid'},
                  cE(rB.Panel, {
                      header: cE(rB.Grid, {fluid: true},
                                 cE(rB.Row, null,
                                    cE(rB.Col, {sm:1, xs:1},
                                       cE(AppStatus, {
                                           isClosed:
                                           this.state.isClosed
                                       })),
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
                  }, cE(rB.Panel, {header: cE('span', null, 'Current Counter: ',
                                              cE(rB.Badge,
                                                 {className: 'big-badge'},
                                                 this.state.counter)
                                             )},
                        cE(rB.Grid, {fluid: true},
                           cE(rB.Row, null,
                              cE(rB.Col, { xs:6, sm: 4},
                                 cE(rB.Input, {type: 'text', id: 'inc',
                                               defaultValue: '1'})
                                ),
                              cE(rB.Col, { xs:6, sm:4},
                                 cE(rB.Button, {onClick: this.doIncrement,
                                                bsStyle: 'primary'},
                                    'Increment')
                                )
                             )
                          )
                       ),
                     cE(rB.Panel, {header:  cE('span', null,
                                               'Last Notifications')},
                        cE(ListNotif, {notif :this.state.notif})
                       )
                    )
                 );
    }
};

module.exports = MyApp;
