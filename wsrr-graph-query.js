var wsrrUtils = require('apiconnect-soa-transfer-tool').wsrrUtils;
var logger = require('apiconnect-soa-transfer-tool').logger;

module.exports = function(RED) {
    function WSRRGraphQueryNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;

		// initialize logger but no callback
		logger.initialize();

		// config is set on the node when it's deployed, so we can save it here
		this.wsrrServer = RED.nodes.getNode(config.wsrrServer);

        if(!this.wsrrServer) {
			// no config node
            throw new Error('No configuration set');
		}

		// set connection
		wsrrUtils.setWSRRConnectiondetails({
			wsrrHostname: this.wsrrServer.hostname,
			wsrrPort: this.wsrrServer.port,
			wsrrProtocol: "https",
			wsrrUsername: this.wsrrServer.username,
			wsrrPassword: this.wsrrServer.password,
			wsrrPrefix: ""
		});

		// get the query
		this.queryXpath = config.queryXpath;

		// name for node display
		this.name = config.name;

        this.on('input', function(msg) {
			// log the query
			console.log(this.queryXpath);

			// run a query
			var promise = wsrrUtils.runGraphQuery(this.queryXpath).then(function(result){
				// send on
				msg.wsrrResults = result;
				node.send(msg);
			}).caught(function(error){
				// log
				console.error(error);
				node.error(error);
			});
        });

    }
    RED.nodes.registerType("wsrr-graph-query",WSRRGraphQueryNode);
}
