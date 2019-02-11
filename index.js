/**
 * A configuration module for the `dffrnt.api` framework
 * @module dffrnt.confs
 * @alias confs
 */


// ----------------------------------------------------------------------------------------------
// // Handle Requires ------------------------------------------------------------------------------

	const ROOTD = require('app-root-path');
	const pth 	= `${ROOTD}/config`;

	module.exports 	= {
		/**
		 * Initializes all available Configurators
		 * @alias module:confs.Definers
		 */
		Definers()	{ 
			let { RouteAU, RouteDB, GNHeaders, GNParam, GNDescr,
			      PType, PT, _Defaults, MERGER 
			    } = require('./lib/utils'); 
			return { 
				RouteAU, RouteDB, GNHeaders, GNParam, GNDescr, 
				PType, PT, _Defaults, MERGER 
			};
		},

		/**
		 * Initializes all customized Configurators
		 * @alias module:confs.Init
		 */
		Init() 		{ 
			return {
				Settings: 	require(`${pth}/settings.cfg`),
				DB: 		require(`${pth}/database.cfg`),
				NMSP: 		require(`${pth}/namespaces.cfg`),
				AuthP: 		require(`${pth}/authpoints.cfg`),
				EndP: 		require(`${pth}/endpoints.cfg`),
			};	
		},
	}


