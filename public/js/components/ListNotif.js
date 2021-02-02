const React = require('react');
const rB = require('react-bootstrap');
const cE = React.createElement;

class ListNotif extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const reverse = this.props.notif.slice(0).reverse();
        return cE(rB.ListGroup, null,
                  reverse.map(function(x, i) {
                      return  cE(rB.ListGroupItem, {style: {float: 'left'},
                                                    className: 'clearfix',
                                                    key:i},
                                 cE(rB.Badge, {className: 'big-badge'}, x));
                  })
                 );
    }
};


module.exports = ListNotif;
