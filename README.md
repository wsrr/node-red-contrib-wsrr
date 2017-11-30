node-red-contrib-wsrr
=========

Sample code showing how to create nodes for Node-RED to connect to a WebSphere Service Registry and Repository (WSRR) server over HTTPS, to do a query, or perform an SLA check and retrieve endpoints.

## Installation

	npm install node-red-contrib-wsrr

## Nodes

3 sample nodes are provided.

### wsrr-config

Provides configuration for a WSRR server to the other nodes.

### wsrr-graph-query

Run a graph query against WSRR, the results are stored on the message as a wsrrResults property.

### wsrr-sla-check

Use this node to find all of the service endpoints associated with a particular SLA relationship.

Consumer ID is the consumer identifier on the consuming Version. Context ID is the context identifier on the consuming SLA. Endpoint Classification is the classification that must be present on the endpoint, the default is the classification for Production endpoints.

The results are stored on the message as a wsrrResults property. The first endpoint is wsrrResults.endpoint and a list of all endpoints is in the array wsrrResults.endpoints.

If Full Results is checked then the WSRR endpoint objects are put on wsrrResults.wsrrObjects in an array.

## Usage

See the sample flow `sample-flow.json`. This has two inject nodes, one wired to wsrr-graph-query and one to wsrr-sla-check, which are both wired to the debug node which shows the results in `wsrrResults`.

The WSRR data for the service that the sample is coded against can be downloaded from the article [Registering, exposing, and invoking a REST service with a sample client](https://www.ibm.com/developerworks/websphere/library/techarticles/1311_seager/1311_seager.html). The WSRR data for the client can be downloaded from the article [Part 2: Using DataPower and the WS-MediationPolicy to enforce policies attached to a REST service](https://www.ibm.com/developerworks/websphere/library/techarticles/1407_seager/1407_seager.html). The client can be registered against the service by following the instructions in the Part 2 article in the section "Completing the governance and policy objects in WSRR".

The graph query node is configured to run an XPath which looks up a Service Version with a specific name and version, then follows the relationships to the endpoints and filters to only Production endpoints. As such this is an example of how to do an endpoint lookup using the node. A service in WSRR must exist which matches the name and version and has a SLD with an endpoint attached, where the endpoint is classified as Production. If you are using the sample data then the results will be an array of objects, the first object is the data for the production endpoint.

The sla check node is configured to check for an active SLA by context and consumer identifiers. The query used is named `SLAEndpointLookup` and is documented in the WSRR Knowledge Centre topic [Searching for service level agreements](https://www.ibm.com/support/knowledgecenter/en/SSWLGF_8.5.6/com.ibm.sr.doc/rwsr_smp_service_level_agreement_search.html). If you are using the sample data then the result will be an object containing the endpoint URL "http://CSProductionHost:9443/services/catalog/".


## About

The nodes use the NodeJS WSRR library provided in the NPM package [apiconnect-soa-transfer-tool](https://www.npmjs.com/package/apiconnect-soa-transfer-tool) to communicate with WSRR. The library provides functions to run a graph query and run a named query, the named query `SLAEndpointLookup` is used to perform the SLA check. 


## License

Licensed under the Apache License, Version 2.0 (the "License"). See license.txt.
