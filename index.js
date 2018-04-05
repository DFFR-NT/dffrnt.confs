
// ----------------------------------------------------------------------------------------------
// Handle Requires ------------------------------------------------------------------------------

	const ROOTD = require('app-root-path');
	const pth 	= `${ROOTD}/config`;

	module.exports 	= {
		Settings: 	require(`${pth}/settings.cfg`),
		DB: 		require(`${pth}/database.cfg`),
		NMSP: 		require(`${pth}/namespaces.cfg`),
		AuthP: 		require(`${pth}/authpoints.cfg`),
		EndP: 		require(`${pth}/endpoints.cfg`)
	};
