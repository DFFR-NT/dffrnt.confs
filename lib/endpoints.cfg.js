
/////////////////////////////////////////////////////////////////////////////////////////////
// THINGS TO KNOW:
	//
	// SQL  - <Object> - See help for dffrnt.model
	// AMP  - <String> - AND character (+), for HTTP queries
	// ORS  - <String> -  OR character (;), for HTTP queries
	// PIP  - <String> -  OR character (|), for  SQL queries
	//
	// UER  - <Array>  - See help for Errors.js in dffrnt.router
	// MSG  - <Array>  - See help for Errors.js in dffrnt.router
	// PRM  - <Array>  - See help for Errors.js in dffrnt.router
	//
	// Docs - <Object> - See help for dffrnt.router
	//
	// LG   - <Object> - See help for dffrnt.utils
	// TLS  - <Object> - See help for dffrnt.utils
	// JSN  - <Object> - See help for dffrnt.utils
	//
/////////////////////////////////////////////////////////////////////////////////////////////
// IMPORT

const { RouteDB, GNHeaders, GNParam, GNDescr, PT, PType } = require('dffrnt.confs').Definers(); 

/////////////////////////////////////////////////////////////////////////////////////////////
// EXPORT
	module.exports = function () { // DO NOT CHANGE/REMOVE!!!
		return { 
			// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
			Users: 		{
				Actions: 	{
					// ======================================================================
					"/": 		new RouteDB({
						Methods: 	Docs.Kinds.GET,
						Scheme: 	'/:account([\w\d_-]+)/',
						GET			() { return {
							Doc: 	new GNDescr({
								Headers: 	{ token: Docs.Headers.Token },
								Examples: 	{
									"/:account:ajohnson": "Displays the {{Users}} with a {{User Name}} of 'ajohnson'",
									"?page=3&limit=10": "Displays the 3rd {{Page}} at a {{Limit}} of 'ten' {{Users}} results per {{Page}}",
								},
							}),
							Query: 		[
								"SELECT     u.user_id, u.display_name, u.verified, u.status, u.tour_done,",
								"           getFullName(u.user_id) as full_name,",
								"           IF(v.value &  2, null, u.first_name)    AS first_name,",
								"           IF(v.value &  4, null, u.last_name)     AS last_name,",
								"           IF(v.value & 16, null, u.birth_date)    AS birth_date,",
								"           IF(v.value & 32, null, u.location)      AS location,",
								"           IF(v.value & 32, null, CONCAT_WS(', ',",
								"                                       COALESCE(NULLIF(l.city,   ''),NULL),",
								"                                       COALESCE(NULLIF(l.region, ''),NULL),",
								"                                       COALESCE(NULLIF(l.country,''),NULL)",
								"                                  )   )            AS location_label,",
								"           IF(v.value & 32, null, UPPER(r.iso))   AS region_code,",
								"           IF(v.value & 32, null, UPPER(f.iso))   AS country_code,",
								"           u.inserted_at   AS member_since",
								"FROM       users           AS u",
								"LEFT JOIN  user_visibilities  v ON u.user_id = v.user_fk AND :VISIBLE:",
								"LEFT JOIN  locale_search   AS l ON u.location = l.id",
								"LEFT JOIN  locale_regions  AS r ON r.id = l.region_id",
								"LEFT JOIN  locale_countries AS f ON f.id = r.country_id",
								"WHERE      u.display_name IN :ACCOUNT:",
							],
							Params: 	{
								Account: 	new GNParam({
									Name:	 'Display Name',
									Default: '',
									Format 	 (cls) { return cls.account; },
									Desc: 	 {
										type: PT.L.Text({ join: '","', enclose: [`(")`,`")`] }),
										description: "The user's {{Display Name}}",
										matches: { 'Display-Name': 'Matches the {{Display Name}} of the {{User}} (([A-Za-z0-9_-]+))' },
										required: true,
										to: 'param', 
									}
								}),
								Visible: true, Single: true, Page: true, Limit: true, ID: true
							},
						}; 	},
						Parse  		(res) {
							var RQ  = this.RQ; if (!!this.QY.single) return res[0];
							return JSN.Objectify(res, RQ.Key, RQ.Columns, this.QY);
						},
						Key: 		'display_name',
						Links: 		[],
					})
				},
				Errors: 	{ BAD_REQ: ['/'] }
			},
		};	
	};

/////////////////////////////////////////////////////////////////////////////////////////////
