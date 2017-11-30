var wsrrUtils = require('apiconnect-soa-transfer-tool').wsrrUtils;
var logger = require('apiconnect-soa-transfer-tool').logger;

module.exports = function(RED) {
    function WSRRSLACheckNode(config) {
        RED.nodes.createNode(this,config);

		// initialize logger but no callback
		logger.initialize();

        var node = this;

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

		// get the sla details
		this.consumerID = config.consumerID;
		this.contextID = config.contextID;
		this.endpointClassification = config.endpointClassification;
		this.fullResults = config.fullResults;

        this.on('input', function(msg) {
			// log the input
			console.log(this.consumerID);
			console.log(this.contextID);
			console.log(this.endpointClassification);
			console.log(this.fullResults);

			// run the named query
			var params = [this.consumerID, this.contextID, this.endpointClassification];
			var promise = wsrrUtils.runNamedQuery("SLAEndpointLookup", params).then(function(result){
				// check if it found any endpoints
				if(result.length && result.length > 0) {
					// take first result URL as endpoint
					// then all result URLs as endpoints
					// then all results as wsrrObjects if this.fullResults=true
					msg.wsrrResults = {};
					if(node.fullResults === true) {
						msg.wsrrResults.wsrrObjects = result;
					}
					msg.wsrrResults.endpoints = [];
					for(var i = 0, len = result.length; i < len; i++) {
						var ep = result[i];
						if(!msg.wsrrResults.endpoint) {
							msg.wsrrResults.endpoint = ep.properties.name;
						}
						msg.wsrrResults.endpoints.push(ep.properties.name);
					}
					node.send(msg);
				} else {
					// error no SLA
					node.error("No agreed SLA found", msg);
				}
			}).caught(function(error){
				// log
				console.error(error);
				node.error(error);
			});
       });

    }
    RED.nodes.registerType("wsrr-sla-check",WSRRSLACheckNode);
}
