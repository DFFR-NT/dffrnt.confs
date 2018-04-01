
// ----------------------------------------------------------------------------------------------
// Handle Requires ------------------------------------------------------------------------------

	import { ROOTD } from 'dffrnt.utils';
	const pth = `${ROOTD}/config`;

	export const Settings 	= require(`${pth}/settings.cfg`).default;
	export const DB 		= require(`${pth}/database.cfg`).default;
	export const NMSP 		= require(`${pth}/namespaces.cfg`).default;
	export const AuthP 		= require(`${pth}/authpoints.cfg`).default;
	export const  EndP 		= require(`${pth}/endpoints.cfg`).default;

	export default { Settings, DB, NMSP, AuthP, EndP };
