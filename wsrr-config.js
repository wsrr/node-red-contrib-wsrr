module.exports = function(RED) {
    function WSRRConfigNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;
		
		this.name =  config.name;
		this.hostname = config.hostname;
		this.port = config.port;
		this.username = config.username;
		this.password = config.password;
		
    }
    RED.nodes.registerType("wsrr-config",WSRRConfigNode);
}