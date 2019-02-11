'use strict';

/////////////////////////////////////////////////////////////////////////////////////////////
// DEFINITIONS

	/////////////////////////////////////////////////////////////////////////////////////////

		/**
		 * A callback that acquires a `Getter` Property
		 * @callback PropGet
		 * @returns {any}
		 */

		/**
		 * A callback that assign a `Setter` Property
		 * @callback PropSet
		 * @param {any} val The value to `set`
		 * @void
		 */

		/**
		 * A `Property Descriptor` 
		 * @typedef  {Object}   PropDesc
		 * @property {*}       [value]
		 * @property {PropGet} [get]
		 * @property {PropSet} [set]
		 * @property {true}     enumerable
		 * @property {false}    writable
		 * @property {false}    configurable
		 */

		/**
		 * A function that accepts up to three arguments. The map method calls the callbackfn function one time for each element in the array.
		 * 
		 * Calls a defined callback function on each element of an array, and returns an array that contains the results.
		 * @callback CBMapper
		 * @param   {any}    value The `Array` item value
		 * @param   {number} index The `Array` item index
		 * @param   {array}  array The current `Array`
		 * @returns {array}  The newly mapped `Array`
		 */

	/////////////////////////////////////////////////////////////////////////////////////////

		/**
		 * A callback that handles a `GNParam`'s formatting
		 * @callback CBFormat
		 * @param    {Object<string,any>} cls The `clause` value object
		 * @returns  {any} The formatted `clause` value
		 */

		/**
		 * A callback that handles a `GNParam`'s formatting
		 * @typedef {String[]|CBFormat} CBQuery
		 */

		/**
		 * A callback that handles a `AURequest`
		 * @callback CBProc
		 * @param    {Request} req An HTTP/S request
		 * @returns  {void}
		 */

		/**
		 * A callback that sanitzes a values according to it's `PType`
		 * @callback CBSani
		 * @param    {any} value A value to sanitze
		 * @returns  {any} The `value`, if valid; otherwise, `null`
		 */

		/**
		 * A callback that Parses the `GNParam` Results
		 * @callback CBParse
		 * @param    {Object.<string,any>} res An `GNRequest` response
		 * @returns  {any}
		 */

		/**
		 * A collection of `GNParam` objects
		 * @typedef {Object<string,GNParam>} CLParams
		 */

		/**
		 * A collection of Header `GNDescr` objects
		 * @typedef {Object<string,GNDescr>} CLHeader
		 */

		/**
		 * A collection of Query Examples
		 * @typedef {Object<string,string>} CLExamples
		 */

		/**
		 * A collection of `AURequest` Procs
		 * @typedef {Object<string,(string|CBProc)>} CLProcs
		 */

		 /**
		 * Denotes whether a `GNParam` is a genuine `param` or `query`/`body` property
		 * @typedef {('param'|'query')} PTo
		 */

		/**
		 * A collection of `Key`/`Value` pairs for restricting `PTypes`
		 * @typedef {Array.<{label:string,value:any}>} PTSelect
		 */

		/**
		 * A collection of `PType` instances
		 * @typedef {Object.<string,PType>} PTypes
		 */
	
	/////////////////////////////////////////////////////////////////////////////////////////

		/**
		 * A customizer `object` for `PTypes`
		 * @typedef  {Object}     CZPType
		 * @property {?PTSelect} [selects] A collection of `Key`/`Value` pairs for restricting any type
		 * @property {?string[]} [omit] An `array` of `values` to ignore in `select` restrictions
		 * @property {?string}   [separator=";"] A delimiter for `List`-types when the List-value is a String
		 * @property {?boolean}  [sort=false] if `true`, `List`-type items will be sorted by size
		 * @property {?number[]} [slice] An `array` of `Array.slice` parameters for restricting `List` length
		 * @property {?string[]} [tags] An `Array` of items that can be used within sanitzer and map callbacks
		 * @property {?CBMapper} [map] Will `map` a `List` with the specified callback
		 * @property {?string}   [join] Will `join` a `List` with the specified value
		 * @property {?string[]} [enclose] A 2-length string `Array`, indicating characters to wrap a _joined_ `List` with
		 * @property {?boolean}  [leveled=false] if `true`, `List`-type _"leveled"_ items (_i.e: `value`&#64;`level`_) are considered 
		 *     Edits/Additions, while "non-leveled" items (_i.e: `value`_) are marked separately for removal
		 * @property {?boolean}  [grouped=false] if `true`, `List`-type items will be grouped according to their `key` (_i.e: `key`&#64;`value`_)
		 * @property {?number}   [step=1] The increment `Number`-type must adhere to
		 * @property {?number}   [min=-Infinity] The minimum amount a `Number`-type can be
		 * @property {?number}   [max=Infinity] The maximum amount a `Number`-type can be
		 * @property {?RegExp}   [regex] A `RegexP` pattern a `Text`-type must match
		 */

		/**
		 * A config `object` for `PTypes`
		 * @typedef  {Object}   CLPType 
		 * @property {string}  [name] A name for this `PType`
		 * @property {string}  [type] The `string` representation of the valid Type
		 * @property {CBSani}  [sanitizers] A callback that sanitzes a values according to it's `PType`
		 * @property {boolean} [iterable=false] `true`, if the value is an `list` of values
		 */

		/**
		 * Config properties a Route's Documentation
		 * @typedef  {Object}      GCDoc
		 * @property {CLHeader}   [Headers] A collection of Header `GNDescr` objects
		 * @property {CLExamples} [Examples] A collection of Query Examples
		 * @property {CLParams}   [Params] A collection of `GNParam` objects (_for `RouteAU`_)
		 */

		/**
		 * Config properties for the `GNDescr` object
		 * @typedef  {Object}   GCDescr
		 * @property {PType}    type A `PType` that the Param adheres to
		 * @property {String}   description A description of what the Param entails
		 * @property {?Boolean} required Whether or not it is mandator to set this Param
		 * @property {!Boolean} [hidden=false] If `true`, this param is publicly. 
		 *     Good for Params that are set by the backend
		 * @property {!CLExamples} [matches] A collection of Query Examples
		 * @property {PTo} to Denotes whether a `GNParam` is a genuine `param` 
		 *     or `query`/`body` property
		 */	
		
		/**
		 * Config properties for the `GNParam` object
		 * @typedef  {Object}   GCParam
		 * @property {string}   Name The fullname of the Param
		 * @property {string[]} [Aliases=[]] An `array` of other names this Param serves
		 * @property {any}      Default The default value for the Param
		 * @property {CBFormat} Format A callback that handles any post-processing needed before hydration
		 * @property {GNDescr|GCDescr}  Desc A `GCDescr` object or `GCDescr` config describing the Param
		 */

		/**
		 * Config properties for the `GNRequest` object
		 * @typedef  {Object}    GCRoute
		 * @property {String}    Scheme A `RegexP` representation of the `Route` Path.
		 * @property {String[]}  Methods The Methods of which the `GNRequest` can be used.
		 * @property {String[]} [Sub] A list of the heirarchy the `GNRequest` belongs under.
		 * @property {String[]} [Limits] A list of `Limits` to subscribe to.
		 * @property {GCDoc}     Doc The documentation for this `GNRequest`.
		 * @property {CBQuery}  [Query] The Query handle for `DBRequests`.
		 * @property {Object}   [Proc] The collection of handlers for `AURequests`.
		 * @property {CLParams} [Params] A collection of `GNParams` for `DBRequests`.
		 * @property {CBParse}  [Parse] A result formatter for `DBRequests`.
		 * @property {String[]} [Links] A list of Request Paths used for linking `DBRequests`.
		 * @property {String}   [Key] A general **key** to mark for formatting `DBRequest` results.
		 * @property {boolean}  [Private=true] `true`, if this Endpoint is restricted to Admins.
		 */

		/**
		 * Config properties for the `AURequest` object
		 * @typedef  {Object}    ACRoute
		 * @property {String}   [Scheme=''] A `RegexP` representation of the `Route` Path.
		 * @property {String[]}  Methods The Methods of which the `AURequest` can be used.
		 * @property {String[]} [Sub] A list of the heirarchy the `AURequest` belongs under.
		 * @property {String[]} [Limits] A list of `Limits` to subscribe to.
		 * @property {GCDoc}     Doc The documentation for this `AURequest`.
		 * @property {CLProcs}  [Proc] The collection of handlers for this `AURequest`.
		 * @property {boolean}  [Private=true] `true`, if this Endpoint is restricted to Admins.
		 */

		/**
		 * Config properties for the `DBRequest` object
		 * @typedef  {Object}    DCRoute
		 * @property {String}    Scheme A `RegexP` representation of the `Route` Path.
		 * @property {String[]}  Methods The Methods of which the `DBRequest` can be used.
		 * @property {String[]} [Sub] A list of the heirarchy the `DBRequest` belongs under.
		 * @property {String[]} [Limits] A list of `Limits` to subscribe to.
		 * @property {GCDoc}     Doc The documentation for this `DBRequest`.
		 * @property {CBQuery}  [Query] The Query handle for this `DBRequest`.
		 * @property {CLParams} [Params] A collection of `GNParams` for this `DBRequest`.
		 * @property {CBParse}  [Parse] A result formatter for this `DBRequest`.
		 * @property {String[]} [Links] A list of Request Paths used for linking `DBRequest`.
		 * @property {String}   [Key] A general **key** to mark for formatting `DBRequest` results.
		 * @property {boolean}  [Private=true] `true`, if this Endpoint is restricted to Admins.
		 */
	 

/////////////////////////////////////////////////////////////////////////////////////////////
// REQUIRES

	const  	{ 	Assign, Imm, StrTime, ROOTD, LJ, path, os, fs,
				CNAME, ARGS, TYPE, EXTEND, HIDDEN, DEFINE, NIL, UoN, 
				IaN, IS, ISS, OF, DCT, RGX, FRMT, CLM, CLMNS, ELOGR,
				preARGS, Dbg, LG, TLS, JSN, FromJS
			} = require('dffrnt.utils');
	const   OoA = ['object','array'],
			PTP = ['Text','Bool','Num','Int','Float','Level','Multi'],
			TPS = [
				'GNConfig',  'RouteGN', 'RouteAU', 'RouteDB',
				'GNHeaders', 'GNParam', 'GNDescr',
			];

	global.__PTYPES__ = Imm.Map({});
	
/////////////////////////////////////////////////////////////////////////////////////////////
// FUNCTIONS


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
		return Assign(dprop, { enumerable: true });
	}

	/**
	 * Freeze an Object, if needed.
	 *
	 * @param {*} obj The Object to Freeze
	 * @param {Boolean} [all=false] `true`, if Freezing should be recursive
	 * @returns {Object} The frozen Object
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
	 * A `callback` used in `Immutable`.`mergeWith`
	 *
	 * @param {*} oldVal The value of the original Object
	 * @param {*} newVal The value of the merging Object
	 * @returns {*}
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
		let THS = this, pfx = (!!THS ? THS.Name||THS.Scheme : '');
		throw new TypeError(
			`${pfx} property, [${name}], must be one of the following, <${
				type.join('> or <').toTitleCase()
			}>. Got <${actual.toTitleCase()}> (${value}) instead.`
		);
	}

/////////////////////////////////////////////////////////////////////////////////////////////
// General Configurators

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
			 * @memberof GNConfig
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
			 * @memberof GNConfig
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
			 * @memberof GNConfig
			 * @private
			 */
			ThrowType(name, type, value, actual) {}
	}

/////////////////////////////////////////////////////////////////////////////////////////////
// Route Configurators

	/**
	 * The Base Class for the Route Configurators
	 * @extends {GNConfig}
	 * @private
	 */
	class RouteGN extends GNConfig {
		/// CONSTRUCTOR /////////////////////////////////////////////////////////////////////

			/**
			 * Creates an instance of `RouteGN`.
			 * 
			 * @param {GCRoute} configs
			 */
			constructor({ Scheme, Methods, Sub, Limits, Doc, Query, Proc, Params, Parse, Links, Key, Private = true } = configs) {
				super(); let THS = this;
				// --------------------------------------------------------------------------------- //
					THS.AddProperty('Scheme',  Scheme,  ['string'],         true );
					THS.AddProperty('Methods', Methods, ['array'],          true );
					THS.AddProperty('Sub',     Sub,     ['array'],          false);
				// --------------------------------------------------------------------------------- //
					THS.AddProperty('Limits',  Limits,  ['array'],          false);
				// --------------------------------------------------------------------------------- //
					THS.AddProperty('Doc',     { 
						...{Methods:THS.Methods}, 
						Headers: {},
						...(Doc||{}),
					}, ['object'], true);
				// --------------------------------------------------------------------------------- //
					THS.AddProperty('Proc',   Proc,	  ['object'], 			false);
				// --------------------------------------------------------------------------------- //
					THS.CheckTypes('Query', Query, ['string','array','function'], false);
					THS.Query = Query; let iQRY = ISS(Query);
					DEFINE(THS, { QisFunction: HIDDEN(iQRY=='function') });
					DEFINE(THS, { QisArray: HIDDEN(iQRY=='array') });
					// ----------------------------------------------------------------------------- //
					THS.CheckTypes('Params', Params, ['object'], false);
					THS.Params = Params;
				// --------------------------------------------------------------------------------- //
					THS.AddProperty('Parse',  Parse,  ['function'], 		false, true);
					THS.AddProperty('Links',  Links,  ['array'], 			false);
					THS.AddProperty('Key',    Key,    ['string'], 			false);
				// --------------------------------------------------------------------------------- //
					THS.AddProperty('Private', !!Private, ['boolean'], true );
					// ----------------------------------------------------------------------------- //
					DEFINE(THS, { Locked: {
						enumerable: false, configurable: true, 
						get() { return false; }
					} });
			}
	}

	/**
	 * A Route Configurator for `AURequests`
	 *
	 * @extends {RouteGN}
	 */
	class RouteAU extends RouteGN {
		/// CONSTRUCTOR /////////////////////////////////////////////////////////////////////

			/**
			 * Creates an instance of RouteAU.
			 * @param {ACRoute}   configs
			 * @param {String}   [configs.Scheme=''] A `RegexP` representation of the `Route` Path.
			 * @param {String[]}  configs.Methods The Methods of which the `AURequest` can be used.
			 * @param {String[]} [configs.Sub] A list of the heirarchy the `AURequest` belongs under.
			 * @param {String[]} [configs.Limits] A list of `Limits` to subscribe to.
			 * @param {GCDoc}     configs.Doc The documentation for this `AURequest`.
			 * @param {CLProcs}  [configs.Proc] The collection of handlers for this `AURequest`.
			 * @param {boolean}  [configs.Private=true] `true`, if this Endpoint is restricted to Admins.
			 */
			constructor({ Scheme = '', Methods, Sub, Limits, Doc, Proc, Private = true } = configs) {
				super({ Scheme, Methods, Sub, Limits, Doc, Proc, Private });
			}
	}

	/**
	 * A Route Configurator for `DBRequests`
	 *
	 * @extends {RouteGN}
	 */
	class RouteDB extends RouteGN {
		/// CONSTRUCTOR /////////////////////////////////////////////////////////////////////

			/**
			 * Creates an instance of RouteDB.
			 * @param {DCRoute}   configs
			 * @param {String}    configs.Scheme A `RegexP` representation of the `Route` Path.
			 * @param {String[]}  configs.Methods The Methods of which the `DBRequest` can be used.
			 * @param {String[]} [configs.Sub] A list of the heirarchy the `DBRequest` belongs under.
			 * @param {String[]} [configs.Limits] A list of `Limits` to subscribe to.
			 * @param {GCDoc}     configs.Doc The documentation for this `DBRequest`.
			 * @param {CBQuery}  [configs.Query] The Query handle for this `DBRequest`.
			 * @param {CLParams} [configs.Params] A collection of `GNParams` for this `DBRequest`.
			 * @param {CBParse}  [configs.Parse] A result formatter for this `DBRequest`.
			 * @param {String[]} [configs.Links] A list of Request Paths used for linking `DBRequest`.
			 * @param {String}   [configs.Key] A general **key** to mark for formatting `DBRequest` results.
			 * @param {boolean}  [configs.Private=true] `true`, if this Endpoint is restricted to Admins.
			 */
			constructor({ Scheme, Methods, Sub, Limits, Doc, Query, Params, Parse, Links, Key, Private = true } = configs) {
				super({ Scheme, Methods, Sub, Limits, Doc, Query, Params, Parse, Links, Key, Private });
			}

		/// FUNCTIONS   /////////////////////////////////////////////////////////////////////

			/**
			 * Locks the current configuration, permanetly.
			 * @private
			 */
			Lock() {
				let THS = this; if (THS.Locked) return;
				// --------------------------------------------------------------------------------- //
					function FormatQRY(query) { 
						var R = '', Q = query; switch(true) {
							case THS.QisFunction: return CleanQRY(Q.toString());
							case THS.QisArray: return Q.join("\n").replace("\t","");
							default: return R;
						};
					};
					function CleanQRY(func) {
						let F = func.toString(), M = /^(?!function)(.+)/, 
							T = F.split("\n").slice(-1)[0].match(/^(\s+|)/)[0],
							G = new RegExp(`^${T}`,'gm'), R = 'function $1';
						return F.replace(M,R).replace(G,'');
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
			 * A blank `RouteDB` object, used for Routes that are really just Namespaces 
			 *     for other Routes. These Routes are never actually implemented.
			 * @param {String[]} [Sub] A list of the heirarchy the `DBRequest` belongs under.
			 * @returns {RouteDB}
			 */
			static Namespace(Sub) { 
				return new RouteDB({
					Scheme: 	'/',
					...(!!Sub ? { Sub: Sub } : {}),
					Methods: 	_Defaults.toJS().Kinds.GET,
					Doc: 		{
						Headers: 	{},
						Examples: 	{},
					},
					Query:  	[],
					Params: 	{},
					Links: 		[]
				});
			}
	}

/////////////////////////////////////////////////////////////////////////////////////////////
// Header Configurators

	/**
	 * A Collection of `GNDescr` Objects for Headers
	 * @extends {GNConfig}
	 */
	class GNHeaders extends GNConfig {
		/// CONSTRUCTOR /////////////////////////////////////////////////////////////////////
			
			/**
			 * Creates an instance of `GNHeaders`.
			 * @param {CLHeader} headers
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
// Param Configurators

	/**
	 * A Parameter Configurator for `GNRequest` Objects
	 * @extends {GNConfig}
	 */
	class GNParam extends GNConfig {
		/// CONSTRUCTOR /////////////////////////////////////////////////////////////////////

			/**
			 * Creates an instance of GNParam.
			 * @param {GCParam}          configs Config properties for the `GNParam` object
			 * @param {string}           configs.Name The fullname of the Param
			 * @param {string[]}        [configs.Aliases=[]] An `array` of other names this Param serves
			 * @param {any}              configs.Default The default value for the Param
			 * @param {CBFormat}         configs.Format A callback that handles any post-processing needed before hydration
			 * @param {GNDescr|GCDescr}  configs.Desc A `GCDescr` object or `GCDescr` config describing the Param
			 * @param {GNParam}         [Main] An optional `GNParam` to use as a template
			 */
			constructor({ Name, Aliases = [], Default, Format, Desc } = configs, Main) {
				super(); let THS = this;
				// -------------------------------------------------------------------
				if (!!!Main) {
					// ---------------------------------------------------------------
						THS.AddProperty('Name',    Name,    ['string'],   true);
						THS.AddProperty('Aliases', Aliases, ['array'],    true);
						THS.AddProperty('Default', Default, null,   	  true);
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
							Default: LOCK(FREEZE(!!Default ? Default : MDflt)),
							Format:  LOCK(!!Format ? Format : MFrmt.bind(THS)),
							Desc: 	 LOCK(THS.AddDesc(Desc, Main))
						});
				}
			}

		/// PROCEDURES  /////////////////////////////////////////////////////////////////////

			/**
			 * Helper for adding `GNDescr` objects
			 *
			 * @param {(GNDescr|GCDescr)} descr A `GCDescr` object or `GCDescr` config describing the Param
			 * @param {GNParam} [main] An optional `GNParam` to use as a template
			 * @returns {GCDescr} The prepared `GCDescr`
			 * @memberof GNParam
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
			 * @param {string}           version A string to represent this Version
			 * @param {GCParam}          configs Config properties for the `GNParam` object
			 * @param {string}           configs.Name The fullname of the Param
			 * @param {string[]}        [configs.Aliases=[]] An `array` of other names this Param serves
			 * @param {any}              configs.Default The default value for the Param
			 * @param {CBFormat}         configs.Format A callback that handles any post-processing needed before hydration
			 * @param {GNDescr|GCDescr}  configs.Desc A `GCDescr` object or `GCDescr` config describing the Param
			 * @param {string}           use A string specifying a version to derive from
			 * @returns {GNParam} The current `GNParam`, for chanining purposes
			 * @memberof GNParam
			 */
			AddVersion(version, { Name, Default, Format, Desc } = configs, use) {
				let THS = this, THT = ((!!use?THS.Version[use]:THS)||THS);
				// -------------------------------------------------------------------
					DEFINE(THS.Version, { [version]: LOCK(
						new GNParam({ Name, Default, Format, Desc }, THT)
					) 	}	);
				// -------------------------------------------------------------------
					return THS;
			}
	}

	/**
	 * A Parameter Description Documenter for `GNParams` or `GNHeaders`
	 * @extends {GNConfig}
	 */
	class GNDescr extends GNConfig {
		/// CONSTRUCTOR /////////////////////////////////////////////////////////////////////

			/**
			 * Creates an instance of GNDescr.
			 * @param {GCDescr}      configs
			 * @param {PType}        configs.type A `PType` that the Param adheres to
			 * @param {String}       configs.description A description of what the Param entails
			 * @param {?Boolean}     configs.required Whether or not it is mandator to set this Param
			 * @param {!Boolean}    [configs.hidden=false] If `true`, this param is publicly. 
			 *     Good for Params that are set by the backend
			 * @param {!CLExamples} [configs.matches] A collection of Query Examples
			 * @param {PTo}          configs.to Denotes whether a `GNParam` is a genuine `param` 
			 *     or `query`/`body` property
			 */
			constructor({ type, description, required, hidden, matches, to } = configs) {
				super(); let THS = this;
				// -------------------------------------------------------------------
					THS.AddProperty('type', type, null, true);
					THS.AddProperty('required', required, ['boolean','null'], true);
				// -------------------------------------------------------------------
					THS.AddProperty('hidden',      hidden,      ['boolean'], false);
					THS.AddProperty('to',          to,          ['string'],  false);
				// -------------------------------------------------------------------
					THS.CheckTypes('description',  description, ['string'],   true);
					THS.description = description;
				// -------------------------------------------------------------------
					THS.CheckTypes('matches',      matches,     ['object'],  false);
					THS.matches = matches;
			}

		/// FUNCTIONS   /////////////////////////////////////////////////////////////////////

			/**
			 * Set the full Parameter-Name this instance describes
			 * @param   {String}  name The full-name of the Param
			 * @returns {GNDescr} This instance, for chaining
			 * @private
			 */
			Hydrate(name) {
				let THS = this, descr = THS.description, match = THS.matches;
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
			 * @param {GCDescr}      configs
			 * @param {PType}        configs.type A `PType` that the Param adheres to
			 * @param {String}       configs.description A description of what the Param entails
			 * @param {?Boolean}     configs.required Whether or not it is mandator to set this Param
			 * @param {!Boolean}    [configs.hidden=false] If `true`, this param is publicly. 
			 *     Good for Params that are set by the backend
			 * @param {!CLExamples} [configs.matches] A collection of Query Examples
			 * @param {PTo}          configs.to Denotes whether a `GNParam` is a genuine `param` 
			 *     or `query`/`body` property
			 */
			Merge(configs) {
				let THS = this, { type, description, required, hidden, matches, to } = THS;
				return new GNDescr(FromJS({
					type, description, required, hidden, matches, to 
				}).mergeDeep(FromJS(configs)).toJS())
			}

			/**
			 * Creates a `deepcopy` of this GNDescr instance.
			 * @returns {GNDescr}
			 */
			toCopy() {
				let { type, description, required, hidden, matches, to } = this;
				return new GNDescr(FromJS({ 
					type, description, required, hidden, matches, to 
				}).toJS());
			}

			/**
			 * A plain-object representation of this Description
			 * @returns {GCDescr}
			 */
			toDoc() {
				let { type, description, required, hidden, matches, to } = this;
				return { 
					type: !!type.toDoc ? type.toDoc() : type, 
					description, required, hidden, matches, to 
				};
			}

	}

/////////////////////////////////////////////////////////////////////////////////////////////
// Param Types

	/**
	 * Base Class for the `PTypes`
	 * @extends {Function}
	 */
	class PType extends Function {
		/// CONSTRUCTOR /////////////////////////////////////////////////////////////////////

			/**
			 * Creates an instance of PType.
			 * @param {CLPType}   configs A config `object` for `PTypes`
			 * @param {?string}  [configs.name] A A name for this `PType`
			 * @param {?string}  [configs.type] The `string` representation of the valid Type
			 * @param {?CBSani}  [configs.sanitizers] A callback that sanitzes a values according to it's `PType`
			 * @param {?boolean} [configs.iterable=false] `true`, if the value is an `list` of values
			 */
			constructor({ name, type, sanitizers, iterable = false } = configs) {
				let PTID = IDPTYPE(), argsf = {}, argsd = [
						['restricted', false], ['selects', 	 null],
						['omit', 	    null], ['separator',  ';'],
						['sort', 	   false], ['tags', 	 null],
						['map', 	    null], ['join', 	 null],
						['enclose',     null], ['slice', 	 null],
						['leveled',    false], ['grouped', 	false], ['step',     1],
						['min',    -Infinity], ['max', 	 Infinity], ['regex', null],
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
							return list;
						},
						custom: 	function sanitize(v) {
							let THS = this, val = THS.cycle(v);
							if (!!THS.regex) {
								return ((val||'').toString().match(THS.regex)||[null])[0];
							} else {
								return val;
							}
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
					flt = (v)=>(val==v.value),
					val = THS.omit.has(value) ? '' : value,
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
					cyc = [...rgx,...san,...slc].map(v=>v.bind(THS));
				return cyc.reduce((v,sn)=>(sn(v)),value);
			}

			/**
			 * Prepares args to  pass to the `Base`
			 * @param {CLPType}   configs A config `object` for `PTypes`
			 * @param {?string}  [configs.name] A A name for this `PType`
			 * @param {?string}  [configs.type] The `string` representation of the valid Type
			 * @param {?CBSani}  [configs.sanitizers] A callback that sanitzes a values according to it's `PType`
			 * @param {?boolean} [configs.iterable] `true`, if the value is an `list` of values
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
			 */
			toString() {
				return `${this.name} ${JSN.Normal(this.toDoc())}`;
			}

			/**
			 * Displays a Documentation 
			 */
			toDoc () {
				let THS  = this,
					INF  = [Infinity,-Infinity],
					IXN  = (v)=>(UoN(v)||INF.has(v)),
					IST  = (v)=>(UoN(v)||v==1);
				// -------------------------------------------------------
				if (THS.restricted||THS.iterable) {
					let obj = {};
					// ---------------------------------------------------
					if (THS.restricted) {
						if (THS.type=="String") {
							obj.String = {};
							if (!UoN(THS.regex)) obj.String.regex  = THS.regex;
							if (Imm.Map(obj.String).isEmpty())
								delete obj.String;
						};
						if (THS.type=="Number") {
							obj.Number = {};
							if (!IXN(THS.min )) obj.Number.min  = THS.min;
							if (!IXN(THS.max )) obj.Number.max  = THS.max;
							if (!IST(THS.step)) obj.Number.step = THS.step;
							if (Imm.Map(obj.Number).isEmpty())
								delete obj.Number;
						};
					};
					// ---------------------------------------------------
					if (THS.iterable) {
						let lst = {}; lst.List = THS.type;
						if (!!THS.separator) obj.Separator = THS.separator;
						if (!!THS.grouped)   obj.Grouped   = THS.grouped;
						if (!!THS.slice)     obj.Length    = THS.slice.slice(-1)[0];
						obj = Imm.Map({ 
							List: THS.type, ...obj,
							...(obj.Number||{}),
							...(obj.Text||{}),
						})
						.filter((v)=>(!!v))
						.toObject();
						delete obj.Number; delete obj.Text;
					};
					// ---------------------------------------------------
					if (!!THS.selects) obj.Select = THS.selects;
					// ---------------------------------------------------
					return obj;
				} else return (
					THS.type=='String' ? THS.name : THS.type
				);
			}

		/// STATICS     /////////////////////////////////////////////////////////////////////

			/**
			 * Prepares args to  pass to the `Base`
			 * @param {string} [id] A unique identifier for the `PType` `call`
			 * @param {Object.<string,any>} [args] The `arguments` to format
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
			 * @param {CZPType}    configs A customizer `object` for `PTypes`
			 * @param {?PTSelect} [configs.selects] A collection of `Key`/`Value` pairs for restricting any type
			 * @param {?string[]} [configs.omit] An `array` of `values` to ignore in `select` restrictions
			 * @param {?string}   [configs.separator] A delimiter for `List`-types when the List-value is a String
			 * @param {?boolean}  [configs.sort] if `true`, `List`-type items will be sorted by size
			 * @param {?number[]} [configs.slice] An `array` of `Array.slice` parameters for restricting `List` length
			 * @param {?string[]} [configs.tags] An `Array` of items that can be used within sanitzer and map callbacks
			 * @param {?CBMapper} [configs.map] Will `map` a `List` with the specified callback
			 * @param {?string}   [configs.join] Will `join` a `List` with the specified value
			 * @param {?string[]} [configs.enclose] A 2-length string `Array`, indicating characters to wrap a _joined_ `List` with
			 * @param {?boolean}  [configs.leveled] If `true`, `List`-type _"leveled"_ items (_i.e: `value`&#64;`level`_) are considered 
			 *     Edits/Additions, while "non-leveled" items (_i.e: `value`_) are marked separately for removal
			 * @param {?boolean}  [configs.grouped] if `true`, `List`-type items will be grouped according to their `key` (_i.e: `key`&#64;`value`_)
			 * @param {?number}   [configs.step] The increment `Number`-type must adhere to
			 * @param {?number}   [configs.min] The minimum amount a `Number`-type can be
			 * @param {?number}   [configs.max] The maximum amount a `Number`-type can be
			 * @param {?RegExp}   [configs.regex] A `RegexP` pattern a `Text`-type must match
			 * @private
			 */
			static toType({ 
				selects, omit, separator, 
				sort, slice, tags, map, join, enclose,
				leveled, grouped, 
				step, min, max, regex
			} = configs) {
				let THS = this, THT = THS.extend({});
				// ------------------------------------------------------------------- //
					THT.AddProperty('restricted', true, ['boolean'], false);
					THT.AddProperty('grouped', grouped, ['boolean'], false);
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
					THT.AddProperty('regex', regex, ['raw'], false);
				// ------------------------------------------------------------------- //
					return THT;
			}

	}; global.PType = PType;

	// PRIMITIVES --------------------------------------------------------------------------------------------------------------------

		/**
		 * @type {Object.<string,(PType|PTypes)>}
		 */
		const PT = {
			/** @type {PTypes} */
			Text: 	new PType({ 
				name: 'Text', type: 'String', 
				sanitizers: function(v) { 
					return UoN(v) ? v : v.toString(); 
				}
			}),
			/** @type {PTypes} */
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
			/** @type {PTypes} */
			Bool: 	new PType({ 
				name: 'Bool', type: 'Boolean', 
				sanitizers: function(v) { 
					if (!!!v||(v||'').toString().has(['null','undefined'])) return false;
					let rgx = /^(true|false|1|0)$/, val = (v.toString()||'');
					return Boolean(eval((val.match(rgx)||['false'])[0])); 
				}
			}),
			/** @type {PTypes} */
			L:		{},
			/** @type {PTypes} */
			O:		{},
			/** 
			 * @type {string}
			 * @readonly
			 */
			get Examples() {
				let txtSel = [{label:'M',value:'M'},{label:'F',value:'F'},{label:'I',value:'I'}],
					regxp  = /^[\w_.-]+@[\w_.-]+\.[A-z]+$/,
					Int    = PT.Int,
					IntR   = PT.Int({ min: 0, max: 4 }),
					IntL   = PT.L.Int,
					IntLJ  = PT.L.Int({ join: ',', enclose: ["'[","]'"] }),
					IntLG  = PT.L.Int({ grouped: true }),
					BoolL  = PT.L.Bool,
					TextS  = PT.Text({ selects: txtSel }),
					TextLS = PT.L.Text({ selects: txtSel }),
					TextM  = PT.Text({ regex: regxp }),
					MltL   = PT.L.Multi,
					LvlL   = PT.L.Leveled;
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
					return [
						Exam(Int,5.5),
						Exam(IntR,5),
						Exam(IntL,[5,'hello',10,3]),
						Exam(IntLJ,[5,'hello',10,3]),
						Exam(BoolL,"1;null;true;10;true;0"),
						Exam(TextS,'M','S'),
						Exam(TextLS,"I;S;M"),
						Exam(IntLG,'LG@142;LG@124;LC@321245'),
						Exam(MltL,'LG@142;VT@012011;LG@124;LC@321245'),
						Exam(LvlL,'1@142;6@124;156',''),
						Exam(TextM,'leshaun.john@icloud.com','@@icloud.com'),
					].join('');
			}
		};
	// NUMBERS -----------------------------------------------------------------------------------------------------------------------
		PT.Int 	     = 	PT.Num.extend({ name: 'Int',     sanitizers: (v)=>{ let n = parseInt(v); return isNaN(n) ? null: n; } });
		PT.Float     = 	PT.Num.extend({ name: 'Float',   sanitizers: (v)=>{ let n = parseFloat(v); return isNaN(n) ? null: n; } });
		PT.Bitwise   = 	PT.Num.extend({ name: 'Bitwise', sanitizers: (v)=>{ return (!isNaN(v)&&v%8===0?v:null); } });
	// MATCHERS ----------------------------------------------------------------------------------------------------------------------
		PT.Password  = 	PT.Text.extend({ name: 'Password', sanitizers(v) { return (v||'').length>=8 ? v : null; } });
		PT.TextArea  = 	PT.Text.extend({ name: 'TextArea', sanitizers(v) { return (v||'').replace(/\n/g, '\\n').replace(/\n/g, '\\n'); } });
		PT.NoWrap    = 	PT.Text.extend({ sanitizers(v) { return (v||'').replace(/[\n\r]+/g, ''); } });
		PT.Date		 =  PT.Text.extend({ name: 'Date', sanitizers(v) { try {
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
		PT.Name 	 =  PT.Text.extend({ name: 'Name', sanitizers(v) { return !!v ? v.toTitleCase() : null; } })({ regex: /^[a-z]+(?:-[a-z]+)?(?: (?:[sj]r.|[0-9](?:st|nd|rd|th)))?$/i });
		PT.URL 	 	 =  PT.Text.extend({ name: 'URL' })({ regex: /^(?:https?:\/{2}|)(?:\b[\w_-]+\b\.|)\b[\w_-]+\b\.[a-z]{2,}(?:\/\b[\w_-]+\b)*(?:\?(?:\b[\w_-]+\b=\S+?(?:&|$))+|)$/i });
		PT.Email     = 	PT.Text.extend({ name: 'Email' })({ regex: /^[\w_.-]+@[\w_.-]+\.[A-z]+$/ });
		PT.Uname     = 	PT.Text.extend({ name: 'Uname' })({ regex: /^[A-Za-z0-9_.-]+$/ });
		PT.MD5       = 	PT.Text.extend({ name: 'MD5'   })({ regex: /^[A-Fa-f0-9]+$/ });
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
					return `,"${tags[i]}":${JSON.stringify(v)}`; 
				}, join: '', slice: [0,2],
			};
		// ---------------------------------------------------------------------------------------------------------------------------
		PT.IRange    =  PT.L.Int.extend({ name: 'IRange' })(rangeCfg);
		PT.CRange    =  PT.L.Num.extend({ name: 'CRange' })(rangeCfg);

/////////////////////////////////////////////////////////////////////////////////////////////
// DEFAULTS

	const _Defaults = FromJS({
		Kinds: 	 { GET: ['GET'], POST: ['POST'], BOTH: ['GET', 'POST'], PUT: ['PUT'], DELETE: ['DELETE'],  MID: ['MIDDLEWARE'] },
		Headers: { Token: new GNDescr({ type: "Text", description: "The secret Token Key given upon Sign-Up", required: true, }), },
		Params:  {
			Single: 	new GNParam({
				Name:		'Single',
				Default: 	 false, 
				Format(cls) { return cls.single; },
				Desc: 	new GNDescr({
					type: PT.Bool,
					description: 'Return a {{single}} {{User}} only',
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

	console.log(PT.Examples);
	
	console.log(PT.IRange.sanitize('14;20;5;1000;80'));
	console.log(PT.CRange({ tags: ['VC-','VC+'], min: 0.00, step: 0.10 }).sanitize('2,20;2,13.10'));

/////////////////////////////////////////////////////////////////////////////////////////////
// EXPORT

	module.exports = { 
		RouteAU, RouteDB, GNHeaders, GNParam, GNDescr, 
		PType, PT, _Defaults, MERGER 
	};


/////////////////////////////////////////////////////////////////////////////////////////////

