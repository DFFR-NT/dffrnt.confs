/// <reference types="dffrnt.confs" />
'use strict';

/////////////////////////////////////////////////////////////////////////////////////////////
// REQUIRES

	const  	{ 	Assign, Imm, StrTime, ROOTD, path, os, fs,
				CNAME, ARGS, TYPE, EXTEND, HIDDEN, DEFINE, NIL, UoN, 
				IaN, IS, ISS, OF, DCT, RGX, FRMT, CLM, CLMNS, ELOGR,
				preARGS, Dbg, LG, TLS, JSN, FromJS
			} = require('dffrnt.utils');
	const   OoA     = ['object','array'],
			PTP     = ['Text','Bool','Num','Int','Float','Level','Multi'],
			TPS     = [
				'GNConfig',  'RouteGN', 'RouteAU', 'RouteDB',
				'GNHeaders', 'GNParam', 'GNDescr',
			];

	/** 
	 * The **HTTP-Method**, `GET`.
	 * @type {HMETHOD}
	 */
	const 	GET     = 'GET';
	/** 
	 * The **HTTP-Method**, `POST`.
	 * @type {HMETHOD}
	 */
	const 	POST    = 'POST';
	/** 
	 * The **HTTP-Method**, `PUT`.
	 * @type {HMETHOD}
	 */
	const 	PUT     = 'PUT';
	/** 
	 * The **HTTP-Method**, `DELETE`.
	 * @type {HMETHOD}
	 */
	const 	DELETE  = 'DELETE';
	/** 
	 * The **HTTP-Method**, `MIDDLEWARE`. 
	 * @type {HMETHOD}
	 */
	const 	MID     = 'MIDDLEWARE';

	const	METHODS = [
		GET, POST, PUT, DELETE, MID
	];

	global.__PTYPES__ = Imm.Map({});
	
/////////////////////////////////////////////////////////////////////////////////////////////
// PRIVATE FUNCTIONS

	/**
	 * Creates a `Property Descriptor` that prevents the **editing** & **configuring** of a `Class` Property
	 *
	 * @param   {any}      value The Property value
	 * @param   {Boolean} [isGetSet=false] `true`, if the Property if a `getter`/`setter`
	 * @returns {PropDesc} The `Property Descriptor`
	 * @private
	 */
	function LOCK(value, isGetSet = false) {
		let dprop = HIDDEN(value, isGetSet);
		// ----------------------------------------------------------
		return { ...dprop, ...{enumerable:true} };
	}

	/**
	 * Freeze an Object, if needed.
	 *
	 * @param {*} obj The Object to Freeze
	 * @param {Boolean} [all=false] `true`, if Freezing should be recursive
	 * @returns {object} The frozen Object
	 * @private
	 */
	function FREEZE(obj, all = false) {
		if (UoN(obj)) return obj;
		// ----------------------------------------------------------
		let iss = ISS(obj), iEN = OoA.has(iss), dfl, res;
		// ----------------------------------------------------------
			if (!iEN||iss=='function') return obj;
			if (!!obj.toJS) obj = obj.toJS();
			if (ISCONFIG(obj)||ISPTYPE(obj)) return obj;
		// ----------------------------------------------------------
			dfl = [{},[]][-(-(iss==OoA[1]))];
			res = Assign(dfl, obj);
		// ----------------------------------------------------------
			if (!!all) res = FromJS(res).map((v)=>(
				FREEZE(v, all)
			)).toJS();
		// ----------------------------------------------------------
			return Object.freeze(res);
	}

	/**
	 * Determines if an Object is a Config
	 *
	 * @param {*} obj The Object to check
	 * @returns {Boolean}
	 * @private
	 */
	function ISCONFIG(obj) {
		return TPS.has(CNAME(obj));
	}

	/**
	 * Determines if an Object is a PType
	 *
	 * @param {*} obj The Object to check
	 * @returns {Boolean}
	 * @private
	 */
	function ISPTYPE(obj) {
		return CNAME(obj)=='PType';
	}
	
	/**
	 * Creates a unique ID for `PTypes`
	 *
	 * @returns {string} A unique identifier
	 * @private
	 */
	function IDPTYPE() {
		let make = ()=>(Math.random().toString(36).slice(2)), rslt = make();
		while (global.__PTYPES__.has(rslt)) { rslt = make(); }
		return rslt;
	}

	/**
	 * Grabs a Config-Type Class
	 *
	 * @param {string} name The name of the Config-Type Class
	 * @returns {GNConfig|RouteGN|RouteAU|RouteDB|GNHeaders|GNParam|GNDescr}
	 * @private
	 */
	function GETCONFIG(name) {
		return {
			GNConfig:	GNConfig,
			RouteGN:	RouteGN,
			RouteAU:	RouteAU,
			RouteDB:	RouteDB,
			GNHeaders:	GNHeaders,
			GNParam:	GNParam,
			GNDescr:	GNDescr,
		}[name];
	}

	/**
	 * **Checks** and then **Adds** the Property to this `Object`
	 *
	 * @param {String} name name The `name` of the Property
	 * @param {*} value value The Property `value`
	 * @param {String} type type The `type` the Property should be
	 * @param {Boolean} [required=true] `true`, if Property **must** be defined
	 * @param {Boolean} [noBind=true] if `true`, Property will **NOT** be bound to `this`
	 * @private
	 */
	function AddProperty(name, value, type, required = true, noBind = false) {
		let THS = this, bindable = (v)=>(!!!noBind&&!!v&&!!v.bind&&!ISPTYPE(v)); 
		if (value===undefined) { if (!!required) {
			THS.ThrowType(name, type, value, 'undefined'); 
		};	return; }
		THS.CheckTypes(name, value, type, required);
		if (bindable(value)) value = value.bind(THS);
		DEFINE(THS, { [name]: LOCK(FREEZE(value)) });
	}

	/**
	 * **Checks** the Property against a _specified_ `type`
	 *
	 * @param {String} name The `name` of the Property
	 * @param {*} value The Property `value`
	 * @param {String} type The `type` the Property should be
	 * @param {Boolean} [required=true] `true`, if Property **must** be defined
	 * @private
	 */
	function CheckTypes(name, value, type, required = true) {
		let THS = this, iss; 
		if (!!type) {
			if (ISS(type)=='string') type = [type];
			if (!!required || !UoN(value)) {
				iss = ISS(value);
				if (!type.has(iss)) {
					THS.ThrowType(name, type, value, iss);
				}
			}
		}
	}

	/**
	 * Throws a `TypeError` when a `type` requirement is not met
	 *
	 * @param {String} name The `name` of the Property
	 * @param {String} type The `type` the Property should have been
	 * @param {any}    value The failed `value`
	 * @param {String} actual The `type` the Value actual is
	 * @private
	 */
	function ThrowType(name, type, value, actual) {
		console.log('THIS:', this)
		let THS = this||{Name:''}, 
			PRP = { true:' p', false: 'P' },
			PFX = THS.Name||THS.Scheme||'',
			HDR = `${PFX}${PRP[!!PFX]}roperty, [${name}], must be `,
			BDY = (!!type ?
				`one of the following, <${type.join('> or <').toTitleCase()
				}>. Got <${actual.toTitleCase()}> (${value}) instead.` :
				`defined.`);
		throw new TypeError(`${HDR}${BDY}`); 
	}

/////////////////////////////////////////////////////////////////////////////////////////////
// PUBLIC FUNCTIONS

	/**
	 * A `callback` used in `Immutable`.`mergeWith`
	 *
	 * @param {*} oldVal The value of the original Object
	 * @param {*} newVal The value of the merging Object
	 * @returns {*}
	 * @memberof module:dffrnt.confs
	 */
	function MERGER(oldVal, newVal) {
		let onme = CNAME(oldVal), ocon = ISCONFIG(oldVal), otyp = ISPTYPE(oldVal),
			nnme = CNAME(newVal), ncon = ISCONFIG(newVal), ntyp = ISPTYPE(newVal);
		if (otyp || ntyp) { return newVal; };
		if (ocon && ncon && onme==nnme) {
			return new GETCONFIG(onme)(Assign(oldVal, newVal));
		};
		if (ocon && onme=='GNParam') {
			if (nnme=='array') return oldVal.AddVersion(newVal[0],     newVal[1]);
			if (nnme=='List' ) return oldVal.AddVersion(newVal.get(0), newVal.get(1).toJS());
		};
		return newVal;
	}

/////////////////////////////////////////////////////////////////////////////////////////////
// GENERAL CONFIGURATORS 

	/**
	 * Base Class for the Configurator Classes
	 * @private
	 */
	class GNConfig {

		/// CONSTRUCTOR /////////////////////////////////////////////////////////////////////

			constructor() {
				DEFINE(this, {
					AddProperty: HIDDEN(AddProperty.bind(this)),
					CheckTypes:	 HIDDEN( CheckTypes.bind(this)),
					ThrowType:	 HIDDEN(  ThrowType.bind(this)),
				});
			}

		/// PROCEDURES  /////////////////////////////////////////////////////////////////////

			/**
			 * **Checks** and then **Adds** the Property to this `Object`
			 *
			 * @param {String} name name The `name` of the Property
			 * @param {*} value value The Property `value`
			 * @param {String} type type The `type` the Property should be
			 * @param {Boolean} [required=true] `true`, if Property **must** be defined
			 * @param {Boolean} [noBind=true] if `true`, Property will **NOT** be bound to `this`
			 * @memberof module:dffrnt.confs.GNConfig
			 * @private
			 */
			AddProperty(name, value, type, required = true, noBind = false) {}

			/**
			 * **Checks** the Property against a _specified_ `type`
			 *
			 * @param {String} name The `name` of the Property
			 * @param {*} value The Property `value`
			 * @param {String} type The `type` the Property should be
			 * @param {Boolean} [required=true] `true`, if Property **must** be defined
			 * @memberof module:dffrnt.confs.GNConfig
			 * @private
			 */
			CheckTypes(name, value, type, required = true) {}

			/**
			 * Throws a `TypeError` when a `type` requirement is not met
			 *
			 * @param {String} name The `name` of the Property
			 * @param {String} type The `type` the Property should have been
			 * @param {any}    value The failed `value`
			 * @param {String} actual The `type` the Value actual is
			 * @memberof module:dffrnt.confs.GNConfig
			 * @private
			 */
			ThrowType(name, type, value, actual) {}
	}

/////////////////////////////////////////////////////////////////////////////////////////////
// ROUTE CONFIGURATORS 

	/**
	 * A Query Configurator for `RouteDB`
	 *
	 * @extends {RouteGN}
	 * @memberof module:dffrnt.confs
	 */
	class QueryGN extends GNConfig {
		/// CONSTRUCTOR /////////////////////////////////////////////////////////////////////

			/**
			 * Creates an instance of QueryGN.
			 * @param {(CFG.PNTS.Auth.Method|CFG.PNTS.Data.Method)} configs Config properties for the `QueryGN` object
			 * @constructor
			 */
			constructor({ Scheme, Merge = false, Limits, Doc, Query, Proc, Params, Parse, Key, Private = true } = configs) {
				super(); let THS = this, References = {};
				// --------------------------------------------------------------------------------- //
					THS.AddProperty('Scheme', Scheme||'/', ['string'],  false);
					THS.AddProperty('Merge',  Merge,  ['boolean','string'], true);
					THS.AddProperty('Limits', Limits, ['array'],   false);
				// --------------------------------------------------------------------------------- //
					THS.AddProperty('Doc', {Headers:{},...(Doc||{})}, ['object'], true);
					References = { ...References, ...(THS.Doc.Headers||{}) };
				// --------------------------------------------------------------------------------- //
					if (!!!Proc) {
						THS.CheckTypes('Query', Query, ['string','array','function'], true);
						THS.Query = Query; let iQRY = ISS(Query), iCNM = CNAME(Query);
						DEFINE(THS, { QisFunction: HIDDEN(iQRY=='function') });
						DEFINE(THS, { QisAsync:    HIDDEN(iCNM=='AsyncFunction') });
						DEFINE(THS, { QisArray:    HIDDEN(iQRY=='array') });
						// ------------------------------------------------------------------------- //
						THS.CheckTypes('Params', Params, ['object'], false);
						THS.Params = Params; References = { ...References, ...(Params||{}) };
					} else { // -------------------------------------------------------------------- //
						THS.AddProperty('Proc', Proc, ['object'], true);
						References = { ...References, ...((!!Proc&&!!Doc)?Doc.Params:{}) };
					}
				// --------------------------------------------------------------------------------- //
					DEFINE(THS, { References: HIDDEN(References) });
				// --------------------------------------------------------------------------------- //
					THS.AddProperty('Parse', Parse, ['function'], false, true);
					THS.AddProperty('Key', Key, ['string'], false);
				// --------------------------------------------------------------------------------- //
					THS.AddProperty('Private', !!Private, ['boolean'], true);
					// ----------------------------------------------------------------------------- //
					DEFINE(THS, { 
						Locked: {
							enumerable: false, configurable: true, 
							get() { return false; }
						} 
					});
				// --------------------------------------------------------------------------------- //
					
			}
		
		/// GET/SET     /////////////////////////////////////////////////////////////////////

			/**
			 * The base `path` of the `GNRoute`
			 * @type {string}
			 * @memberof module:dffrnt.confs.QueryGN
			 */
			get Base        (   ) { 
				return this._base||''; 
			}
			set Base        (val) { 
				let THS = this;
				THS.CheckTypes('_base', val, ['string'], true);
				DEFINE(THS, { _base: HIDDEN(val.toLowerCase()) });
			}

			/**
			 * The full `path` of the `GNRoute`
			 * @type {string}
			 * @memberof module:dffrnt.confs.QueryGN
			 */
			get Path        (   ) { 
				return this._path; 
			}
			set Path        (val) { 
				if (!!this._path) return;
				// -------------------------------------------------------- //
				let THS = this, base = THS.Base, param,
					fmt = (...v)=>sls(['/',...v].join('/')),
					sls = (v)=>v.replace(/\/+/g,'/');
				// -------------------------------------------------------- //
				THS.CheckTypes('_path', val, ['string'], true);
				param = QueryGN.GetParamScheme(val);
				// -------------------------------------------------------- //
				DEFINE(THS, { 
					_path: 		HIDDEN(fmt(base,val)),
					_pathTemp: 	HIDDEN(fmt(base,param)),
					_pathMatch: HIDDEN(
						new RegExp([ '', base,
							val	.slice(1,-1)
								.replace(/\/{2,}/g,'')
								.replace(/(\/[^\w\s]+)\//g,'$1')
								.replace(/([^\\])\//g,'$1\\/')
								.replace(/(^|\?:|[\/(]|[|]):\w+(?=[(])/g,'$1')
								.replace(/^(.+)$/,'(?:$1)')
						].join('\\/'))
					),
				});
			}

			/**
			 * A digestible scheme pattern
			 * @type {string}
			 * @memberof module:dffrnt.confs.QueryGN
			 */
			get PathTemplate(   ) { 
				return this._pathTemp; 
			}

			/**
			 * A `RegExp` pattern to match this scheme
			 * @type {RegExp}
			 * @memberof module:dffrnt.confs.QueryGN
			 */
			get PathMatcher(   ) { 
				return this._pathMatch; 
			}

		/// FUNCTIONS   /////////////////////////////////////////////////////////////////////

			/**
			 * Locks the current configuration, permanetly.
			 * @private
			 */
			Lock() {
				let THS = this; if (THS.Locked) return;
				// ---------------------------------------------------------------------------------- //
					function CleanQRY(func) {
						let F = func.toString(), 
							M = /^.*?(Query.+)/, 
							T = F.split("\n").slice(-1)[0].match(/^(\s+|)/)[0],
							G = new RegExp(`^${T}`,'gm'), 
							R = 'async function $1';
						return F.replace(M,R).replace(G,'');
					};
					function FormatQRY(query) { 
						var R = '', Q = query; switch(true) {
							case THS.QisFunction: return CleanQRY(Q.toString());
							case THS.QisArray: return Q.join("\n").replace("\t","");
							default: return R;
						};
					};
				// Handle Query --------------------------------------------------------------------- //
					THS.AddProperty('Query', FormatQRY(THS.Query), ['string'], true);
				// Handle Param --------------------------------------------------------------------- //
					THS.AddProperty('Params', THS.Params, ['object'], true);
				// Handle Lock ---------------------------------------------------------------------- //
					DEFINE(THS, { Locked: HIDDEN(true) });
			}

		/// STATICS     /////////////////////////////////////////////////////////////////////

			/**
			 * Creates a digestible scheme pattern
			 * @param {(string|RegExp)} path The path pattern to convert
			 * @return {string}
			 * @memberof module:dffrnt.confs.QueryGN
			 */
			static GetParamScheme(path) {
				let mtch = 	path.coalesceMatch(/[(]/g,['']),
					rslt = 	mtch.reduce(
								(a)=>(a.replace(/\((?:[^(:)]|:(?!\w))*\)/g,'')),
								path.replace(/([(])\?[:=!]/g,'(').replace(/[(]\?:/g,'(')
							)
							.coalesceMatch(/^.*$/,[''])
							.map(s=>(s.coalesceMatch(/[(]/g,[s]).reduce(
								a=>a.replace(/[(]+([\/\w:_-]+[|][\/\w:_-]+)(?:(\?)|\))+[)]/g,'($1)$2')
									.replace(/[(]([^(|)]+)[)]/g,'$1'), s
								))	)
							.join('')
							.replace(/\|\/:/g,'|:')
							.replace(/\/((?::[\w_-]+\b(?:[|]|(?=\/))){2,})\//g,'\/{$1}\/')
							.replace(/[{][^{}]+[}]/g,$0=>$0.replace(/\//g,'\\'))
							.replace(/[(]\/(:[^()]+\|[^()]+)[)]/g,'{$1}')
							.replace(/\/(:[\w_-]+\b)([?]|)(?=\/)/g,'\/{$1}$2')
							.replace(/\\/g, '\/')
							.replace(/\/+/g,'\/');
				return rslt;
			}
	}

	/**
	 * The Base Class for the Route Configurators
	 * @extends {GNConfig}
	 * @memberof module:dffrnt.confs
	 */
	class RouteGN extends GNConfig {
		/// CONSTRUCTOR /////////////////////////////////////////////////////////////////////

			/**
			 * Creates an instance of `RouteGN`.
			 * 
			 * @param {CFG.PNTS.General} configs Config properties for the `RouteGN` object
			 */
			constructor({ Methods, Sub, Scheme, Merge = false, Limits, Doc, GET, POST, PUT, DELETE, MID, Params, Parse, Key, Private = true, Links } = configs) {
				super(); let THS = this, QRY = { GET, POST, PUT, DELETE, MIDDLEWARE: MID };
				// --------------------------------------------------------------------------------- //
					THS.AddProperty('Methods', Methods, ['array'],  true );
					THS.AddProperty('Sub',     Sub||[], ['array'],  false);
				// --------------------------------------------------------------------------------- //
					THS.Methods
						.map(M => [M,QRY[M]])
						.filter(V => !!V[1])
						.map(V => {
							let M = V[0], Q = V[1];
							THS.CheckTypes(M, Q, ['function'], true); Q = Q();
							THS.CheckTypes(M, Q, ['object','string'], true); 
							if (!METHODS.has(Q)) {
								DEFINE(THS, { [M]: LOCK(new QueryGN({ 
									Scheme, Merge, Limits, Doc, Params, 
									Parse, Private, Key, ...Q
								}))	});
							} else {
								DEFINE(THS, { [M]: LOCK({
									get() { return THS[Q]; }
								},	true) })
							}
						});
				// --------------------------------------------------------------------------------- //
					THS.AddProperty('Links',  Links,  ['array'], 	false);
				// --------------------------------------------------------------------------------- //
					DEFINE(THS, { Locked: {
						enumerable: false, configurable: true, 
						get() { return false; }
					} });
			}

		/// FUNCTIONS   /////////////////////////////////////////////////////////////////////

			/**
			 * Locks the current configuration, permanetly.
			 * @private
			 */
			Lock() {
				DEFINE(THS, { Locked: HIDDEN(true) });
			}
	}

	/**
	 * A Route Configurator for `AURequests`
	 *
	 * @extends {RouteGN}
	 * @memberof module:dffrnt.confs
	 */
	class RouteAU extends RouteGN {
		/// CONSTRUCTOR /////////////////////////////////////////////////////////////////////

			/**
			 * Creates an instance of RouteAU.
			 * @param {CFG.PNTS.Auth.Route} configs Config properties for the `RouteAU` object
			 */
			constructor({ Methods, Sub, Scheme = '', Merge = false, Limits, Doc, GET, POST, PUT, DELETE, MID, Private = true } = configs) {
				super({ Methods, Sub, Scheme, Merge, Limits, Doc, GET, POST, PUT, DELETE, MID, Private });
			}
	}

	/**
	 * A Route Configurator for `DBRequests`
	 *
	 * @extends {RouteGN}
	 * @memberof module:dffrnt.confs
	 */
	class RouteDB extends RouteGN {
		/// CONSTRUCTOR /////////////////////////////////////////////////////////////////////

			/**
			 * Creates an instance of RouteDB.
			 * @param {CFG.PNTS.Data.Route} configs Config properties for the `RouteDB` object
			 */
			constructor({ Methods, Sub, Scheme = '/', Merge = false, Limits, Doc, GET, POST, PUT, DELETE, Params, Parse, Key, Private = true, Links } = configs) {
				super({ Methods, Sub, Scheme, Merge, Limits, Doc, GET, POST, PUT, DELETE, Params, Parse, Key, Private, Links });
			}

		/// STATICS     /////////////////////////////////////////////////////////////////////

			/**
			 * A blank `RouteDB` object, used for Routes that are really just Namespaces 
			 *     for other Routes. These Routes are never actually implemented.
			 * @param {String[]} [Sub] A list of the heirarchy the `DBRequest` belongs under.
			 * @returns {RouteDB}
			 */
			static Namespace(Sub) { 
				let desc = { isNamespace: HIDDEN(true) },
					nmsp = new RouteDB({
						Scheme: 	'/',
						...(!!Sub ? { Sub: Sub } : {}),
						Methods: 	_Defaults.toJS().Kinds.GET,
						GET 		() { return { 
							Doc: 	{
								Headers: 	{},
								Examples: 	{},
							},
							Query() { return [
								new Error('This not an EndPoint'),
								null
							]; },  
							Params: {},
						};	},
						Links: 		[]
					});
				DEFINE(nmsp, desc); DEFINE(nmsp.GET, desc);
				return nmsp;
			}
	}

/////////////////////////////////////////////////////////////////////////////////////////////
// HEADER CONFIGURATORS 

	/**
	 * A Collection of `GNDescr` Objects for Headers
	 * @extends {GNConfig}
	 * @memberof module:dffrnt.confs
	 */
	class GNHeaders extends GNConfig {
		/// CONSTRUCTOR /////////////////////////////////////////////////////////////////////
			
			/**
			 * Creates an instance of `GNHeaders`.
			 * @param {CLHeaders} headers
			 */
			constructor(headers = {}) {
				super(); let THS = this;
				// -------------------------------------------------------------------
					Imm.Map(headers).map((v,k) => (
						console.log(v),
						THS.AddProperty(k, v, ['object'], false),
						console.log(THS[k])
					)	);
			}

	}

/////////////////////////////////////////////////////////////////////////////////////////////
// PARAM CONFIGURATORS 

	/**
	 * A Parameter Configurator for `GNRequest` Objects
	 * @extends {GNConfig}
	 * @memberof module:dffrnt.confs
	 */
	class GNParam extends GNConfig {
		/// CONSTRUCTOR /////////////////////////////////////////////////////////////////////

			/**
			 * Creates an instance of GNParam.
			 * @param {CFGParam} configs Config properties for the `GNParam` object
			 */
			constructor({ Name, Aliases = [], Default, Format, Desc } = configs, Main) {
				super(); let THS = this, hideDefault = false;
				// -------------------------------------------------------------------
					if (CNAME(Default).has('Function')) {
						hideDefault = true; Default = Default();
					};	
					DEFINE(THS, { hideDefault: LOCK(hideDefault) });
				// -------------------------------------------------------------------
				if (!!!Main) {
					// ---------------------------------------------------------------
						THS.AddProperty('Name',    Name,    ['string'],   true);
						THS.AddProperty('Aliases', Aliases, ['array'],    true);
						THS.AddProperty('Default', Default,   null,   	  true);
						THS.AddProperty('Format',  Format,  ['function'], true);
					// ---------------------------------------------------------------
						THS.CheckTypes( 'Desc',    Desc,    null,         true);
						DEFINE(THS, { Desc: LOCK(THS.AddDesc(Desc)) });
					// ---------------------------------------------------------------
						DEFINE(THS, { Version: LOCK({}) });
				} else {
					// ---------------------------------------------------------------
						let { Name: MName, Default: MDflt, Format: MFrmt } = Main;
						DEFINE(THS, {
							Name: 	 LOCK(FREEZE(!!Name ? Name : MName )),
							Aliases: LOCK(FREEZE(Main.Aliases)),
						});
						DEFINE(THS, {
							Default: LOCK(FREEZE(Default!==undefined ? Default : MDflt)),
							Format:  LOCK(!!Format ? Format : MFrmt.bind(THS)),
							Desc: 	 LOCK(THS.AddDesc(Desc, Main))
						});
				}
			}

		/// PROCEDURES  /////////////////////////////////////////////////////////////////////

			/**
			 * Helper for adding `GNDescr` objects
			 *
			 * @param {(GNDescr|CFGDescr)} descr A `CFGDescr` object or `CFGDescr` config describing the Param
			 * @param {GNParam} [main] An optional `GNParam` to use as a template
			 * @returns {CFGDescr} The prepared `CFGDescr`
			 * @memberof module:dffrnt.confs.GNParam
			 * @private
			 */
			AddDesc(descr, main) {
				let THS = this, cname = CNAME(descr), res,
					MDC = !!main?main.Desc.toCopy():null,
					TYP = ['GNDescr','Object'];
				// ------------------------------------------------------------------
					if (!TYP.has(cname)&&!!!MDC) return;
				// ------------------------------------------------------------------
					switch (cname) {
						case TYP[0]: res = descr; break;;
						default: 	 res = (!!!MDC ? 
								new GNDescr(descr) : (
									!!descr ? MDC.Merge(descr||{}) : MDC
							)	);
					};
				// ------------------------------------------------------------------
					if (!!!res) return;
				// ------------------------------------------------------------------
					return res.Hydrate(THS.Name);
			}

			/**
			 * Allows one to add another version of the `GNParam`
			 *
			 * @param   {string}   version A string to represent this Version
			 * @param   {CFGParam} configs Config properties for the `GNParam` object
			 * @param   {string}   use A string specifying a version to derive from
			 * @param   {boolean}  derived If `true`, specifies that this Param is to be treated as a different Param
			 * @returns {GNParam}  The current `GNParam`, for chanining purposes
			 * @memberof module:dffrnt.confs.GNParam
			 */
			AddVersion(version, { Name, Default, Format, Desc } = configs, use, derived = false) {
				let THS = this, THT = ((!!use?THS.Version[use]:THS)||THS);
				// -------------------------------------------------------------------
					DEFINE(THS.Version, { [version]: LOCK(
						new GNParam({ Name, Default, Format, Desc }, THT)
					) 	}	);
				// -------------------------------------------------------------------
					DEFINE(THS.Version[version], { 
						Derived: LOCK(!!derived) 
					});
				// -------------------------------------------------------------------
					return THS;
			}

		/// FUNCTIONS   /////////////////////////////////////////////////////////////////////

			/**
			 * A `OpenAPI` representation of this Param
			 * @param {string} name An optional Name to give the Param
			 * @returns {DocParam} An **OpenAPI 3.0** formatted, plain-object version of a `GNDescr`.
			 */
			toDoc(name) {
				let THS = this, 
					hdf = !!THS.hideDefault,
					doc = (!!THS.Desc.toDoc ? THS.Desc.toDoc() : (THS.Desc||{})),
					def = ((!!THS.Default&&!hdf)?{default:THS.Default}:{});
				doc.schema = { ...doc.schema, ...def };
				delete doc.matches; return { 
					in: doc.in, 
					name: (name||THS.Name).toLowerCase(), 
					required: !!doc.required, 
					schema: doc.schema, 
					description: doc.description, 
				};
			}

	}

	/**
	 * A Parameter Description Documenter for `GNParams` or `GNHeaders`
	 * @extends {GNConfig}
	 * @memberof module:dffrnt.confs
	 */
	class GNDescr extends GNConfig {
		/// CONSTRUCTOR /////////////////////////////////////////////////////////////////////

			/**
			 * Creates an instance of GNDescr.
			 * @param {CFG.PNTS.Descr} configs Config properties for the `GNDescr` object
			 */
			constructor({ type, description, required, hidden = false, matches, to } = configs) {
				super(); let THS = this;
				// -------------------------------------------------------------------
					THS.AddProperty('type', type, null, true);
					THS.AddProperty('required', required, ['boolean','null'], true);
				// -------------------------------------------------------------------
					THS.AddProperty('hidden',    !!hidden,      ['boolean'],  true);
					THS.AddProperty('to',          to,          ['string'],   true);
				// -------------------------------------------------------------------
					THS.CheckTypes('description',  description, ['string'],   true);
					THS.description = description;
				// -------------------------------------------------------------------
					THS.CheckTypes('matches',      matches,     ['object'],  false);
					THS.matches = matches;
				// -------------------------------------------------------------------
					DEFINE(THS, { _templates: LOCK({ description, matches })});
			}

		/// FUNCTIONS   /////////////////////////////////////////////////////////////////////

			/**
			 * Set the full Parameter-Name this instance describes
			 * @param   {String}  name The full-name of the Param
			 * @returns {GNDescr} This instance, for chaining
			 * @private
			 */
			Hydrate(name) {
				let THS = this, { description:descr, matches:match } = THS._templates;
				// Functions ---------------------------------------------------------
					function Hydrate(text) {
						let rgx = /<<([A-Z]+)>>/g;
						return text.replace(rgx, ($0, $1)=>{
							let prop = $1.toLowerCase();
							return THS.hasOwnProperty(prop) ?
								THS[prop] : $0
						});
					}
				// Name --------------------------------------------------------------
					THS.AddProperty('name',name,['string'],true);
				// Description -------------------------------------------------------
					THS.AddProperty('description',Hydrate(descr),['string'],true);
				// Matches -----------------------------------------------------------
					if (!!match) {
						Imm.OrderedMap(match).map((V,K) => {
							let key = Hydrate(K), val = Hydrate(V);
							match[key] = val; (key!=K) && delete match[K];
						});
						THS.AddProperty('matches', match, ['object'], true);
					}
				// Exit --------------------------------------------------------------
					return THS;
			}

			/**
			 * Creates a new `GNDescr` version by merging the specified configs.
			 * @param {CFGDescr} configs Config properties for the GNDescr object
			 */
			Merge(configs) {
				let THS = this, 
					{ type, required, hidden, to, _templates } = THS, 
					{ description, matches } = _templates;
				return new GNDescr(FromJS({ 
					type, description, required, hidden, matches, to 
				}).mergeDeep(FromJS(configs)).toJS())
			}

			/**
			 * Creates a `deepcopy` of this GNDescr instance.
			 * @returns {GNDescr} A clone of the `GNDescr`.
			 */
			toCopy() {
				let THS = this, { type, required, hidden, to, _templates } = THS, { description, matches } = _templates;
				return new GNDescr(FromJS({ type, description, required, hidden, matches, to }).toJS());
			}

			/**
			 * A plain-object representation of this Description
			 * @returns {DocDescr} An **OpenAPI 3.0** formatted, plain-object version of a `GNDescr`.
			 */
			toDoc() {
				let { type, description, required, matches, to } = this;
				return { 
					in: to, description, required, 
					schema: !!type.toDoc ? type.toDoc() : type, 
					matches 
				};
			}

	}

/////////////////////////////////////////////////////////////////////////////////////////////
// PARAM TYPES

	/**
	 * Base Class for the `PTypes`
	 * @extends {Function}
	 * @augments CFG.PNTS.PTOpts
	 * @memberof module:dffrnt.confs
	 * @kind class
	 */
	class PType extends Function {
		/// CONSTRUCTOR /////////////////////////////////////////////////////////////////////

			/**
			 * Creates an instance of PType.
			 * @param {CFG.PNTS.PTOpts} configs A config `object` for `PTypes`
			 */
			constructor({ name, type, sanitizers, iterable = false } = configs) {
				let PTID = IDPTYPE(), argsf = {}, argsd = [
						['restricted', false], ['selects', 	 null],
						['omit', 	    null], ['separator',  ';'],
						['sort', 	   false], ['tags', 	 null],
						['map', 	    null], ['join', 	 null],
						['enclose',     null], ['slice', 	 null],
						['leveled',    false], ['grouped', 	false], ['step',     1],
						['min',    -Infinity], ['max', 	 Infinity], 
						['regex',       null], ['hidden',   false],
					];	argsd.map((v)=>(argsf[v[0]]=undefined));
				// ------------------------------------------------------------------------
					super(...PType.toArgs(PTID, argsf));
					// --------------------------------------------------------------------
					global.__PTYPES__ = global.__PTYPES__.set(PTID, this);
				// ------------------------------------------------------------------------
					DEFINE(this, {
						AddProperty: HIDDEN(AddProperty.bind(this)),
						CheckTypes:	 HIDDEN( CheckTypes.bind(this)),
						ThrowType:	 HIDDEN(  ThrowType.bind(this)),
					});
				// ------------------------------------------------------------------------
				let THS = this, defaults = {
						iterable: 	function sanitize(v) { 
							let THS  = this,
								desc = 	'desc',
								sani = 	THS.cycle,
								fltr = 	(v)=>(!UoN(v)),
								lvlc =  (l)=>(l.reduce((p,c)=>(p+c.length),0)),
								sort = 	(THS.type=="Number" ? (a,b)=>{ 
											let R = /[^\d.]/g,
												A=Number((a||'').toString().replace(R,'')),
												B=Number((b||'').toString().replace(R,'')); 
											return (A>B?1:(A<B?-1:0));
									   	} : (a,b)=>(a>b?1:(a<b?-1:0))),
								rems = 	(v)=>(!!v&&(!!!v.K||!!!v.V)),
								edts = 	(v)=>(!!v&&(!!v.K&&!!v.V)),
								sepr = 	THS.separator,
								kind = 	CNAME(v),
								list;
							// ---------------------------------------------------
							if (UoN(sani)) return null;
							// ---------------------------------------------------
							if (THS.grouped) {
								let rgx = /\b((?:[^@;]|\\[;@])+)@((?:[^@;]|\\[;@])+)(?=;|$)/g,
									rep = (o)=>((M,K,V)=>(!!!o[K]&&(o[K]=[]),o[K]=o[K].concat(V))),
									obj = {};
								(v||'').toString().replace(rgx,rep(obj)); 
								// return FromJS(obj).map(v=>v.map(sani).filter(fltr)).toJS();
								return FromJS(obj).map(v=>v.map(sani)).toJS();
							} else switch (kind) {
								case  'Array': list =Imm.List(v); break;;
								case 'Object': list =Imm.Map(v);  break;;
									  default: list =Imm.List((fltr(v)?v:'')
														.toString()
														.split(sepr));
							}; 
							// ---------------------------------------------------
							if (!!THS.leveled) {
								list = list.map(sani);
								list = [
									list.filter(edts).toJS(), 
									list.filter(rems).toJS(),
								]; 
								list = (lvlc(list)==0?null:list);
							} else {
								list = list.map(sani).filter(fltr).toJS();
								// -----------------------------------------------
								if (!!THS.sort) { 
									list = list.sort(sort);
									if (THS.sort==desc) list = list.reverse();
								}
								// -----------------------------------------------
								if (!!THS.slice) list = list.slice(...THS.slice);
								// -----------------------------------------------
								if (!!THS.map) list = list.map(THS.map.bind(THS));
								// -----------------------------------------------
								if (!UoN(THS.join)) {
									list = list.join(THS.join);
									if (!!THS.enclose) {
										let e = THS.enclose;
										list = `${e[0]}${list}${e[1]}`;
									}
								}
							};
							// ---------------------------------------------------
							return ((list||[]).length ? list : null);
						},
						custom: 	function sanitize(v) {
							let THS = this, val = THS.cycle(v);
							/* if (!!THS.regex) {
								console.log({
									rgx: THS.regex, val,
									res: ((val||'').toString().match(THS.regex)||[null])[0],
								})
								return ((val||'').toString().match(THS.regex)||[null])[0];
							} else {
								return val;
							} */
							return val;
						}
					};	
					iterable 	= !!iterable;
					sanitizers	= ISS(sanitizers)=='array' ? sanitizers : [sanitizers];
				// -----------------------------------------------------------------------
					DEFINE(THS, { 
						args:		HIDDEN(argsd),
						name: 		HIDDEN(name),
						type: 		HIDDEN(type),
						iterable: 	HIDDEN(iterable),
						sanitizers: HIDDEN(sanitizers),
						sanitize: 	HIDDEN(iterable ?  
							defaults.iterable.bind(THS) : 
							defaults.custom.bind(THS)
						),
						cycle: 		HIDDEN(THS.cycle.bind(THS)),
					});
				// -----------------------------------------------------------------------
					argsd.map((v)=>(THS[v[0]]=v[1]));
			}

		/// PROCEDURES  /////////////////////////////////////////////////////////////////////

			/**
			 * **Checks** and then **Adds** the Property to this `Object`
			 *
			 * @param {String} name name The `name` of the Property
			 * @param {*} value value The Property `value`
			 * @param {String} type type The `type` the Property should be
			 * @param {Boolean} [required=true] `true`, if Property **must** be defined
			 * @param {Boolean} [noBind=true] if `true`, Property will **NOT** be bound to `this`
			 * @private
			 */
			AddProperty(name, value, type, required = true, noBind = false) {}

			/**
			 * **Checks** the Property against a _specified_ `type`
			 *
			 * @param {String} name The `name` of the Property
			 * @param {*} value The Property `value`
			 * @param {String} type The `type` the Property should be
			 * @param {Boolean} [required=true] `true`, if Property **must** be defined
			 * @private
			 */
			CheckTypes(name, value, type, required = true) {}

			/**
			 * Throws a `TypeError` when a `type` requirement is not met
			 *
			 * @param {String} name The `name` of the Property
			 * @param {String} type The `type` the Property should have been
			 * @private
			 */
			ThrowType(name, type, actual) {}

		/// FUNCTIONS   /////////////////////////////////////////////////////////////////////

			/**
			 * A Unique-Identifier for the Type
			 * @param {?string} [name] Add a Type-Name to the Unique-Identifier
			 * @param {?any} [dflt] A default-value. If set, will assume a Type-Name is needed
			 * @returns {string} The unique identifier
			 */
			unique(name, dflt) { 
				let THS  =  this, type,
					INF  =  [Infinity,-Infinity],
					IXN  =  (v)=>(UoN(v)||INF.has(v)),
					IST  =  (v)=>(UoN(v)||v==1),
					iter =  (!!THS.iterable?'@':''),
					cust =  !!(THS.selects||THS.pattern||dflt||THS.hidden),
					typs =  {
						'String'  : 'S', 'Boolean' : 'B',
						'Number'  : 'N', 'Object'  : 'O',
					},
					donm =  (cust&&!!name&&![THS.name].has(name)),
					dist =  {
						HD: ()=>(!!THS.hidden?'?':null),
						GP: ()=>(!!THS.grouped?'&':null),
						LV: ()=>(!!THS.leveled?'#':null),
						MN: ()=>(!IXN(THS.min)?`>${THS.min}`:null),
						ST: ()=>(!IST(THS.step)?`x${THS.step}`:null),
						MX: ()=>(!IXN(THS.max)?`<${THS.max}`:null),
					},
					stff =  Object.keys(dist)
								 .map(d=>(dist[d]()))
								 .filter(d=>!!d),
					prop =  (stff.length ? [
								':', stff.join('|')
							] : []);
				// -------------------------------------------------------- 
					name =  `:${(donm?`${name}:`:'')}${THS.name}`;
					type =  [`${typs[THS.type]}${iter}${name}`];
				// -------------------------------------------------------- 
					return  `Type(${type.concat(prop).join('')})`; 
			}

			/**
			 * Restricts a value to a `RegexP` pattern specified at instantiation
			 * @param   {any} value The value to match
			 * @returns {any} The specified value
			 * @private
			 */
			matcher(value) {
				if (UoN(value)) return null;
				let THS = this, val = (value||''), mch;
				mch = val.toString().match(THS.regex);
				return !!mch ? value : null;
			}

			/**
			 * Restricts a value to a list specified at instantiation
			 * @param   {any} value The value to restrict
			 * @returns {any} The sanitized value
			 * @private
			 */
			selector(value) {
				let THS = this,
					wch = (v)=>(ISS(v)=='object'),
					get = (v)=>(wch(v)?v.value:v),
					flt = (v)=>(val===get(v)),
					val = THS.omit.has(value)?'':value,
					chk = THS.selects.filter(flt).length>0;
				return !!chk ? val : null; 
			}

			/**
			 * Cycles through the sanitization processes
			 * @param   {any} value The value to sanitze
			 * @returns {any} The sanitized value
			 * @private
			 */
			cycle(value) {
				let THS = this, 
					san = THS.sanitizers, dfl = (v)=>(v),
					rgx = [(!!THS.regex   ? THS.matcher  : dfl)],
					slc = [(!!THS.selects ? THS.selector : dfl)],
					cyc = [...rgx,...san,...slc].map(v=>v.bind(THS)),
					res = cyc.reduce((v,sn)=>(sn(v)),value);
				return res;
			}

			/**
			 * Extends the current `PType`, producing a new one with modifications.
			 * @param {CFGPType} configs A config `object` for `PTypes`.
			 * @returns {PType} The newly-customized `PType`.
			 */
			extend({ name, type, sanitizers, iterable } = configs) {
				let THS = this, arr = (s)=>(ISS(s)=='array'?s:[s]), THT;
				// -----------------------------------------------------------------------
					THT = new PType({ 
						name: 		name || THS.name, 
						type:		type || THS.type, 
						sanitizers:	THS.sanitizers.concat(arr(sanitizers)).filter(v=>!!v), 
						iterable:	!UoN(iterable) ? iterable : THS.iterable, 
					});
				// -----------------------------------------------------------------------
					THS.args.map((v)=>(THT[v[0]]=THS[v[0]]));
				// -----------------------------------------------------------------------
					return THT;
			}

			/**
			 * Self-explanitory...
			 * @returns {string}
			 */
			toString() {
				return `${this.name} ${JSN.Normal(this.toDoc())}`;
			}

			/**
			 * Displays a Documentation 
			 * @returns {DocPType<TPDocPrims,boolean>} A plain-object version of a `PType`.
			 */
			toDoc () {
				let THS  = this,
					INF  = [Infinity,-Infinity],
					IXN  = (v)=>(UoN(v)||INF.has(v)),
					IST  = (v)=>(UoN(v)||v==1);
				// ---------------------------------------------------
				/**
				 * Formats a _non-interable_ primitive `PType`.
				 * @param {DocPType<TPDocPrims,boolean>} obj The format object
				 */
				function Mark(obj) {
					if (THS.restricted) {
						if (THS.type=="String") {
							obj.type = 'string';
							if (!UoN(THS.regex)) obj.pattern  = THS.regex.toString();
							if (!!THS.hidden) obj.format = 'password';
						};
						if (THS.type=="Number") {
							obj.type = 'integer';
							if (!IXN(THS.min )) obj.minimum    = THS.min;
							if (!IXN(THS.max )) obj.maximum    = THS.max;
							if (!IST(THS.step)) obj.multipleOf = THS.step;
						};
						if (!!THS.selects) {
							obj.enum = THS.selects.map(s=>(
								ISS(s)=='object' ? s.value : s
							));
						}
					};
				}
				// -------------------------------------------------------
				/** @type {DocPType<TPDocPrims,boolean>} */
				let obj = { type: THS.type.toLowerCase() };
				if (THS.restricted||THS.iterable) {
					// ---------------------------------------------------
					if (THS.iterable) {
						obj.type  = 'array';
						obj.items = { type: THS.type };
						Mark(obj.items);
						if (!!THS.slice && THS.slice.length>0) {
							obj.minItems = THS.slice[0];
							if (THS.slice.length>1) { 
								obj.maxItems = THS.slice[1];
						};	}
					} else {
						Mark(obj);
					};
					// ---------------------------------------------------
				};	return obj;
			}

		/// STATICS     /////////////////////////////////////////////////////////////////////

			/**
			 * Prepares args to  pass to the `Base`
			 * @param {string} [id] A unique identifier for the `PType` `call`
			 * @param {CFGPTypeFN} [args] The `arguments` to format
			 * @returns {string[]} An `String`-representation of the function's **arg**.
			 * @private
			 */
			static toArgs(id, args) {
				let INFY = [Infinity,-Infinity],
					mapr = (v,k)=>`${k} = ${INFY.has(v)?v:JSON.stringify(v)}`,
					rslt = Imm.OrderedMap(args).map(mapr).toArray(),
					keys = Object.keys(args), 
					dlim = ', ', spce = '    ',
					func = [
						`{ ${rslt.join(dlim)} }`, spce+[
							`let THS = global.__PTYPES__.get('${id}'),`,
							`    TTP = PType.toType.bind(THS);`,
							`return TTP({ ${keys.join(dlim)} });`
						].join(`\n${spce}`).trimLeft()
					];
				return func;
			}

			/**
			 * Creates an instance of a custom `PType`
			 * @param {CFGPTypeFN} configs A customizer `object` for `PTypes`
			 * @return {PType} An extended version of this `PType`.
			 * @private
			 */
			static toType({ 
				selects, omit, separator, 
				sort, slice, tags, map, join, enclose,
				leveled, grouped, 
				step, min, max, regex, hidden = false
			} = configs) {
				let THS = this, THT = THS.extend({});
				// ------------------------------------------------------------------- //
					THT.AddProperty('restricted', true, ['boolean'], false);
					THT.AddProperty('grouped', grouped, ['boolean'], false);
					THT.AddProperty('hidden', !!hidden, ['boolean'],  true);
				// ------------------------------------------------------------------- //
					THT.AddProperty('selects', selects, ['array'],   false);
					if (!!selects) { 
						THT.AddProperty('omit', omit||[], ['array'],   false);
					}
				// ------------------------------------------------------------------- //
					THT.AddProperty('tags', tags, ['array'], false);
					if (THT.iterable) {
						THT.AddProperty('separator', separator, ['string'],   false);
						THT.AddProperty('leveled',   leveled,   ['boolean'],  false);
						THT.AddProperty('sort',  	 sort,   	['boolean','string'], false);
						THT.AddProperty('slice',   	 slice,   	['array'],    false);
						THT.AddProperty('map',   	 map,   	['function'], false,   true);
						THT.AddProperty('join',   	 join,   	['string'],   false);
						// ----------------------------------------------------------- //
						if (!UoN(THT.join)&&!!enclose) {
							THT.CheckTypes('enclose', enclose, ['array'], true);
							enclose = enclose.slice(0,2);
							enclose = enclose.concat(enclose.length==1?enclose:[]);
							THT.AddProperty('enclose', enclose, ['array'], true);
						}
					};
				// ------------------------------------------------------------------- //
					if (THT.type=='Number') {
						THT.AddProperty('min',  min,  ['number'],  false);
						THT.AddProperty('max',  max,  ['number'],  false);
						THT.AddProperty('step', step, ['number'],  false);
					};
				// ------------------------------------------------------------------- //
					THT.AddProperty('regex',  regex, ['raw'], false);
				// ------------------------------------------------------------------- //
					return THT;
			}

	}; 
	global.PType = PType;

	// PRIMITIVES --------------------------------------------------------------------------------------------------------------------

		/**
		 * A collection of often-used `PTypes`.
		 * @memberof module:dffrnt.confs
		 */
		const PT = {
			/** 
			 * @type {PType} 
			 * @readonly 
			 */
			Text: 	new PType({ 
				name: 'Text', type: 'String', 
				sanitizers(v) { 
					return (UoN(v)?v:v.toString().replace(/'/g,"\\'")); 
				}
			}),
			/** 
			 * @type {PType} 
			 * @readonly 
			 */
			Num: 	new PType({ 
				name: 'Num', type: 'Number', 
				sanitizers: function(v) { 
					if (UoN(v)) return v;
					let { step=1, min=-Infinity, max=Infinity } = this, chk,
						iso = (v)=>((v.toString().match(rgx)||[])[1]),
						rgx = /^(?:\d+[^\s\w]|)(-?\d+(?:[.]\d+|))$/,
						val = iso(v), spd = 100;
					chk = (!isNaN(val) && CNAME(Number(val))=='Number');
					chk = chk && ((((val*spd)%(step*spd))/spd)==0);
					chk = chk && (val>=min&&val<=max);
					return chk ? v : null; 
				}
			}),
			/** 
			 * @type {PType} 
			 * @readonly 
			 */
			Bool: 	new PType({ 
				name: 'Bool', type: 'Boolean', 
				sanitizers: function(v) { 
					if (!!!v||(v||'').toString().has(['null','undefined'])) return false;
					let rgx = /^(true|false|1|0)$/, val = (v.toString()||'');
					return Boolean(eval((val.match(rgx)||['false'])[0])); 
				}
			}),
			/** 
			 * @type {PType}
			 * @readonly
			 */
			Obj: 	new PType({ 
				name: 'Obj', type: 'Object', 
				sanitizers: function(v) { 
					return CNAME(v)=='Object'?v:null;
				}
			}),
			/** 
			 * @type {CLPTypes}
			 * @readonly
			 */
			L:		{},
			/** 
			 * @type {CLPTypes}
			 * @readonly
			 */
			O:		{},
			/**
			 * Generates the Stock-Type Docs
			 * @private
			 */
			GenerateDocs  () {
				if (!!PT._docs) return;
				// ------------------------------------------
				let THS   = this,
					tget  = (w)=>(n)=>(w[n]),
					tadd  = (w)=>(t)=>(w[t.unique(t.name)]=t.toDoc()),
					ikey  = ['L','O'], omit = [
								'GenerateDocs','Docs','Examples'
							].concat(ikey),
					vals  = {}, iter = {};
				// ------------------------------------------
					Object	.keys(THS)
							.filter(t=>!omit.has(t))
							.map(tget(THS))
							.map(tadd(vals));
					ikey.map(i=>(
						Object	.keys(THS[i])
								.map(tget(THS[i]))
								.map(tadd(iter))
					));
				// ------------------------------------------
					DEFINE(THS, { _docs: LOCK({ 
						...vals, ...iter 
					}) });
			},
			/** 
			 * @type {Object<string,DocPType<TPDocPrims,boolean>>}
			 * @readonly
			 */
			get Docs      () {
				return this._docs;
			},
			/** 
			 * @type {string}
			 * @readonly
			 */
			get Examples  () {
				let txtSel = [{label:'M',value:'M'},{label:'F',value:'F'},{label:'I',value:'I'}],
					regxp  = /^[\w_.-]+@[\w_.-]+\.[A-z]+$/, examItems = [
						[PT.Int,5.5],
						[PT.Int({ min: 0, max: 4 }),5],
						[PT.L.Int,[5,'hello',10,3]],
						[PT.L.Int({ join: ',', enclose: ["'[","]'"] }),[5,'hello',10,3]],
						[PT.L.Int({ grouped: true }),"1;null;true;10;true;0"],
						[PT.L.Bool,'M','S'],
						[PT.Text({ selects: txtSel }),"I;S;M"],
						[PT.L.Text({ selects: txtSel }),'LG@142;LG@124;LC@321245'],
						[PT.Text({ regex: regxp }),'LG@142;VT@012011;LG@124;LC@321245'],
						[PT.L.Multi,'1@142;6@124;156',''],
						[PT.L.Leveled,'leshaun.john@icloud.com','@@icloud.com'],
						[PT.IP,'12.345.67.89','123.45.6.78',16843009,'::ffff:127.0.0.1'],
						[PT.IRange,'14;20;5;1000;80'],
						[PT.CRange({ tags: ['VC-','VC+'], min: 0.00, step: 0.10 }),'2,20;2,13.10'],
					];
				// ------------------------------------------------------------------------------------ //
					function Exam(main, ...examples) {
						let pfx = ' > > > ', sep = '\n    ',
							fmt = (v)=>(`${jsn(v)}${pfx}${jsn(san(v))}`),
							san = (v)=>(main.sanitize(v)),
							jsn = (v)=>(JSON.stringify(v)); 
						return `\n${main.name}: ${[JSN.Normal(
							main.toDoc())].concat(examples.map(
								fmt)).join(sep)}\n`;
					}
				// ------------------------------------------------------------------------------------ //
					return examItems.map(v=>Exam(...v)).join('');
			}
		};
		DEFINE(PT, {
			Text: 	LOCK(PT.Text),
			Num: 	LOCK(PT.Num),
			Bool: 	LOCK(PT.Bool),
			Obj: 	LOCK(PT.Obj),
			L: 		LOCK(PT.L),
			O: 		LOCK(PT.O),
			GenerateDocs: HIDDEN(Object.getOwnPropertyDescriptor(PT,'GenerateDocs').value),
			Docs: 		  HIDDEN(Object.getOwnPropertyDescriptor(PT,        'Docs').get, true),
			Examples: 	  HIDDEN(Object.getOwnPropertyDescriptor(PT,    'Examples').get, true),
		});
	// NUMBERS -----------------------------------------------------------------------------------------------------------------------
		PT.Int 	     = 	PT.Num.extend({ name: 'Int',     sanitizers: (v)=>{ let n = parseInt(v); return isNaN(n) ? null: n; } })({ step: 1 });
		PT.Float     = 	PT.Num.extend({ name: 'Float',   sanitizers: (v)=>{ let n = parseFloat(v); return isNaN(n) ? null: n; } })({ step: 0.1 });
		PT.Bitwise   = 	PT.Num.extend({ name: 'Bitwise', sanitizers: (v)=>{ return (!isNaN(v)&&v%8===0?v:null); } })({ step: 2 });
	// MATCHERS ----------------------------------------------------------------------------------------------------------------------
		PT.Token     = 	new PType({ name: 'Token', type: 'String', sanitizers(v) {
							let { head, user } = v; return head.token===user.token;
						}	});
		PT.Password  = 	PT.Text.extend({ name: 'Password', sanitizers(v) { return (v||'').length>=8 ? v : null; } })({ hidden: true });
		PT.TextArea  = 	PT.Text.extend({ name: 'TextArea', sanitizers(v) { return (v||'').replace(/\n/g, '\\n').replace(/\n/g, '\\n'); } });
		PT.NoWrap    = 	PT.Text.extend({ sanitizers(v) { return (v||'').replace(/[\n\r]+/g, ''); } });
		PT.NoSpace   = 	PT.Text.extend({ name: 'NoSpace' })({ regex: /^\S+$/ });
		PT.Date		 =  PT.Text.extend({ name: 'Date',  sanitizers(v) { try {
							let fyr = new Date().getFullYear(), mn = fyr-13, mx = fyr+120;
								rgx = /^(\d{4})-(0\d|1[0-2])-([0-2]\d|3[0-1])$/, 
								dtr = (v||''),
								dts = [...(dtr.match(rgx)||[])].slice(1), 
								dte = (!!dts?new Date(...dts):new Date()), 
								yrs = dte.getFullYear();
							if (!!dts && dts.length==4) (
									yrs>=mn&&yrs<=mx
								) && dts.shift()||(dts=[]);
							return dts.join('-'); 
						} catch (e) {} } })
		PT.Name 	 =  PT.Text.extend({ name: 'Name',  sanitizers(v) { return !!v ? v.toTitleCase() : null; } })({ regex: /^(?:\b[a-z-]+\b ?)+\b(?: (?:[sj]r.|[1-9]\d*(?:st|nd|rd|th)))?$/i });
		PT.URL 	 	 =  PT.Text.extend({ name: 'URL'    })({ regex: /^(?:https?:\/{2}|)(?:\b[\w_-]+\b\.|)\b[\w_-]+\b\.[a-z]{2,}(?:\/\b[\w_-]+\b)*(?:\?(?:\b[\w_-]+\b=\S+?(?:&|$))+|)$/i });
		PT.Path 	 =  PT.Text.extend({ name: 'Path'   })({ regex: /^\/?[\w_-]+(?:\/[\w_-]+)*\/?$/i });
		PT.IP 	 	 =  PT.Text.extend({ name: 'IP',    sanitizers(v) { 
							let ipLng = TLS.IP2Lng(v); return ((!!ipLng&&ipLng>=0&&ipLng<=4294967295) ? TLS.Lng2IP(v) : null);
						} 	});
		PT.Email     = 	PT.Text.extend({ name: 'Email'  })({ regex: /^[\w_.-]+@[\w_.-]+\.[A-z]+$/ });
		PT.Uname     = 	PT.Text.extend({ name: 'Uname'  })({ regex: /^[A-Za-z0-9_.-]+$/ });
		PT.MD5       = 	PT.Text.extend({ name: 'MD5'    })({ regex: /^[A-Fa-f0-9]+$/ });
		PT.Street	 =  PT.Text.extend({ name: 'Street' })({ regex: /^(?:[A-z0-9"\/˚#+-]+\b[?,.]?(?: \b|$))+$/ });
		PT.Place	 =  PT.Text.extend({ name: 'Place'  })({ regex: /^\b(?:[\w\d]|\b[% ,;.-]\b)+(?:\.|\b)$/ });
		/**
		 * @type {PType}
		 * @memberof PT
		 */
		PT.Postal	 =  PT.Text.extend({ name: 'Postal' })({ regex: /^\b(?:[A-Z0-9 -]){3,10}\b$/ });
		PT.Phone	 =  PT.Text.extend({ name: 'Phone'  })({ regex: /^(\+?\b[0-9( )-]+\b)$/ });
		PT.CCode	 =  PT.Text.extend({ name: 'CCode'  })({ regex: /^[A-Z]{2}$/ });
	// LISTS -------------------------------------------------------------------------------------------------------------------------
		PT.L.Text    = 	PT.Text .extend({ iterable: true });
		PT.L.Num     = 	PT.Num  .extend({ iterable: true });
		PT.L.Int     = 	PT.Int  .extend({ iterable: true });
		PT.L.Float   = 	PT.Float.extend({ iterable: true });
		PT.L.Bool    = 	PT.Bool .extend({ iterable: true });
		PT.L.Leveled = (new PType({ 
							name: 'Leveled', type: 'Number', 
							iterable: true,  sanitizers(v) {
								let THS  = this, 
									dflt = [null,null],
									sani = PT.Int.sanitize.bind(THS),
									splt = (v||'').split('@').concat(dflt).slice(0,2),
									val  = (sani(splt[1])||'').toString(),
									lvl  = (sani(splt[0])||'').toString(),
									edt  = !!lvl&&!!val,
									rem  = !!lvl&&!!!val;
								return (edt ? { 
									K: Number(val), V: Number(lvl) 
								} : (
									rem ? Number(lvl) : null
								));
							},
						}))({ leveled: true, min: 1 });
		PT.L.Multi   = (new PType({ 
							name: 'Multi', type: 'String', 
							iterable: true, sanitizers(v) {
								let THS  = this, 
									chk  = (o,n)=>(n.length==o.length),
									sani = PT.Int.sanitize.bind(THS),
									nxt  = sani(v),
									res  = (nxt||'').toString(),
									val  = (v||'').toString();
								return (chk(val, res) ? nxt : val );
							}	
						}))({ grouped: true });
	// RANGES ------------------------------------------------------------------------------------------------------------------------
		let rangeCfg = {
				sort: 'desc', tags: ['Max','Min'], map(v,i) { 
					let THS = this, tags = THS.tags;
					console.log(`RANGE ITEM: [${v}]`)
					return !!v?`,"${tags[i]}":${JSON.stringify(v)}`:''; 
				}, join: '', slice: [0,2],
			};
		// ---------------------------------------------------------------------------------------------------------------------------
		PT.IRange    =  PT.L.Int.extend({ name: 'IRange' })(rangeCfg);
		PT.CRange    =  PT.L.Num.extend({ name: 'CRange' })(rangeCfg);
	// DOCUMENT ----------------------------------------------------------------------------------------------------------------------
		PT.GenerateDocs();

/////////////////////////////////////////////////////////////////////////////////////////////
// DEFAULTS

	/**
	 * A collection of often-used groups of **HTTP-Methods**.
	 * @kind constant
	 * @memberof module:dffrnt.confs
	 */
	const _Methods  = { 
		GET:  [GET], POST: [POST], PUT: [PUT], DELETE: [DELETE], MID: [MID],
		GPOS: [GET,POST], GPUT: [GET,PUT], MPOS: [MID,POST],
		CUD:  [POST,PUT,DELETE], EDIT: [GET,POST,PUT],
		FULL: [GET,POST,PUT,DELETE],
		ALL:  [GET,POST,PUT,DELETE,MID],
	}

	/**
	 * A collection of often-used `HMETHODs` and `GNParams`.
	 * @kind namespace
	 * @memberof module:dffrnt.confs
	 */
	const _Defaults = FromJS({
		Kinds: 	 _Methods,
		Headers: { 
			Token: 	new GNParam({
				Name: 		'Token',
				Default:	'',
				Format		() {},
				Desc:		new GNDescr({ 
					type: PT.Token, 
					description: "The secret Token Key given upon Sign-Up", 
					required: true, to: 'header'
				}), 
			}),
		},
		Params:  {
			Single: 	new GNParam({
				Name:		'Single',
				Default: 	 false, 
				Format(cls) { return cls.single; },
				Desc: 	new GNDescr({
					type: PT.Bool,
					description: 'Return a {{Single}} {{User}} only',
					required: false, to: 'query', hidden: false
				})
			}),
			Visible: 	new GNParam({
				Name:		'Visible',
				Default:  	 true, 
				Format(cls) { return cls.visible; },
				Desc: 	new GNDescr({ 
					type: PT.Bool, 
					description: 'Toggle {{Visibility}} layer',
					required: false, to: 'query', hidden: false
				})
			}),
			Limit: 		new GNParam({
				Name:		'Limit',
				Default: 	10, 
				Format(cls) { return cls.limit; },
				Desc: 	new GNDescr({ 
					type: new PT.Int({ min: 0, max: 1000 }), 
					description: "The amount of items displayed per page",
					required: false, to: 'query', hidden: false
				})
			}),
			Page:  		new GNParam({
				Name:		'Page',
				Default: 	 1, 
				Format(cls) { return cls.page; },
				Desc: 	new GNDescr({ 
					type: new PT.Int({ min:  1 }), 
					description: "The page number of the given results",
					required: false, to: 'query', hidden: false
				})
			}),
			CliIP: 		new GNParam({
				Name:		'Client IP',
				Default: 	'0.0.0.0', 
				Format(cls) { return cls.cliip; },
				Desc: 	new GNDescr({
					type: PT.IP,
					description: 'Pass the {{Client IP}} the Request',
					required: true, to: 'query', hidden: true
				})
			}),
			ID: 		new GNParam({
				Name:		'ID',
				Default: 	'', 
				Format(cls) { return cls.element; },
				Desc: 	new GNDescr({ 
					type: PT.Text, 
					description: "A unique ID that is return with the result. This can be used for tracking purposes",
					required: false, to: 'query', hidden: true 
				})
			}),
			UUID: 		new GNParam({
				Name:		'User ID',
				Default: 	 null,
				Format(cls) { return (Number(cls.uuid)||'0').toString(); },
				Desc: 	new GNDescr({
					type: new PT.Int({ min:  1 }), description: 'A valid {{<<NAME>>}}', 
					matches: { '<<NAME>>': 'Matches the current User\'s {{<<NAME>>}} (([0-9]+))' },
					required: true, to: 'query', hidden: true
				})
			}),
		},
	});

/////////////////////////////////////////////////////////////////////////////////////////////
// EXAMPLES

	// var route = new RouteDB({
			// Scheme: 	'/:lids((?:\\d+)(?=;|$))?/',
			// Sub: 		null, 
			// Methods: 	['GET'], 
			// Doc: 		{ 
			// 	Headers: 	{ token: _Defaults.getIn(['Headers','Token']) },
			// 	Examples: 	{ 
			// 		"/:lid:312844": "Displays the {{Locale}} at the {{LID}}, 312844 (Calgary, Alberta, Canada)",
			// 		"?page=3&limit=10": "Displays the 3rd {{Page}} at a {{Limit}} of 'ten' {{Locales}} results per {{Page}}",
			// 	}, 
			// },
			// Query: 		[ 
			// 	`CALL prcGetMulti(1, "LC", :LIDS:, ':CONTEXT:', :LIMIT:, :PAGE:);`,
			// ], 
			// Params: 	{ 
			// 	Context: new GNParam({
			// 		Default: '{}', 
			// 		Format	 (cls) { 
			// 			let cntx = cls.context, o = {}, res;
			// 			if (!!cntx) {
			// 				cntx.replace(cntxr,(M,K,V)=>(!!!o[K]&&(o[K]=[]),o[K]=o[K].concat(V)));
			// 				res = JSON.stringify(o); return res;
			// 			} else { return this.Default; }
			// 		}, 
			// 		Desc: 	 new  GNDescr({ 
			// 			type: 		 { List: 'Text' }, 
			// 			description: 'The {{Context}} of the previous {{Search Terms}}',
			// 			required: 	 false, 
			// 			matches: 	 {
			// 				'VT': 'Matches the {{Context}} of a {{Service Type}} ((VT))',
			// 				'VD': 'Matches the {{Context}} of a {{Service Description}} ((VD))',
			// 				'VC': 'Matches the {{Context}} of a {{Service Charge}} ((VC))',
			// 				'VR': 'Matches the {{Context}} of a {{Service Rate}} ((VR))',
			// 				'LC': 'Matches the {{Context}} of a {{Locale}} ((LC))',
			// 				'HB': 'Matches the {{Context}} of a {{Hobby}} ((HB))',
			// 				'LG': 'Matches the {{Context}} of a {{Language}} ((LG))',
			// 				'NL': 'Matches the {{Context}} of a {{Nationality}} ((NL))',
			// 				'RL': 'Matches the {{Context}} of a {{Religion}} ((RL))',
			// 				'SX': 'Matches the {{Context}} of a {{Sex}} ((SX))',
			// 				'MS': 'Matches the {{Context}} of a {{Marital Status}} ((MS))',
			// 				'OR': 'Matches the {{Context}} of a {{Orientation}} ((OR))',
			// 				'GD': 'Matches the {{Context}} of a {{Gender}} ((GD))',
			// 			},
			// 			to: 		 'param', 
			// 		})
			// 	}).AddVersion('multi', {  
			// 		Default: '[]',
			// 		Format   (cls) { 
			// 			let ctx = cls.context, rgx = /\b\d+@/g, res;
			// 			if (!!ctx) {
			// 				return `["${ctx.replace(rgx,'').split(ORS).join('","')}"]`;
			// 			} else { return this.Default; }
			// 		}, 
			// 	}),   
			// 	LIDs: 	true, 
			// 	Limit: 	null, 
			// 	Page: 	null, 
			// 	ID: 	true 
			// },
			// Links: 		[] 
		// });

	// console.log('\nBFORE:',Imm.isKeyed(route)); console.log('\n');

	// console.log(PT.Examples);

/////////////////////////////////////////////////////////////////////////////////////////////
// EXPORT

	module.exports = { 
		MERGER, 
		RouteAU, RouteDB, GNHeaders, GNParam, GNDescr, 
		PType, PT, _Methods, _Defaults, 
	};


/////////////////////////////////////////////////////////////////////////////////////////////

