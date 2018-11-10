var React = require('react');
var rB = require('react-bootstrap');
var cE = React.createElement;

class ListNotif extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        var reverse = this.props.notif.slice(0).reverse();
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
