/// <reference types="node" />
/// <reference types="immutable" />
/// <reference types="mysql" />
/// <reference types="socket.io" />
/// <reference types="dffrnt.route" />

/** @hidden */
import * as core from "express-serve-static-core";
/** @hidden */
import * as mysql from "mysql";
/** @hidden */
import Immutable = require("immutable");
/** @hidden */
import Reflux = require("reflux");
/** @hidden */
import { LG, TLS, JSN, Imm, TZ, TYPE, Assign, UoN, CNAME } from "dffrnt.utils"
/** @hidden */
import { Errors, Help, Routes, Session, REST } from "dffrnt.route";

/**
 * Gloabl configuration `interfaces` for the `dffrnt.confs` module of the `dffrnt.api` framework.
 */
declare global {
    /** @hidden */ export const Imm = Immutable;
    /** @hidden */ export const Reflux = Reflux;
    /** @hidden */ export type  ExRequest = core.Request;
    /** @hidden */ export type  ExResponse = core.Response;
    /** @hidden */ export type  ExNext = core.NextFunction;
    /** @hidden */ export namespace MySQL {
        export type TypeCast = mysql.TypeCast;
        export type Connection = mysql.Connection;
        export type Pool = mysql.Pool;
        export type PoolCluster = mysql.PoolCluster;
    };

    /**
     * A valid **HTTP-Method**.
     * @category #Misc
     */
    export type HMETHOD = 'GET'|'POST'|'PUT'|'DELETE'|'MIDDLEWARE';
    /** 
     * The **HTTP-Method**, `GET`.
     */
    export const 	GET:    HMETHOD = "GET";
    /** 
     * The **HTTP-Method**, `POST`.
     */
    export const 	POST:   HMETHOD = "POST";
    /** 
     * The **HTTP-Method**, `PUT`.
     */
    export const 	PUT:    HMETHOD = "PUT";
    /** 
     * The **HTTP-Method**, `DELETE`.
     */
    export const 	DELETE: HMETHOD = "DELETE";
    /** 
     * The **HTTP-Method**, `MIDDLEWARE`.
     */
    export const 	MID:    HMETHOD = "MIDDLEWARE";
    /**
     * An array of valid **HTTP-Methods**.
     * @category #Misc
     */
    export type HMETHODs = Array<HMETHOD>;


    /**
     * Denotes whether a {@link GNParam} is a `path`, `header`, or `query`/`body` parameter.
     * 
     * | Param      | `PTo`    | Example |
     * | :--------: | :------: | ------- |
     * | **Path**   | `path`   | ```curl https://rest.com/<PATH>``` |
     * | **Header** | `header` | ```curl -H "Token:345j_hk234 https://rest.com/user``` |
     * | **Query**  | `query`  | ```curl https://rest.com/search?q=<QUERY>``` |
     * | **Body**   | `body`   | ```curl -X PUT -d name=daniel https://rest.com/edit``` |
     * @category #Misc
     */
    export type PTo = 'header'|'path'|'query';
    /**
     * Valid {@link CFG.PNTS.PTOpts.type|PTOpts.type}s.
     */
    export type PTKinds = 'String' | 'Number' | 'Boolean' | 'Object';
    /**
     * Valid _primitive-types_ for defining a {@link PType} **OpenAP 3.x** document.
     * @category #Misc
     */
    export type TPDocPrims   = 'integer' | 'number' | 'string' | 'boolean' | 'array' | 'object';
    /**
     * Valid _primitive-types_ for {@link QYRequest} params.
     * @category #Misc
     */
    export type TPQryPrims = string|boolean|number|{[k:string]:TPQryPrims|TPQryIters;};
    /**
     * Valid `Iterables` containing _primitive-types_ for {@link QYRequest} params.
     * @category #Misc
     */
    export type TPQryIters = TPQryPrims[];
    /**
     * A plain-object representing the `path-params` of an request.
     * @category #Misc
     */
    export type TPQryPathParams = { [paramName: string]: string|boolean|number };
    /**
     * A plain-object representing the `query`/`body` of an request.
     * @category #Misc
     */
    export type TPQryObject = { [propName: string]: TPQryPrims|TPQryIters };
    /**
     * Either a _single_-sanitzer `callback`, or an array of many `callbacks`.
     */
    export type TPSanitizers = CBSanitizer | CBSanitizer[];
    /**
     * An alias representing the valid styles of `BaseEndpoint` configurations.
     */
    export type TPBasePoints = CFG.PNTS.Auth.Base|CFG.PNTS.Data.Base;
    /**
     * ...
     */
    export type TPRouteMethods = "Auth"|"Data";
    /**
     * ...
     */
    export type TPRouteMethod<R extends TPRouteMethods> = (R extends "Auth" ? CFG.PNTS.Auth.Method : CFG.PNTS.Data.Method);
    /**
     * ...
     */
    type TPRouteMerge<M extends (CBRouteAU|CBRouteDB)> = Exclude<HMETHOD, R extends CBRouteDB ? "MIDDLEWARE" : "">


    /**
     * A callback that acquires a `Getter` Property.
     * @returns The value to `get`.
     * @category Callback
     */
    export type PropGet = ()=>any;
    /**
     * A callback that assign a `Setter` Property.
     * @param val The value to `set`.
     * @category Callback
     */
    export type PropSet = (val: any)=>void;
    /**
     * A `Property Descriptor`.
     */
    export interface PropDesc {
        value?: any;
        get?: PropGet;
        set?: PropSet;
        enumerable: true;
        writable: false;
        configurable: false;
    };


    /**
     * A callback that handles a {@link GNParam}'s formatting.
     * @param cls The `clause` value object.
     * @returns The formatted `clause` value.
     * @category Callback
     */
    export type CBFormat = (cls: TPQryObject)=>any;
    /**
     * A callback that retrieves/updates data in the backend.
     * @param cls The `Params` sent from the `Request`.
     * @returns The payload return from a `Request`.
     * @category Callback
     */
    export type CBQYHandle = (cls: TPQryObject)=>Promise<QYResult>;
    /**
     * Either an `Array` of `Strings` that form a **SQL** query, or A `callback` that _retrieves/updates_ data in the backend.
     * @category Callback
     */
    export type CBQuery = CBQYHandle|Array<String>;
    /**
     * A callback that returns {@link RouteAU}-specific configs for a {@link QueryGN}.
     * @returns Config properties for the {@link QueryGN} object.
     * @category Callback
     */
    export type CBRouteAU = ()=>CFG.PNTS.Auth.Method;
    /**
     * A callback that returns {@link RouteDB}-specific configs for a {@link QueryGN}.
     * @returns Config properties for the {@link QueryGN} object.
     * @category Callback
     */
    export type CBRouteDB = ()=>CFG.PNTS.Data.Method<CBQuery>;
    /**
     * A callback that handles a `AuthRequest`.
     * @param req An HTTP/S request.
     * @returns
     * @category Callback
     */
    export type CBProc = (req: ExRequest)=>Promise<QYAuthResult>;
    /**
     * A callback that Parses the {@link GNParam} Results.
     * @param res An `GNRequest` response.
     * @returns
     * @category Callback
     */
    export type CBParse = (res: TPQryObject)=>any;
    /**
     * The `default` structure of any data that it to be recieved from a {@link CFG.SPCE.SpaceHandler.Call} request, 
     * and subsequently passed to the {@link CFG.SPCE.SpaceHandler.Build}. This can be used to account for `default-values` 
     * in a response when certain values are `null` or `undefined`.
     * @param path The `originalUrl` of the curretn page-request.
     * @param req The current page-request.
     */
    export type CBSpaceStruct = (path: string, req: ExRequest)=>TPQryObject;
    /**
     * A callback that sanitzes a values according to it's {@link PType}.
     * @param value A value to sanitze.
     * @returns The `value`, if valid; otherwise, `null`.
     */
    export type CBSanitizer = (value: TPQryPrims)=>TPQryPrims;


    /**
     * An API Request Object.
     * @category Returnable
     */
    export interface QYRequest {
        /**
         * The `method` needed for this request.
         */
        method: Exclude<HMETHOD, 'MIDDLEWARE'>;
        /**
         * The `path` needed for this request.
         */
        path: string;
        /**
         * The `path` parameters for this request; if any.
         */
        params?: TPQryPathParams;
        /**
         * The `query` parameters for a `GET` or `DELETE` request; if any.
         */
        query?: TPQryObject;
        /**
         * The `body` parameters for a `GET` or `DELETE` request; if any.
         */
        body?: TPQryObject;
        /**
         * A list a `files` that are to be uploaded in this request; if any.
         */
        files?: string[];
    };
    /**
     * An `Error` that can occur within a `CBQYHandle`.
     * @category Returnable
     */
    export type QYError = Error;
    /**
     * 
     */
    export type QYNext = [];
    /**
     * The **payload** returned within a {@link QueryGN} query handler.
     * @category Returnable
     */
    export interface QYAuthResult {
        /**
         * | Name   | Type             | Description |
         * | :----: | :--------------: | ----------- |
		 * | `res ` | {@link e.response} | An `HTTP` or `Socket` instance. |
		 * | `msg ` | `string`         | A message regarding the response. |
		 * | `usr ` | `object`         | The user-info object. |
		 * | `acct` | {@link string}   |  A username, email, etc. |
		 * | `qry ` | `object`         | The `query` object from the request. |
		 * | `cde ` | `number`         | The payload status code (_this is **NOT** the `HTTP` status_). |
         */
        send: [
            string, 
            { [key: string]: any; }, 
            string, 
            ({ [key: string]: any; })?, 
            number?,
        ];
        /**
         * ...
         */
        next: QYNext;
    };
    /**
     * ...
     */
    export type QYDataResult = [
        ?{
            code: 	  number;
            errno: 	  number;
            sqlState: string;
            index: 	  number;
        }, 
        TPQryObject|TPQryObject[],
        ROUT.JSN.Options
    ];
    /**
     * The **payload** returned within a {@link QueryGN} query handler.
     * @category Returnable
     */
    export type QYResult = [QYError, TPQryObject|TPQryObject[]];


    /**
     * A `OpenAPI`-compliant version of a `GNPType`. Depending on the {@link CFG.PNTS.PTOpts.type|PTOpts.type} 
     * of the the `PType`, some `properties` may or may not appear.
     * ### Examples
     * ```javascript
     * // Type(S:Sex:Text)" 
     * {
     *     "type": "string",
     *     "enum": ["M","F","I"]
     * };
     * // "Type(S:MD5)"
     * {
     *     "type": "string",
     *     "pattern": "/^[A-Fa-f0-9]+$/"
     * };
     * // "Type(N@:Int:>1)"
     * {
     *     "type": "array",
     *     "items": {
     *         "type": "integer",
     *         "minimum": 1
     *     },
     *     "minItems": 0,
     *     "maxItems": 2
     * };
     * ```
     * @category Returned
     */
    export interface DocPType<T extends TPDocPrims, I extends boolean> {
        /**
         * @see {@link CFG.PNTS.PTOpts.type|PTOpts.type}
         */
        type: T;
        /**
         * @see {@link CFG.PNTS.PTArgs.hidden|PTArgs.hidden}
         */
        format?: T extends ('integer'|'number') ?
                    'int32' | 'int64'  | 'float' | 'double' : (
                        T extends 'string' ? 
                            'byte' | 'binary' | 'date' | 'date-time' | 'password' :
                            never );
        /**
         * @see {@link CFG.PNTS.PTArgs.selects|PTArgs.selects}
         */
        enum?: Array<({label:string,value:string}|string)>;
        /**
         * @see {@link CFG.PNTS.PTArgs.regex|PTArgs.regex}
         */
        pattern?: T extends 'string' ? string : never;
        /**
         * @see {@link CFG.PNTS.PTArgs.min|PTArgs.min}
         */
        minimum?: T extends ('integer'|'number') ? number : never;
        /**
         * @see {@link CFG.PNTS.PTArgs.max|PTArgs.max}
         */
        maximum?: T extends ('integer'|'number') ? number : never;
        /**
         * @see {@link CFG.PNTS.PTArgs.step|PTArgs.step}
         */
        multipleOf?: T extends ('integer'|'number') ? number : never;
        /**
         * For `OpenAPI` documentation purposes.
         */
        items?: I extends true ? Array<DocPType<T,I>> : never;
        /**
         * @see {@link CFG.PNTS.PTArgs.slice|PTArgs.slice}
         */
        minItems?: I extends true ? number : never;
        /**
         * @see {@link CFG.PNTS.PTArgs.slice|PTArgs.slice}
         */
        maxItems?: I extends true ? number : never;
    };
    /**
     * A plain-object version of a {@link GNDescr}.
     * @category Returned
     */
    export interface DocDescr {
        in: PTo;
        description: string;
        required: boolean;
        schema: DocPType<TPDocPrims,boolean>;
        matches: { [matchName: string]: string; };
    };
    /**
     * A plain-object version of a {@link GNParam}.
     * @category Returned
     */
    export interface DocParam extends Omit<DocDescr, 'matches'> {
        name: string;
    };


    /**
     * A defined collection of `Arrays` where the `keys` is the name of an `HTTP_MSG Error` 
     * that will be triggered if any of the **schemes** within the corresponding `Array` 
     * are matched.
     * @category Collection
     */
    export type CLRouteER = { [K in HTTP_ERRORS]: (string|RegExp)[]; };
    export interface CLRouteER { [errorMessage: HTTP_ERRORS]: (string|RegExp)[]; };
    /**
     * A collection of {@link GNParam} objects.
     * @category Collection
     */
    export interface CLParameters { [paramName: string]: GNParam; };
    /**
     * A collection of {@link GNParam}, or `boolean`/`[string]` references to params 
     * a {@link CFG.PNTS.Defaults|PNTS.Defaults} definition.
     * @category Collection
     */
    export interface CLParams { [paramName: string]: (GNParam|boolean|Array<string>); };
    /**
     * A collection of Header {@link GNDescr} objects.
     * @category Collection
     */
    export interface CLHeaders { [headerName: string]: GNDescr|GNParam; };
    /**
     * A collection of Query-Match description.
     * @category Collection
     */
    export interface CLMatches { [paramName: string]: string; };
    /**
     * A collection of {@link RouteAU} objects.
     * @category Collection
     */
    export interface CLRouteAU { [routeName: string]: RouteAU; };
    /**
     * A collection of {@link RouteDB} objects.
     * @category Collection
     */
    export interface CLRouteDB { [routeName: string]: RouteDB; };
    /**
     * A collection of {@link RouteAU}/{@link RouteDB|DB} objects.
     * @category Collection
     */
    export interface CLRoutes<T extends (RouteAU|RouteDB)> { [routeName: string]: T; };
    /**
     * A collection of {@link PType} instances.
     * @category Collection
     */
    export interface CLPTypes { [typeName: string]: PType; };
    /**
     * A collection of {@link PType.sanitizers|type-sanitizers} for all of the {@link GNParams|params} 
     * defined on each of the {@link CFG.PNTS.Method|methods} within a {@link CFG.PNTS.Base|EndPoint}.
     */
    export interface CLSanitizers { 
        [pathName: string]: { 
            [methodName: string]: { 
                [paramName: string]: CBSanitizer 
            } 
        } 
    };
    /**
     * A collection of {@link HMETHODs}.
     * @category Collection
     */
    export interface CLMethods { [methodGroup: string]: HMETHOD[]; };
    /**
     * A specific handlers that need to be defined in {@link CFG.PNTS.Auth.Method|Auth.Method}s.
     * @category Collection
     */
    export interface CLProcs { 
        /**
         * If this `AuthPoint` uses a **Basic Authorization** `header`, set to `true`.
         */
        Decrypt?: boolean;
        /**
         * The handler for any errors that may occur while processing this `AuthPoint`.
         */
        Error: (CBProc|HTTP_ERRORS); 
        /**
         * The handler called when **no** `session-data` is found when processing this `AuthPoint`.
         */
        NoData: (CBProc|HTTP_ERRORS); 
        /**
         * The main handler for processing this `AuthPoint`.
         */
        Main: CBProc; 
    };


    /**
     * Configuration `interfaces` for-use within the files located in the `config/` folder.
     * 
     * | Config       | Location                   |
     * |:------------:|:--------------------------:|
     * | `Settings`   | `config/settings.cfg.js`   |
     * | `Database`   | `config/database.cfg.js`   |
     * | `Spaces`     | `config/namespaces.cfg.js` |
     * | `AuthPoints` | `config/authpoint.cfg.js`  |
     * | `DataPoints` | `config/endpoint.cfg.js`   |
     */
    export namespace CFG {
        /////////////////////////////////////////////////////////////////////////////////
        namespace STTG {
            /**
             * An object specifiying paths to `SSL` files.
             */
            export interface SSL {
                /**
                 * A path to a `Certificate Authority` file.
                 */
                CA?: string;
                /**
                 * A path to a `SSL Certificate` file.
                 */
                Cert: string;
                /**
                 * A path to a `Private Key` file.
                 */
                Key: string;
                /**
                 * A path to a `Diffie-Hellman Parameter` file.
                 */
                DHP?: string;
            };

            /**
             * A plain-object that describes a `Folder` (_located in `./`_) for **file-serving**.
             */
            export interface Folder {
                /**
                * The name of the `Folder` (_i.e: `./${folder}`_).
                */
                Folder:  string;
                /**
                * The maximum time -- in seconds -- that the files served from this folder will be allowed to 
                * be **cache** for.
                * @default 3600
                */
                Age?: 	 number;
                /**
                * A `RegexP` pattern that determines the files within this folder that are allowed to be served.
                * @default /\?(?:\w+=.+)$/
                */
                Matcher?: RegExp;
                /**
                * A `callback` that takes a `File` and processes appropriate **HTTP-Headers** based on your needs
                */
                Headers?: (file: File) => { [headerName: string]: string; };
            };
            /**
             * A collection of {@link Folder} objects.
             */
            export interface Folders { [folderName: string]: Folder; };

            /**
             * Describes a `REDIS` database by it's internal `index`, and gives it a `name` 
             * for use within the application configs.
             */
            export interface REDIS_DB<IndexValue extends number, NameValue extends string> {
                /**
                 * The internal `index` of the `DB` deemed by your `REDIS` server.
                 */
                Index: IndexValue;
                /**
                 * A `name` that is exposed to  {@link CFG.AuthPoints} & {@link CFG.DataPoints} 
                 * configurations via the `REDIS` object. (_`Reserved` properties are **not** included in the `REDIS` object_)
                 */
                Name: NameValue;
                /**
                 * If `True`, flushes this `REDIS` DB on the next restart.
                 */
                Flush?: boolean;
            };

            /**
             * The collection of manadatory and custom `REDIS` DBs.
             */
            export type REDIS_DBs = [
                REDIS_DB<1, 'Users'>,
                REDIS_DB<2, 'Groups'>,
                REDIS_DB<3, 'Limits'>,
                REDIS_DB<4, 'Lockers'>,
                REDIS_DB<5, 'Alerts'>,
                ...STTG.REDIS_DB<number, string>[]
            ];

            /**
             * A configuration object used to protect against 
             * [Brute-Force Attacks](https://en.wikipedia.org/wiki/Brute-force_attack) 
             * for defined endpoints.
             */
            export interface Limits {
                /**
                 * The amount of requests an client can make per the rate specified in 
                 * this config's key.
                 */
                total: number;
                /**
                 * The method this middleware will listen on.
                 */
                method: 'all' | 'get' | 'post' | 'put' | 'delete';
                /**
                 * A string representing properties of the `Request` object that will be 
                 * used in determining the abuse being made.
                 * 
                 * ### Examples:
                 * ```js
                 * // This will track any abuse from a unique IP.
                 * { ..., lookup: ['connection.remoteAddress'] }
                 * // This will track any abuse from a specific User Token with a unique IP.
                 * { ..., lookup: ['headers.token', 'connection.remoteAddress'] }
                 * // This will track any abuse from a specifc User Token.
                 * { ..., lookup: ['headers.token'] }
                 * ```
                 */
                lookup: string[];
                /**
                 * An array of endpoint paths that should be omitted from a 
                 * {@link Settings.Session.Limits.All|global} proptection.
                 */
                omit?: string[];
            };

            /**
             * Configurations for authenticating users. If this is not set, the App assumes 
             * access to any APIs & Pages are available to all who poll them.
             */
            export interface Auth {
                /**
                 * The API Endpoints used for logging In, Out, and Notification.
                 */
                Paths: {
                    /**
                     * The path of your **login** endpoint (_default: `/auth/login`_).
                     */
                    IN:  string;
                    /**
                     * The path of your **logout** endpoint (_default: `/auth/logout`_).
                     */
                    OUT: string;
                    /**
                     * (`PROTECTED`) The path for all **notification**.
                     */
                    ALERT: '__notify__';
                };
                /**
                 * If `true`, flushes `REDIS` DBs, `CLient (0)` & `User (1)`, which hold the 
                 * the user-sessions and APIKeys. It essentially forces all users to log 
                 * back in. This can be useful when you make changes are made to the authenitcation 
                 * strategy, or if you'd rather a session refresh after any sort of developer 
                 * maintenance.
                 * 
                 * > ### IMPORTANT:
                 * > If you'd only like to flush these sessions as a one-time ordeal, still keeping 
                 * > sessions intact after subsequent restarts, you'll need to restart the server 
                 * > twice; once with `Flush: true`, and once more with `Flush: false`.
                 */
                Flush: boolean;
                /**
                 * The SQL query definitions for authenticating and retrieving the generic user-object.
                 */
                SQL: {
                    /**
                     * The SQL query you'd like the App to use when authenticating. 
                     * 
                     * The query needs to retieve three values set to specific aliases:
                     * 
                     * | COLUMN       | ALIAS      | DESCRIPTION |
                     * | -----------: | :--------: | :---------- |
                     * |  **User ID** |   `uid`    | A unique, immutable identifier for your users. |
                     * |    **Login** | `account`  | The account-name your users will use to authenticate. |
                     * | **Password** | `password` | The users password they set for themselve. |
                     * 
                     * Where `Login` is equaled to `?`. The `WHERE` clause _must_ use the `= ?`, and any other 
                     * columns after the first two are _ignored_.
                     * 
                     * ### Example:
                     * ```sql
                     * SELECT u.user_id     AS `uid`      # Must-use Alias
                     *       u.user_email  AS `account`, # Must-use Alias
                     *       u.user_passwd AS `password` # Must-use Alias
                     * FROM   my_users AS u 
                     * WHERE  u.user_email = ? # MUST BE '?'
                     * ```
                     */
                    Login: string;
                    /**
                     * The SQL query the App will use to retrieve the general user-object 
                     * that is passed to any authenitcated webpages. The `WHERE` clause must 
                     * use `{{Login-Name}} = ?`.
                     * 
                     * It **must** retrieve the columns that you'll define in {@link Format.UID} 
                     * & {@link Format.Account}. Any other columns can be included either as 
                     * {@link Format.Profile} properties or {@link Format.Scopes} properties.
                     * 
                     * ### Example:
                     * ```sql
                     * SELECT u.user_id,
                     *       u.user_email, 
                     *       u.user_fullname,
                     *       u.user_type
                     * FROM   users AS u 
                     * WHERE  u.user_email = ?
                     * ```
                     */
                    Profile: string;
                };
                /**
                 * ...
                 */
                Format: {
                    /**
                     * The MySQL column that will yield the `UserID`.
                     */
                    UID: string;
                    /**
                     * The MySQL column that will yield the user's `Login-Name`. This can be an 
                     * `Email Address`, `User Name`, etc., as long as it is the string the user 
                     * will be using to log into their account.
                     */
                    Account: string;
                    /**
                     * An array of other descriptional columns you'd like to be included in the 
                     * genral user-object that it passed to each authenticated webpage 
                     * (_defined in {@link SQL.Profile}_).
                     */
                    Profile: string[];
                    /**
                     * An array of columns that should be used to define the scope of a user's 
                     * access to features in the App. These would then be leveraged by you in your 
                     * endpoint definitions to restrict or allow their usage.
                     */
                    Scopes: string[];
                };
            };

        };
        /**
         * Configurations for this `Application` server. 
         * ### Example
         * These are placed in `config/settings.cfg.js`.
         * ```js
         * module.exports = {
         *     Debug:      false,
         *     Port:       8080,
         *     SSL:        {
         *         Cert:   "./mysite.chain.pem",
         *         Key:    "./mysite.key.pem",
         *     },
         *     Services:   [
         *         'http://localhost:8080/gbl-accessor',
         *         'http://localhost:8080/gbl-rest',
         *     ],
         *     APIDoc:     { ... },
         *     Folders:    {
         *         Publics:    {
         *             Folder:  'public',
         *             Age:     365*86400,
         *             Matcher: /\?(?:\w+=.+)$/,
         *             Headers: null,
         *         },
         *         Uploads:    { ... },
         *     },
         *     Session:    {
         *         Secret: "¿mYd0GiS!nmYeyE&shEs4yS@uE?",
         *         Age:    { In: ((1000*60*60)*24), Out: (1000*300) },
         *         REDIS:  {
         *             Config: {
         *                 Host: 'localhost',
         *                 Port: 6379,
         *                 Password: 'p@55w012d',
         *             },
         *             Main:   { Index: 0, Name: 'Client' },
         *             Stores: [
         *                 { Index: 1, Name: 'Users'   },
         *                 { Index: 2, Name: 'Limits'  },
         *                 { Index: 3, Name: 'Lockers' },
         *             ]
         *         },
         *         Auth:   {
         *             Flush:  false,
         *             SQL:    {
         *                 Login:   "SELECT user_name, password FROM users WHERE user_name = ?",
         *                 Profile: "SELECT * FROM users WHERE id = ?"
         *             },
         *             Format: {
         *                 Account: 'user_name',
         *                 Profile: [ ... ],
         *                 Scopes:  [ ... ]
         *             }
         *         },
         *         Limits: {
         *             All: {
         *                 "IP/Day": {
         *                     total: 5000, method: 'all',
         *                     lookup: ['connection.remoteAddress'],
         *                 },
         *             },
         *             Optional: {
         *                 "Constant/Second": {
         *                     total: 200,   method: 'get',
         *                     lookup: ['connection.remoteAddress']
         *                 }
         *             }
         *         }
         *     }
         * };
         * ```
         * @category App
         */
        export interface Settings {
            /**
             * The `logging` mode. This can be changed to see **more** or **less** details. It can also be
             * _exploited_ in your own `logging` using the `import('dffrnt.utils').LG` `functions`.
             * @default false
             */
            Debug:    boolean;
            /**
             * The `Port Number` this web-server will listen on.
             * @default 3001
             */
            Port:     number;
            /**
             * An object specifiying paths to `SSL` files. This is `null`, if `SSL/HTTPS/2` is not 
             * required. If it is configured, and the {@link CFG.Settings.SSL.Cert} and/or {@link CFG.Settings.SSL.Key} 
             * files are nowhere to be found, you'll obviously have issues.
             */
            SSL?:      STTG.SSL;
            /**
             * An `optional` list of any `URLs` pointing to `auth`/`rest` `Spaces` (_see: {@link CFGSpaces}_) that this particular 
             * web-server may need to connect to **remotely**. This allows you to customize the `FQDN` of any `auth`/`rest` 
             * `Spaces` you've configured without breaking the whole system (lol).
             * 
             * A `Space` is really just a `Socket.IO.Namespace` that Client-Browsers and instances of `dffrnt.api` can 
             * connect to. Depending on the implementation of `dffrnt.api`, certain `Spaces` will be required to connect
             * to another `auth`/`rest` `Space` -- even if all of said `Spaces` are within the same instance:
             * 
             * | Instance | Requirement |
             * | :---: | --- |
             * | `auth` only | Needs a remote connection to it's internal Namespace. |
             * | `rest` only | Needs a remote connection to an `auth-Space` (_if using authentication_). |
             * | `page` only | Needs a remote connection to a `rest-Space` (_unless page data is all static_). |
             * | `auth`+`rest` | Needs a remote connection to a `auth-Space`. |
             * | `rest`+`page` | Needs a remote connection to a `rest-Space`. |
             * | `auth`+`rest`+`page` | Needs a remote connection to an `auth-Space` and a `rest-Space`. |
             * 
             * If this property is **not set**, the system will assume `${protocol}://localhost/gbl-${spaceName}`, where 
             * `${spaceName}` is the `name` provided for any given `auth`/`rest` `Space` in {@link CFGSpace.config}.
             * 
             * These can refer to `Spaces` that are internal, as well as external to this particular web-server. This can be 
             * useful when there becomes a need to "break up" the functionality into separate web-server. Take this project 
             * structure, for **example**:
             * ```plaintext
             * [Your-Machine]
             *    ├── dffrnt.api-auth/ >> This web-server will handle the Authentication @ https://localhost:7443/gbl-auth
             *    ├── dffrnt.api-rest/ >> This web-server will handle the Data Requests  @ https://localhost:8443/gbl-rest
             *    └── dffrnt.api-view/ >> This web-server is the Web-App for the Clients @ https://mysite.com
             * ```
             * The settings for each **instance** would be configured as follows:
             * ```javascript
             * // [Your-Machine]/dffrnt.api-auth/config/settings.cfg.js
             * module.exports = {
             *     // Needs a remote connection to it's internal Namespace.
             *     Services: ["https://localhost:7443/gbl-auth"]
             * };
             * // [Your-Machine]/dffrnt.api-auth/config/settings.cfg.js
             * module.exports = {
             *     // Needs a remote connection the auth-Space.
             *     Services: ["https://localhost:7443/gbl-auth"]
             * };
             * // [Your-Machine]/dffrnt.api-auth/config/settings.cfg.js
             * module.exports = {
             *     // Needs a remote connection to the auth-Space, and the rest-Space.
             *     Services: ["https://localhost:7443/gbl-auth","https://localhost:8443/gbl-rest"]
             * };
             * ```
             * In the scenario above, you have a **single-machine** running **3-instances** of `dffrnt.api`. Each are 
             * configured accordingly to handle their specified tasks. 
             * 
             * But what if you wanted to take the separation even further? Like using separate machines for each
             * instance? For example
             * ```plaintext
             * [Machine-1]
             *    ├── dffrnt.api-auth/ >> This machine will handle the Authentication @ Port 443 (https://auth.mysite.com)
             * [Machine-3]
             *    ├── dffrnt.api-rest/ >> This machine will handle the Data Requests @ Port 443 (https://rest.mysite.com)
             * [Machine-3]
             *    └── dffrnt.api-view/ >> This machine will is the actual WebApp @ Port 443 (https://mysite.com)
             * ```
             * The settings for each would be configured as follows:
             * ```javascript
             * // [Machine-1]/dffrnt.api-auth/config/settings.cfg.js
             * module.exports = {
             *     // Needs a remote connection to it's internal Namespace.
             *     Services: ["https://auth.mysite.com"]
             * };
             * // [Machine-2]/dffrnt.api-auth/config/settings.cfg.js
             * module.exports = {
             *     // Needs a remote connection the auth-Space.
             *     Services: ["https://auth.mysite.com"]
             * };
             * // [Machine-3]/dffrnt.api-auth/config/settings.cfg.js
             * module.exports = {
             *     // Needs a remote connection to the auth-Space, and the rest-Space.
             *     Services: ["https://auth.mysite.com","https://rest.mysite.com"]
             * };
             * ```
             * You could take it even further, setting up multiple instances of each implementation, every one
             * of them on their own machine, use `NGinX` (or something) to load-balance each `Service` and 
             * these config-settings would still apply. Unfortunately, I don't have the time or patience to
             * write up that example.
             */
            Services: Array<string>;
            /**
             * `dffrnt.api` comes with `OpenAPI 3.0` support by _automagically_ (lol) creating `REST` documentation 
             * for any `EndPoints` created within your `App`. That said, the **top-level** description of your `REST-API` 
             * is up to you to define.
             * 
             * Once the application-server is up and running, the `JSON` document can be found at `/apidocs`.
             * 
             * This is shot-for-shot the same `info`, `externalDocs`, and `servers` object described in the 
             * **[OpenAPI 3.0](https://swagger.io/specification/#oasObject)** spec (_execpt for the `openapi` version_), so 
             * check that out to get an idea of what goes where. Any other objects are defined... __automagically_ (LOL).
             * 
             * ### Example
             * ```javascript
             * {
             *     info: {
             *         title: "My API",
             *         description: "It's an API Doc.",
             *         termsOfService: "https://www.mysite/terms",
             *         contact: { 
             *             name: "My Site Support",
             *             email: "custome.support@mysite.com",
             *             url: "https://www.mysite/support",
             *         },
             *         version: "2.1.8"
             *     },
             * }
             * ```
             */
            APIDoc:   {
                /**
                 * _**See:** [OpenAPI.info](https://swagger.io/specification/#infoObject)_
                 */
                info: {
                    title: string;
                    description?: string;
                    termsOfService?: string;
                    /**
                     * _**See:** [OpenAPI->contactObject](https://swagger.io/specification/#contactObject)_
                     */
                    contact?: { 
                        name: string;
                        email: string;
                        url: string;
                    };
                    /**
                     * _**See:** [OpenAPI->licenseObject](https://swagger.io/specification/#licenseObject)_
                     */
                    license?: {
                        name: string;
                        url?: string;
                    };
                    version: string;
                },
                /**
                 * _**See:** [OpenAPI.externalDocs](https://swagger.io/specification/#externalDocumentationObject)_
                 */
                externalDocs?: {
                    url: string; 
                    description?: string;
                };
                /**
                 * _**See:** [OpenAPI->serverObject](https://swagger.io/specification/#serverObject)_
                 */
                servers?: { 
                    url: string; 
                    description?: string;
                    /**
                     * _**See:** [OpenAPI->erverVariableObject](https://swagger.io/specification/#serverVariableObject)_
                     */
                    variables?: {
                        [variableName: string]: {
                            enum: string[];
                            default?: string;
                            description: string;
                        };
                    }
                }[];
            };
            /**
             * A collection of {@link STTG.Folder} configurations for **file-serving**. 
             * 
             * The `dffrnt.api` framework automatically installs and uses two predefined 
             * -- _and `reserved`_ -- {@link STTG.Folder}s, `Publics` & `Uploads`. These folder 
             * configurations are `required` **internally**, but can be altered by redifining them 
             * here; however, doing so -- _particularily,  with `Publics`_ -- could potentially introduce 
             * problems. That said, do it at your own risk, and only if you know what you're doing.
             */
            Folders:   {
                /**
                 * This is where various, **public**, _browser-related_ files/folders go:
                 * 
                 * | Location | Description |
                 * | --- | --- |
                 * | `public/comps` | `Bower` components. |
                 * | `public/css` | `CSS` files. |
                 * | `public/less` | `LESS` files; if using. |
                 * | `public/fonts` | Various `Font` files. |
                 * | `public/html` | Extra `HTML` files. |
                 * | `public/images` | Site `Images`. |
                 * | `public/images/icons` | Site `Icons` |
                 * | `public/js` | Important `JavaScript` **bundles**, and extra files (_if needed_). |
                 * 
                 * ### Default Properties:
                 * ```javascript
                 * {
                 *     Publics: {
                 *         Folder:  'public',
                 *         Age: 	 365*86400,
                 *         Matcher: /\?(?:\w+=.+)$/,
                 *     },
                 * }
                 * ```
                 * @reserved
                 */
                Publics: STTG.Folder,
                /**
                 * This is where any uploads to your site will go. The **name** and **structure** of 
                 * this directory is entirely up to you.
                 * 
                 * ### Default Properties:
                 * ```javascript
                 * {
                 *     Uploads: {
                 *         Folder:  'storage',
                 *         Age: 	 365*86400,
                 *         Matcher: /\?(?:\w+=.+)$/,
                 *     },
                 * }
                 * ```
                 * @reserved
                 */
                Uploads: STTG.Folder,
                [folderName: string]: STTG.Folder,
            };
            /**
             * Configurations for **session-handling**, **authentication**, and **call-limits**.
             */
            Session:  {
                /**
                 * An arbitrary `string` used to sign `sessions`. The longer the better.
                 */
                Secret: string;
                /**
                 * The **maximum** `Age` of _saved_ (`In`) & _unsave_ (`Out`) `SessionCookies`.
                 */
                Age: {
                    /**
                     * This is the **maximum** `Age` -- _in milliseconds_ -- of an _unsaved_ `SessionCookie`. This 
                     * _must_ be **shorter** than the {@link Age.In} value.
                     */
                    Out: number;
                    /**
                     * This is the **maximum** `Age` -- _in milliseconds_ -- of an _saved_ `SessionCookie`. A 
                     * `SessionCookie` is _saved_ when a `User` is considered `logge-in`. This _must_ be **longer** 
                     * than the {@link Age.Out} value.
                     */
                    In: number;
                    /**
                     * An `optional`, **maximum** `Age` -- _in milliseconds_ -- of an _saved_ `SessionCookie`. This 
                     * used for offering a "remember-me" option when logging in. This _must_ be **longer** than the 
                     * {@link Age.In} value.
                     * 
                     * In oder to tell the system to save a "remember me" session, the {@link CLProcs.NoData|NoData Proc} 
                     * in your "Login" endpoint {@link PNTS.Method|Method} needs to add the `__rem: boolean` property to 
                     * the sessionSave data of it's response, using the value sent from the client request:
                     * ```javascript
                     * {
                     *    Login: new RouteAU({
                     *       POST: () => {
                     *          Proc: {
                     *             async NoData (req) {
                     *                // ...
                     *                return {
                     *                   send: [ ... ],
                     *                   next: ['Save', { 
                     *                      id: user.id, 
                     *                      acct: user.Account, 
                     *                      token: user.Token, 
                     *                      __rem: body.remember_me, // <-----
                     *                   }],
                     *                }
                     *             }
                     *          }
                     *       }
                     *    })
                     * }
                     * ``` 
                     */
                    Rem?: number;
                };
                /**
                 * Configurations for the `REDIS` server. This is used for **sessions**, but any _non-`reserved`_ `DBs` 
                 * are exposed to {@link CFG.AuthPoints} & {@link CFG.DataPoints} configuration. Those would be declared 
                 * here and can serve any purpose you want them to.
                 * 
                 * `Reserved` `DBs` are as follows:
                 * 
                 * | Name      | Description |
                 * | :-------: | :---------: |
                 * | `Client`  | The user-sessions store. |
                 * | `Users`   | The user-token store. |
                 * | `Groups`  | The aggregate user-session store. |
                 * | `Limits`  | The brute-force logging store. |
                 * | `Lockers` | The server-side structure store. |
                 * | `Alerts`  | The notification store. |
                 * 
                 * Their `Index` properties can be changed (_if you already have `DBs` in-use_), but their `Name` must remain the same. 
                 * (_IT's a weird way to do things, I know, but `REDIS` only use indexes to reference their `DBs`._)
                 */
                REDIS: {
                    /**
                     * The `properties` used to connect to your `REDIS` server.
                     */
                    Config: {
                        /**
                         * The `url`/`ip-address` of your `REDIS` server.
                         */
                        Host: string;
                        /**
                         * The `port-number` of your `REDIS` server.
                         */
                        Port: number;
                        /**
                         * The `password` of your `REDIS` server.
                         */
                        Password: string;
                    };
                    /**
                     * This is the `DB` where all session-data is stored. The `Index` can be changed; the `Name` 
                     * **cannot** be.
                     * @reserved
                     */
                    Main: STTG.REDIS_DB<0, 'Client'>;
                    /**
                     * The other stores. The first **6** are `resvered`, but you can add more if you'd 
                     * like. The `Indexes` of the `reserved` stores can be changed; their `Names` **cannot** 
                     * be.
                     * @reserved
                     */
                    Stores: STTG.REDIS_DBs;
                };
                /**
                 * ...
                 */
                Auth: STTG.Auth;
                /**
                 * Configuration for protecting against [Brute-Force Attacks](https://en.wikipedia.org/wiki/Brute-force_attack).
                 * 
                 * The `limitName` is important, as it's format tells the App the rate at which 
                 * a client is restricted to the specified amount of requests:
                 * > `"{{arbitraryName}}/{{rate([0-9]*\w+)}}"`
                 * 
                 * * `{{arbitraryName}}` is just that, an arbitrary name identifier for you.
                 * * `{{rate}}` is a duration-string, represetning a duration-unit. 
                 *   * This can be one of:
                 *     | Key | Short |
                 *     | :---: | :---: |
                 *     | `Year(s)` | `y` |
                 *     | `Month(s)` | `M` |
                 *     | `Week(s)` | `w` |
                 *     | `Day(s)` | `d` |
                 *     | `Hour(s)` | `h` |
                 *     | `Minute(s)` | `m` |
                 *     | `Second(s)` | `s` |
                 *     | `Millisecond(s)` | `ms` |
                 *   * If a number `n` precedes this `unit`, it is taken as "per `n`th `unit`":
                 *     | Dur-String | Representation |
                 *     | :----: | :---: |
                 *     | `3Day` | Per **3** (`n`) **day** (`unit`) cycle" |
                 *     | `2M`   | Per **2** (`n`) **month** (`unit`) cycle" |
                 * 
                 * ### Example:
                 * To define a **limit** that should protect against an IP attempting a to login more 
                 * than 5 times within a 3 hour cycle, you'd write:
                 * ```js
                 * {   "Logins/3Hours" : {
                 *         total: 5, 
                 *         method: 'post',
                 *         lookup: ['connection.remoteAddress']
                 * }   }
                 * ```
                 */
                Limits: {
                    /**
                     * Global **Brute-Force** protections. All endpoints will adhere to these.
                     */
                    All: { [limitName: string]: STTG.Limits; };
                    /**
                     * Specific **Brute-Force** protections. Any endpoints you'd like to adhere to 
                     * these rules must include the `limitName` in their definitions:
                     * * {@link PNTS.Auth.Route.Limits|Auth.Route}/{@link PNTS.Auth.Method.Limits|Auth.Method}.
                     * * {@link PNTS.Data.Route.Limits|Data.Route}/{@link PNTS.Data.Method.Limits|Data.Method}.
                     */
                    Optional: { [limitName: string]: STTG.Limits; };
                };
            };
            /**
             * An collection of `optional` `Plugins` that you can define and use within
             * `config/authpoints.cfg.js` & `config/endpoints.cfg.js` via the `Plugins` object.
             */
            Plugins:  { [pluginName: string]: <T>() => T };
        };

        /////////////////////////////////////////////////////////////////////////////////
        namespace MSQL {
            /**
             * The options of a `MySQLPool` connection. (_Configured in {@link CFG.Database.Pool}).
             */
            export interface Pool {
                /**
                 * The **host** IP/URL of the `MySQLPool`. This is `required` if your `MySQLServer` is **not** 
                 * on `localhost`; otherwise, `optional`.
                 * @default "localhost"
                 * @category Main Pool
                 */
                host: string;
                /**
                 * The **user** of the `MySQLPool`. (_Serves as a `default` when defined in {@link CFGDatabase.Config}_)
                 * @default "root"
                 * @category Other Pool
                 */
                user?: string;
                /**
                 * The **password** of the `MySQLPool`. (_Serves as a `default` when defined in {@link CFGDatabase.Config}_)
                 * @category Other Pool
                 */
                password?: string;
                /**
                 * The **database** of the `MySQLPool`. (_Serves as a `default` when defined in {@link CFGDatabase.Config}_)
                 * @default "mysql"
                 * @category Other Pool
                 */
                database?: string;
            };
            /**
             * The `global` options of a `MySQLServer` connection. (_Configured in {@link CFG.Database.Config}).
             */
            export interface Options extends Pool {
                /**
                 * A `default` **host** IP/URL of the `MySQLServer`. This is `required` if you are **not** configuring multiple `Pools` 
                 * in {@link CFGDatabase.Pool} configurations and your `MySQLServer` is **not** on `localhost`; otherwise, `optional`. This 
                 * can also serve as a `fallback` server in the event that the other `Pools` are unreachable.
                 * @category Main Pool
                 */
                host?: string;
                /**
                 * The `global` **host** of any defined `MySQLPool`.
                 * @default 100
                 * @category Server Limit
                 */
                connectionLimit?: number;
                /**
                 * The interval -- _in **seconds**_ -- at which to keep the `Pool` connection alive. This triggers the system to
                 * `ping` each `Pool` at the specified interval to avoid connection loss.
                 * @default 300000
                 * @category Server Limit
                 */
                keepAlive?: number;
                /**
                 * A flag to enable/disable **multiple-statements** on the `MySQLPool(s)`.
                 * @default "false"
                 * @category Server Option
                 */
                multipleStatements?: boolean;
                /**
                 * The **debug** flag of the `MySQLPool(s)`.
                 * @default "false"
                 * @category Server Option
                 */
                debug?: boolean;
            };
        }
        /** 
         * Configurations for a `MySQL` server. 
         * ### Example
         * These are placed in `config/database.cfg.js`.
         * ```javascript
         * module.exports = {
         *     Queue: 20,
         *     Config: {
         *         user: 'root', 
         *         password: 'p@55w012d',
         *         database: 'mysql', // The DB
         *         connectionLimit: 50,
         *         multipleStatements: true,
         *         debug: false,
         *         keepAlive: 300000
         *     },
         *     Pool: {
         *         Server1: {
         *             host: 'localhost:3001', 
         *         },
         *         Server2: {
         *             host: 'localhost:3002', 
         *         },
         *         Server3: {
         *             host: 'localhost:3003', 
         *         },
         *     }
         * };
         * ```
         * @category App
         */
        export interface Database {
            /**
             * The amount of connection to have queued at any given time.
             * @default 5
             */
            Queue: number;
            /**
             * The `global` options of a `MySQLServer` connection. Any `properties` set here
             * (_that are allowed in {@link CFG.MSQL.Pool}_) will be applied to any `Pools` 
             * within {@link CFG.Database.Pool} if said `properties` are left unset.
             */
            Config: MSQL.Options;
            /**
             * A configuration collection of multiple `MySQLPools`. Any `properties` left unset within 
             * a particular `Pool` will use those set within {@link CFG.Database.Config} 
             * (_or it's `defaults` if said `properties` are left unset_).
             * 
             * ### Example:
             * ```javascript
             *     Config: {
             *         user:     'myusename',
             *         password: 'mYp@55w012d',
             *         database: 'mydatabase',
             *     }, 
             *     // Both Pools will inherit Config['user','password' & 'database'].
             *     Pool: {
             *         Server1: { host: '1.2.3.4' }, // 1st Pool
             *         Server2: { host: 'db.mydomain.com' }, // 2nd Pool
             *         // ...
             *     }
             * ```
             */
            Pool: { [poolName: string]: MSQL.Pool; };
            /**
             * The _internal_ **queue** of Connections.
             * @private
             */
            Bucket: MySQL.Connection[];
        };

        /////////////////////////////////////////////////////////////////////////////////
        namespace SPCE {
            /**
             * The type of `Space` this configuration represents.
             * 
             * (_**See:** {@link CFG.SPCE.Space.type|Space.type}_)
             */
            export type Type = 'auth' | 'rest' | 'page';
            /**
             * A plain-object, describing a `File` that will be **HTTP-PUSHED** to the Client Browser by **default**.
             */
            export interface Push {
                /**
                 * The encoding-type of the `File`.
                 */
                enc: 'ascii' | 'utf8' | 'utf16le' | 'ucs2' | 'base64' | 'latin1' | 'binary' | 'hex';
                /**
                 * The the relative path of the `File`.
                 */
                path: string;
            };
            /**
             * A plain-object, describing the `properties` of a `page`-`Space`.
             */
            export interface Page {
                /**
                 * A `callback` that **dynamicaly** determines a `<title>` for the `Page`.
                 * @param path The **originalUrl** path of the page request.
                 * @param user The user object; if applicable.
                 * @param payload The page payload-object; if applicable.
                 * @returns Either a **dynamically** processed `string`, or just a **static** `string`.
                 */
                title(path?: string, user?: {}, payload?: {}): string;
                /**
                 * Specifies a list of names (_no extenstion_) of the `CSS` files to use when rendering the `Page`. These files
                 * kept - and can be defined in - `./main/browser/lib/src/elements/lib/`.
                 */
                CSS: string[];
                /**
                 * If `true`, **enables** a dynamic, **top-level** `<style>` you've defined in your impelementation 
                 * of this `Space` (_see {@link dffrnt.views}_).
                 */
                styles: boolean;
                /**
                 * Specifies the name (_no extenstion_) of the `ReactJSX` file to use to render the `Page`. These files
                 * kept - and can be defined in - `./main/browser/lib/src/elements/lib/`.
                 */
                main: string;
                /**
                 * The structure-type the `Page` will follow. 
                 * 
                 * These can be exploited in you own `JSX` implementation of the `<App/>` component within your 
                 * {@link Page.main} file, located in `main/browser/lib/src/elements/lib`. This will be passed to the
                 * `component` and can be used to determine a `tag`, `class`, etc. given a particular `page`.
                 * 
                 * ### Example
                 * With the default `<App/>` component, there are **3** types one can choose from:
                 * 
                 * | Type   | Description |
                 * | :---:  | :--- |
                 * | `stock` | A general page-structure, with a `heading` & `sidebar`. |
                 * | `cover` | A profile-page structure, simailar to `stock`, but includesa `cover` & `profile` images. |
                 * | `jumbo` | A full-page structure, usually used for home-pages with large background-image. |
                 */
                type: string;
                /**
                 * ### **[{@link Space.config|Space.config.page} = "page" ONLY]**
                 * If `true`, a _valid session_ is **not** needed 
                 * for a user to access this `page`. 
                 * 
                 * This comes in handy for login, landing, or static pages that do not 
                 * require a user to be logged in. If this App is **not** using 
                 * authentication, this property is overlooked.
                 */
                unlock?: boolean;
            };
            /**
             * A plain-object, describing a `NameSpace` (or simply, `Space`) that can be used to 
             * **serve webpages**, handle **data-reqests**, or **authenitcate**.
             */
            export interface Space {
                /**
                 * The type of `Space` this configuration represents.
                 * 
                 * | Type   | Description |
                 * | :---:  | :--- |
                 * | `auth` | The `Space` will handle authentication. |
                 * | `rest` | The `Space` will handle data reqests. |
                 * | `page` | The `Space` will handle a page rendering. |
                 * | `null` | _Only allow for the `readOnly`, {@link CFG.Spaces.Global}. |
                 */
                type?: Type;
                /**
                 * The central configurations of the `Space`.
                 */
                config: {
                    /**
                     * An arbitrary name for the `Space`.
                     */
                    name:        string;
                    /**
                     * The `RegexP`-`string` representation of the `Space` Path.
                     */
                    scheme?:      string,
                    /**
                     * An arbitrary title used in logging.
                     */
                    title:       string;
                    /**
                     * The description of the `Space`.
                     */
                    description: string;
                    /**
                     * If `true`; this `Space` serves as the STANDARD authenticator. (_`false`; UNLESS YOU **KNOW WHAT YOU ARE DOING**!_)
                     */
                    accessor?:    boolean = false;
                    /**
                     * If authentication is being used, this determines a `Page` to redirect to if the authenticator determines 
                     * that `User` logged-in (`true`) or not (`false`).
                     */
                    restrict?:    { 
                        /**
                         * The `path` of a `page` that the `App` will **redirect** to if a **user-session** is **valid**.
                         * 
                         * This can be exploited, for example, in a `Space` that repesents a **login** page. If the a **user-session** 
                         * is already established, the **user** in question _should not_ be able to navigate to this page. So one can
                         * set this `property` as something like `"home"`, so that said **user** will be `redirected` to `/home` in
                         * the event that they attempt to navigate to `/login`.
                         */
                        true?: string; 
                        /**
                         * The `path` of a `page` that the `App` will **redirect** to if a **user-session** is **invalid**.
                         * 
                         * This can be exploited, for example, in a `Space` that repesents a **profile** page. If the a **user-session** 
                         * is _has not_ been established, the **user** in question _should not_ be able to navigate to this page. So one can
                         * set this `property` as something like `"login"`, so that said **user** will be `redirected` to `/login` in
                         * the event that they attempt to navigate to `/profile/1234`.
                         */
                        false?: string;
                    };
                    /**
                     * A `callback` one can use to check the `payload` of a `Page` for any potential `errors`. If said `errors` resolve 
                     * to being `true`, this is passed to {@link Space.config}.`restrict`, which will `redirect` as specified.
                     * @param payload The page payload-object; if applicable.
                     * @returns A `boolean` that resolves to `true` if an **error** is detected.
                     */
                    errorIF?(payload): boolean,
                    /**
                     * A plain-object, describing a `Page` that this `Space` represents; if applicable.
                     */
                    page?:        Page;
                };
                /**
                 * A list of `auth`/`rest` `Spaces` to expose to other instances of `dffrnt.api`. This can only
                 * be modified in the the `Global Space`.
                 */
                expose?: ['accessor','rest', ...string[]];
            };
            /** @hidden */
            abstract class ABS {
                Global:     Space;
                Accessor:   Space;
                REST:       Space;
                [spaceKey: string]: Space;
            };

            export interface SpaceHandler {
                /**
                 * The `default` structure of any data that it to be recieved from a {@link CFG.SPCE.SpaceHandler.Call}.
                 */
                Data: [CBSpaceStruct];
                /**
                 * When a `page` is request by a Client, this `function` is called to build a request that is needed in order the **render** said `page`. This 
                 * can request `User Data` for a **Profile Page**, perform a `Query Data` for a **Search Page**, etc. The **result** is then passed to the 
                 * {@link SpaceHandler.Build} `function` which you can then use to build the page.
                 * @param path The `path` from the current page-request.
                 * @param params The `path` parameters from the current page-request; if any.
                 * @param query The `query` parameters from the current `GET`/`DELETE` page-request; if any.
                 * @param body The `body` parameters from the current `POST`/`PUT` page-request; if any.
                 * @param files A list a `files` from the current page-request, that are to be uploaded in **this** request.
                 * @param user The `user-session` object from the current page-request.
                 */
                Call(path: string, params: TPQryPathParams, query: TPQryObject, body: TPQryObject, files: string[], user: {}): QYRequest;
                /**
                 * This is where the **magic** happens. The... _Automagic_ (lol). After {@link SpaceHandler.Call} returns a response, it is 
                 * passed to this `function` which server as your handling of the pages stucture data. Think of it as `scaffolding`.
                 * @param Actions *** MIGHT HAVE TO DEPRECATE THIS ONE, THERE, BUDDY ***
                 * @param Stores The `Reflux` stores.
                 * @param LID The lockerID. This is an arbitrary identifier used to mark the server-side `RefluxStore`.
                 */
                Build(Actions: Reflux.Actions, Stores: FluxStores, LID: string): (res: TPQryObject) => any;
            }
        }
        /**
         * A plain-object, describing a collection of `NameSpaces` (or simply, `Spaces`) that will be used to 
         * **serve webpages/files**, handle **data-reqests**, and/or **authenitcation**.
         * ### Example
         * These are placed in `config/namespaces.cfg.js`.
         * ```javascript
         * module.exports = {
         *     PUSH:       [
         *         { enc: 'Base64', path: '/public/images/logo.png' },
         *         { enc: 'utf8',   path: '/public/js/vendor.js' },
         *         { enc: 'utf8',   path: '/public/js/engine.js' },
         *     ],
         *     Global:     { // RESERVED ~ !!!
         *         config: { ... }, 
         *         expose: ['accessor','rest'],
         *     },
         *     Accessor:   { // RESERVED ~ !!!
         *         type:       'auth',
         *         config:     { ... },
         *     },
         *     REST:       { // RESERVED ~ !!!
         *         type:       'rest',
         *         config:     { ... },
         *     },
         *     Error:      {
         *         type:       'page',
         *         config:     {
         *             name:        'error',
         *             scheme:      '/404/',
         *             title:       '404 Error',
         *             description: 'Displaying Errors',
         *             page:        {
         *                 title:      () => '404 Error',
         *                 CSS:        ['style'],
         *                 styles:      false,
         *                 main:       'evectr',
         *                 type:       'jumbo',
         *             },
         *         },
         *     },
         *     Home:       {
         *         type:       'page',
         *         config:     {
         *             name:        'home',
         *             scheme:      '/home/',
         *             title:       'Home Page',
         *             description: 'Landing Page',
         *             page:        {
         *                 title:      () => ('Welcome to My Page'),
         *                 CSS:        ['styles','font-awesome'],
         *                 main:       'stock',
         *                 type:       'jumbo',
         *             },
         *         },
         *     },
         * };
         * ```
         * @category Page
         */
        export interface Spaces implements CFG.SPCE.ABS {
            /**
             * A list of {@link SPCE.Push} objects, each describing a `File` that will _always_ be 
             * **HTTP-PUSHED** to the Client Browser when pages are requested.
             * @category Client
             */
            PUSH: SPCE.Push[];
            /**
             * The `Global Space` confirguration. The default `string`-properties can be alter to your liking, and 
             * other, custom `auth`/`rest` `Spaces` can be added to the `expose`-property list.
             * @category Default
             */
            Global:     SPCE.Space = { 
                config:     {
                    name:        'global',
                    title:       'API Remoter',
                    description: 'Server API Access',
                }, 
                expose:     ['accessor','rest'],
            };
            /**
             * The main authenticator. If using authentication (configured in `config/setting.cfg.js`), this is 
             * `Space` that would handle this. You can also secondary, custom `auth` `Spaces`. 
             * @category Stock
             */
            Accessor:   SPCE.Space = { 
                type:       'auth',
                config:     {
                    name:        'accessor',
                    title:       'API Authoriser',
                    description: 'Granting Access',
                    accessor:     true,
                    page:         null,
                },
            };
            /**
             * The main data-request `Space`. You can also secondary, custom `rest` `Spaces`. 
             * @category Stock
             */
            REST:       SPCE.Space = { 
                type:       'rest',
                config:     {
                    name:        'rest',
                    title:       'API Explorer',
                    description: 'Querying Data',
                    accessor:     false,
                    page:         null
                },
            };
            /**
             * Any custom `page`, `rest`, or `auth` `Spaces` you include in your project will be configure as 
             * above. The `stringName` is just an **unique-identifier** used for `logging` purposes.
             * ### Example
             * ```javascript
             *     Home:       {
             *         type:       'page',
             *         config:     {
             *             name:        'home',
             *             scheme:      '/home/',
             *             title:       'Home Page',
             *             description: 'Landing Page',
             *             page:        {
             *                 title:      () => ('Welcome to My Page'),
             *                 CSS:        ['styles','font-awesome'],
             *                 main:       'stock',
             *                 type:       'jumbo',
             *             },
             *         },
             *     },
             * ```
             */
            [spaceKey: string]: SPCE.Space;
        };

        /////////////////////////////////////////////////////////////////////////////////
        namespace PNTS {
            /**
             * Config properties for the `GNRequest` object.
             */
            export interface General<M extends (CBRouteAU|CBRouteDB)> {
                /**
                 * The HTTP-Methods that this `Endpoint` can be called with. This can be exploited to allow a single-hanlder
                 * (_`GET`, for example_) repsond to other {@link HMETHOD}s (_such as, `POST`_).
                 * @category Describer
                 */
                Methods: Array<HMETHOD>;
                /**
                 * A list of the heirarchy `Endpoints` contained within it's `Base` that it belongs under.
                 * 
                 * By default, any `Endpoint` defined within a `BasePoint` -- _except, of course, for `"/"`_ -- 
                 * is a direct descendant of `"/"`, as `"/"` is just the definition of the `BasePoint` without
                 * any other paths following it. But obviously there are needs to push the heirarchy further.
                 * 
                 * Instead of forcing developers to use a `Parant > Child` structure that would get very annoying, very 
                 * fast, heirarchies are defined using this property. As was said earlier, `"/"`, is inherited by all
                 * other `Endpoints` contained with a `BaseEndpoint`, so it doesn't need to be add here. If the
                 * `Endpoint` in question is to remain a direct descendant of `"/"`, then this need not be defined.
                 * 
                 * Depending on whether or not [Merge](#merge) is configured, the path will be resolved differently.
                 * 
                 * ### Example:
                 * ```javascript
                 * ({ 
                 *   User: { 
                 *     Actions: {
                 *       Email: new RouteDB({ 
                 *         Scheme: '/',
                 *         Merge: true,
                 *         Subs: ['settings'], // defined, child of "Settings", Merge
                 *         // Resolves to "/user/settings/:sttg_id/email"
                 *       }), 
                 *       Privacy: new RouteDB({ 
                 *         Scheme: '/:uid/',
                 *         Subs: ['settings'], // defined, child of "Settings", no Merge
                 *         // Resolves to "/user/settings/privacy/:uid"
                 *       }), 
                 *       Settings: new RouteDB({ 
                 *         Scheme: '/:sttg_id/', ... 
                 *         // Sub not defined, is child of "/", no Merge
                 *       }), 
                 *       "/": new RouteDB({ 
                 *         Scheme: '/:uid/', ... 
                 *         // Resolves to "/user/:uid"
                 *       }),
                 *     }
                 *   }
                 * });
                 * ```
                 * @category Describer
                 */
                Sub?: String[];
                /**
                 * A `RegexP`, `string`-representation of the `Route` Path.
                 * * `global` use: {@link CFG.PNTS.Auth.Route|(Auth}|{@link CFG.PNTS.Data.Route|Data).Route}
                 * * `method` use: {@link CFG.PNTS.Auth.Method|(Auth}|{@link CFG.PNTS.Data.Method|Data).Method}
                 * @category Describer
                 */
                Scheme?: String;
                /**
                 * A flag the specifies whether or not, and if so, how to **prepend** the `path-parameters` of the _last_ `parent`-`Endpoint` 
                 * referenced in [Sub](#sub) (_along with the merge of its own `parent`; if applicable_) to the `path-name/parameters` 
                 * of this `Endpoint`:
                 * * If `true`, the [Scheme](scheme) from the `parent`-`Endpoint` will be prepended to this `Scheme` of this `Endpoint`. 
                 * * If set as an {@link HMETHOD}, then the system will use the [Scheme](scheme) defined in the `parent`-`Endpoint's` 
                 *   {@link CBRouteAU}/{@link CBRouteDB} definition of the same {@link HMETHOD}. Otherwise, it choose the first 
                 *   [Scheme](scheme) found within each `parent`.
                 * * Defined in a `method` (_see: **Uses** below_), and set to `true`, then the system will look for that `method` 
                 *   deinition within the `parent` and choose that [Scheme](scheme). Otherwise, the first [Scheme](scheme) found 
                 *   is chosen.
                 * 
                 * ### Example:
                 * ```javascript
                 * ({ 
                 *   User: { 
                 *     Actions: {
                 *       Password: new RouteDB({ 
                 *         Merge: true,
                 *         Subs: ['settings','privacy'], // Child of "Settings"
                 *         GET: () => ({ ... }), // Merge to "Privacy.GET"
                 *         // ^ Resolves to "/user/:uid/settings/privacy/:prv_id/password"
                 *       }), 
                 *       Email: new RouteDB({ 
                 *         Merge: 'POST', // Merge to "Privacy.POST"
                 *         Subs: ['settings','privacy'], // Child of "Settings"
                 *         GET: () => ({ ... }), 
                 *         // ^ Resolves to "/user/:uid/settings/privacy/email"
                 *       }), 
                 *       Privacy: new RouteDB({ 
                 *         Scheme: '/:prv_id/', // Defult for any Method defined within
                 *         Subs: ['settings'], // Child of "Settings".
                 *         Merge: true,
                 *         GET: () => ({ ... }), 
                 *         // ^ Merge to "Settings.GET", 
                 *         // ^ Resolves to "/user/:uid/settings/privacy/:prv_id"
                 *         POST: () => ({ Scheme: '/' }) 
                 *         // ^ Merge to "Settings.GET", Scheme redefined to "/"
                 *         // ^ Resolves to "/user/:uid/settings/privacy"
                 *       }), 
                 *       Settings: new RouteDB({ 
                 *         Merge: true, 
                 *         GET: () => ({ ... }), 
                 *         // ^ Sub not defined, is child of "/"
                 *         // ^ Resolves to "/user/:uid/settings"
                 *       }), 
                 *       "/": new RouteDB({ 
                 *         Scheme: '/:uid/',
                 *         GET: () => ({ ... }), 
                 *         // ^ Resolves to "/user/:uid"
                 *       }), 
                 *     }
                 *   }
                 * });
                 * ```
                 * 
                 * ### Uses:
                 * * `global`: {@link CFG.PNTS.Auth.Route|(Auth}|{@link CFG.PNTS.Data.Route|Data).Route}
                 * * `method`: {@link CFG.PNTS.Auth.Method|(Auth}|{@link CFG.PNTS.Data.Method|Data).Method}
                 * @category Describer
                 */
                Merge?: boolean|HMETHOD;
                /**
                 * A list of `Limits` to subscribe to.
                 * * `global` use: {@link CFG.PNTS.Auth.Route|(Auth}|{@link CFG.PNTS.Data.Route|Data).Route}
                 * * `method` use: {@link CFG.PNTS.Auth.Method|(Auth}|{@link CFG.PNTS.Data.Method|Data).Method}
                 * @category Describer
                 */
                Limits?: String[];
                /**
                 * The documentation for `Methods` in this `Route`.
                 * * `global` use: {@link CFG.PNTS.Auth.Route|(Auth}|{@link CFG.PNTS.Data.Route|Data).Route}
                 * * `method` use: {@link CFG.PNTS.Auth.Method|(Auth}|{@link CFG.PNTS.Data.Method|Data).Method}
                 * @category Describer
                 */
                Doc?: Doc;
                /**
                 * A callback that returns configs for a `GET` method within a `Route`.
                 * @category Handler
                 */
                GET?: M;
                /**
                 * A callback that returns configs for a `POST` method within a `Route`.
                 * @category Handler
                 */
                POST?: M;
                /**
                 * A callback that returns configs for a `PUT` method within a `Route`.
                 * @category Handler
                 */
                PUT?: M;
                /**
                 * A callback that returns configs for a `DELETE` method within a `Route`.
                 * @category Handler
                 */
                DELETE?: M;
                /**
                 * A callback that returns configs for a `MID` method within a {@link RouteAU} request.
                 * @category Handler
                 */
                MID?: M;
                /**
                 * A collection of {@link GNParam}s, which represent the `global` or `method`-specific `path`/`query`/`body` parameters of an `Endpoint`:
                 * * `global` use: {@link CFG.PNTS.Auth.Route|(Auth}|{@link CFG.PNTS.Data.Route|Data).Route}
                 * * `method` use: {@link CFG.PNTS.Auth.Method|(Auth}|{@link CFG.PNTS.Data.Method|Data).Method}
                 * 
                 * These can be defined `inline`: 
                 * ```javascript
                 * {
                 *     async Query() { ... },
                 *     Params: {
                 *          UserID: new GNParam({
                 *              Name: 'User ID',
                 *              Default: null,
                 *              Format (cls) { return cls.user_id; },
                 *              // ...
                 *          }),
                 *     },
                 *     Parse(res) { ... },
                 * }
                 * ```
                 * Or defined in a {@link CFG.PNTS.Defaults} object within `config/authpoints.cfg.js` or `config/endpoints.cfg.js`:
                 * ```javascript
                 * {
                 *     __DEFAULTS: {
                 *         Header: { ... },
                 *         Params: {
                 *             // Define as a Default...
                 *             UserID: new GNParam({ ... }),
                 *         }
                 *     },
                 *     User: {
                 *         Actions: {
                 *             Settings: new RouteDB({ 
                 *                 Params: {
                 *                     // ... Reference the default.
                 *                     UserID: true, 
                 *                 }
                 *             }),
                 *         },
                 *     },
                 * }
                 * ```
                 * 
                 * When defined using the _latter_ technique, `references` to those _predefined_ {@link GNParam}s are made in the following ways:
                 *
                 * | Reference | Example | Description |
                 * | :-------: | :------ | :---------- |
                 * | `Direct`  | `{ Email: true }` | References the param defined in `__DEFAULTS`. |
                 * | `Version` | `{ Email: ['REQUIRED'] }` | References a `required` version of the **Email** Param. |
                 * 
                 * @category Handler
                 */
                Params?:  CLParams;
                /**
                 * An `optional` callback that handles any post-formatting needed before the `result` of a `method` is attached to the `payload` for consumption.
                 * 
                 * This may seem redundant when using {@link CFG.PNTS.Data.Method.Query|Data.Method.Query} (_as a {@link CBQYHandle}, not a **SQL** `string[]`_), but 
                 * when a particular `Enpdpoint` responds to multiple {@link HMETHOD}s, the `result`-structure is usually the same. This `property` can be exploited by defining it 
                 * `globally` inside of the {@link CFG.PNTS.Data.Method|Data.Method} config. For every {@link CBRouteDB} contained within the `CFGRouteQry*`, this callback will 
                 * be applied. That way, you need only define it **once**.
                 * 
                 * Of course, if a certain format is required across multiple `Endpoints`, one can always define the `callback` outside of the {@link CFGAuthPointsDB} config 
                 * and assign it to `Parse`.
                 * 
                 * If this is not defined, the internal-parser will do what it does. This is generally just dumping whatever was returned; unless the `result` returned is
                 * of `Array<Object<key,value>>`, and [Key](#key) maps to one of the item's keys.
                 * 
                 * #### Uses:
                 * * `global` use: {@link CFG.PNTS.Data.Route|Data.Route}
                 * * `method` use: {@link CFG.PNTS.Data.Method|Data.Method}
                 * @category Post-Format
                 */
                Parse?(res: TPQryObject): any;
                /**
                 * A `string` that refers to a `property-key` of an `Object-interface` property within any {@link Data.Method|Data.Method} `result` 
                 * returned as an `Array<{ key: value, ...rest }>`. When this is set, the internal-parser will **transform** the `Array<{ key: value, ...rest }>` into 
                 * `Object<key,{ key: value, ...rest }>`, **removing** the property from each item in the `Object` that now serves as the `key` of each item-value.
                 * 
                 * ### Example:
                 * ```javascript
                 * ({
                 *     Query: (cls) => ([
                 *         { user_id: 1, name: 'Hello', age: 102 },
                 *         { user_id: 2, name: 'World', age: 20  },
                 *         { user_id: 3, name: 'Foo',   age: 31  },
                 *         { user_id: 4, name: 'Bar',   age: 46  },
                 *     ]),
                 *     Key: 'user_id',
                 * });
                 * // payload.result = {
                 * //     1: { name: 'Hello', age: 102 },
                 * //     2: { name: 'World', age: 20  },
                 * //     3: { name: 'Foo',   age: 31  },
                 * //     4: { name: 'Bar',   age: 46  },
                 * // }
                 * ```
                 * 
                 * * `global` use: {@link CFG.PNTS.Data.Route|Data.Route}
                 * * `method` use: {@link CFG.PNTS.Data.Method|Data.Method}
                 * @category Post-Format
                 */
                Key?: String;
                /**
                 * A list of Request Paths used for linking {@link RouteDB} requests.
                 * * `global` use: {@link CFG.PNTS.Data.Route|Data.Route}
                 * * `method` use: {@link CFG.PNTS.Data.Method|Data.Method}
                 * @category Post-Format
                 */
                Links?: String[];
                /**
                 * `true`, if this Endpoint is restricted to Admins.
                 * * `global` use: {@link CFG.PNTS.Auth.Route|(Auth}|{@link CFG.PNTS.Data.Route|Data).Route}
                 * * `method` use: {@link CFG.PNTS.Auth.Method|(Auth}|{@link CFG.PNTS.Data.Method|Data).Method}
                 * @category Restrictive
                 */
                Private?: boolean;
            };
            /**
             * Config properties for the {@link QueryGN} object.
             */
            export interface Method<M extends (CBRouteAU|CBRouteDB)> extends General<M> {
                /** @hidden     */ Methods: never;
                /** @hidden     */ Sub:     never;
                /** @hidden     */ Links:   never;

                /**
                 * The collection of handlers for an {@link Auth.Method}.
                 * @category Handler
                 */
                Proc:  CLProcs;
                /**
                 * Either an `Array` of `Strings` that form a **SQL** query, or A `callback` that _retrieves/updates_ 
                 * backned data for an {@link Data.Method}.
                 * @category Handler
                 */
                Query: CBQYHandle | String[];

                /** @hidden */ GET?    : never;
                /** @hidden */ POST?   : never;
                /** @hidden */ PUT?    : never;
                /** @hidden */ DELETE? : never;
                /** @hidden */ MID?    : never;

            };
            /**
             * A collection of `Request`-handlers for a `Base-Endpoint`. A `BaseEndpoint` 
             * represents a **Namespace** for any number of related `Endpoints`.
             */
            export abstract interface Base<T extends (RouteAU|RouteDB)> {
                /**
                 * Where each related `Endpoint` is defined.
                 */
                Actions: CLRoutes<T>;
                /**
                 * A plain-object used to define any list `paths` that are **invalid** and 
                 * the `HTTP_MSG` that should be sent to the end-user.
                 */
                Errors: CLRouteER;
            };
            /**
             * A configuration object of **default** {@link GNParam}.
             */
            export interface Defaults {
                /**
                 * The collection of {@link GNParam} objects representing **Headers**.
                 */
                Headers: CLHeaders;
                /**
                 * The collection of {@link GNParam} objects representing _path_ &_query/body_ **Parameters**.
                 */
                Params:  CLParams;
            };
            /**
             * A defined collection of {@link Base}s, representing all **Requests**. In addition, a
             * {@link Defaults} definition, representing reusable **Headers/Params**.
             */
            export abstract interface Routes<T extends (Auth.Base|Data.Base|Defaults)> {
                /**
                 * The configuration object of **default** `GNParams`.
                 */
                __DEFAULTS: Defaults;
                [BaseEndpoint: string]: T;
            };


            /**
             * A config `object` for `PTypes` that defines a _single_ {@link PTOpts.sanitizers} `function`.
             */
            export interface PTOpts {
                /**
                 * A name for a {@link PType}.
                 */
                name: string;
                /**
                 * A `string` representating the primitive-base of a {@link PType}.
                 */
                type: PTKinds;
                /**
                 * A `function` that sanitzes a values according your definition of your {@link PType}.
                 */
                sanitizers: CBSanitizer;
                /**
                 * `true`, if the value is a `list` of ({@link PTOpts.type}) values
                 */
                iterable?: boolean;
            };
            /**
             * A config `object` for `PTypes` that defines _multiple_ {@link PTOpts.sanitizers}.
             */
            export interface PTOptsMulti extends PTOpts {
                /**
                 * An `Array` of `functions` that are ran in succession.
                 */
                sanitizers: Array<CBSanitizer>;
            };
            
            /**
             * A customizer `object` for {@link PType}s.
             */
            export interface PTArgs {
                /**
                 * A delimiter for {@link PTOpts.iterable|PType.iterable}s when the List-value is a String.
                 * @category Cosmetic
                 */
                separator?: string;
                /**
                 * if `true`, {@link PTOpts.iterable|PType.iterable} items will be sorted by byte-size.
                 * @category Cosmetic
                 */
                sort?: boolean;
                /**
                 * Will `join` a {@link PTOpts.iterable|PType.iterable} with the specified value.
                 * ### Example
                 * ```javascript
                 * var myIntList = [1,2,3,4];
                 * var myIntType = PT.L.Int({ join: ' + ' });
                 * console.log(myIntType.sanitze(myIntList));
                 * // "1 + 2 + 3 + 4"
                 * ```
                 * @category Cosmetic
                 */
                join?: string;
                /**
                 * A 2-length string `Array`, indicating characters to wrap a _joined_, {@link PTOpts.iterable|PType.iterable} with.
                 * ### Example
                 * ```javascript
                 * var myIntList = [1,2,3,4];
                 * var myIntType = PT.L.Int({ join: '|', enclose: ["<",">"] });
                 * console.log(myIntType.sanitze(myIntList));
                 * // "<1|2|3|4>"
                 * ```
                 * @category Cosmetic
                 */
                enclose?: [string, string];
                /**
                 * Will `map` a {@link PTOpts.iterable|PType.iterable} with the specified callback.
                 * @param value The `Array` item value.
                 * @param index The `Array` item index.
                 * @param array The current `Array`.
                 * @returns The newly mapped `Array`.
                 * @category Cosmetic
                 */
                map?: <T>(value: T, index?: number, array?: Array<T>) => Array<T>;
                /**
                 * An `Array` of items that can be used within {@link PTOpts.sanitzer} and {@link PTArgs.map} `callbacks`.
                 * @category Cosmetic
                 */
                tags?: string[];
                /**
                 * if `true`, {@link PTOpts.iterable|PType.iterable} _"leveled"_ items (_i.e: `value`&#64;`level`_) are considered 
                 * Edits/Additions, while "non-leveled" items (_i.e: `value`_) are marked separately for 
                 * removal.
                 * @category Cosmetic
                 */
                leveled?: boolean;
                /**
                 * if `true`, {@link PTOpts.iterable|PType.iterable} items will be grouped according to their `key` (_i.e: `key`&#64;`value`_).
                 * @category Cosmetic
                 */
                grouped?: boolean;
                /**
                 * A list of `Key`/`Value` pairs for restricting any type.
                 * @category Restrictive
                 */
                selects?: Array<{label:string, value:any}>;
                /**
                 * An `array` of `values` to ignore in {@link PTArgs.select} restrictions.
                 * @category Restrictive
                 */
                omit?: string[];
                /**
                 * An `Array` of `Array.slice()` parameters for restricting the length of a {@link PTOpts.iterable|PType.iterable}.
                 * ```javascript
                 * Array[0] = 2;  // Where the slice STARTS.
                 * Array[1] = 10; // The LENGTH of the slice, or undefined.
                 * ```
                 * @category Restrictive
                 */
                slice?: [number, number?];
                /**
                 * The increment a **Number**-{@link PType} must adhere to.
                 * @category Restrictive
                 */
                step?: number;
                /**
                 * The minimum amount a **Number**-{@link PType} can be.
                 * @category Restrictive
                 */
                min?: number;
                /**
                 * The maximum amount a **Number**-{@link PType} can be.
                 * @category Restrictive
                 */
                max?: number;
                /**
                 * A `RegexP` pattern a `Text`-type must match.
                 * @category Restrictive
                 */
                regex?: RegExp;
                /**
                 * If `true`, this type should be **obfuscated**.
                 * @category Restrictive
                 */
                hidden?: boolean;
                /**
                 * Toggles all of the `restriction-properties` on or off.
                 * @category Cosmetic
                 */
                restricted?: boolean;
            };

            /**
             * An object passed to the {@link Doc.Files.dest|dest} and {@link Doc.Files.name|name} 
             * `callbacks` in upload-enabled request-methods.
             */
            export interface File {
                /**
                 * The full folder-path of the file.
                 */
                destination: string;
                /**
                 * The name of the file.
                 */
                filename: 	 string;
                /**
                 * The full-path filename.
                 */
                path: 		 string;
                /**
                 * The size of the file.
                 */
                size: 		 number;
            };

            /**
             * Config properties a Route's Documentation.
             */
            export interface Doc {
                /**
                 * A collection of Header {@link GNDescr} objects.
                 */
                Headers?: CLHeaders;
                /**
                 * When an `EndPoint` requires the ability to upload files, this object tells the internal 
                 * Upload-Handler how to upload the files.
                 * 
                 * > **IMPORTANT:** Upload request **must be** called as a `POST`, `PUT`, or `DELETE` method.
                 * 
                 * ### Uploading with `dffrnt.api`
                 * The system will handle the middleware required to process an upload request, so long as the 
                 * request-method definition includes this {@link Files|Files} object.
                 * 
                 * During an upload, `dffrnt.api` goes through **3** phases:
                 * * The internal upload-middleware detects if the `Files.field` you've defined 
                 *   contains any filenames. 
                 * * It will then proceed to process the file(s) into `Streams`, and gather any `meta-data`. Only 
                 *   first `Files.max(n)` files--_if set_--will be processed.
                 * * From here, it passed the `path`/`body` params and `meta-data` to the `Files.dest` 
                 *   `Files.name` `callbacks` to determine where, and under what name the file(s) should 
                 *   be saved.
                 * * Lastly, the `Files.field` param, and a private `location` param will be set on the 
                 *   requests `body` which is then passed to your request-method `Query` function so the upload 
                 *   can be logged in your database or whatever post-processing you need done.
                 *  
                 * Uploads are always stored in `<project_root>/storage/*`; however, this object 
                 * allows you to define which folders within `<project_root>/storage/*` 
                 * the files will go to, how the files will be named, etc.
                 */
                Files?: {
                    /**
                     * The `name` of the {@link GNParam} that represents the `<file>` element or files list in the request.
                     * 
                     * ### Example
                     * **index.html:**
                     * ```html
                     * <form method="POST" action="...">
                     *     <input type="file" name="upload" />
                     * </form>
                     * ```
                     * **config/endpoints.cfg.js:**
                     * ```javascript
                     * {   // curl -X POST https://host/point -d "username=coolguy" ...
                     *     field: 'upload',
                     * }   // File is saved to <project_root>/storage/coolguy/*
                     * ```
                     */
                    field:	string;
                    /**
                     * An optional maximum amount of files that can be pushed to this request. A client can still request 
                     * more than the max if the Browser Application allows for it, but the internal uploader will only 
                     * upload the first `max(n)` files that show up in the filename list.
                     */
                    max?:	number;
                    /**
                     * An optional `callback` you can define to determine--based on the parameters it sets--where 
                     * in the `<project_root>/storage/` folder the file(s) will be saved.
                     * 
                     * If not defined, any files sent will be saved as `<project_root>/storage/<filename>`.
                     * 
                     * ### Example
                     * ```javascript
                     * {   // curl -X POST https://host/point -d "username=coolguy" ...
                     *     dest(prm, bdy, file) { return bdy.username; },
                     * }   // File is saved to <project_root>/storage/coolguy/*
                     * ```
                     * 
                     * @param prm The path-params sent with the request.
                     * @param bdy The body-params sent with the request.
                     * @param file An object of meta-data retrieved from the uploaded file(s).
                     */
                    dest(prm: TPQryObject, bdy: TPQryObject, file: PNTS.File): string;
                    /**
                     * An optional `callback` you can define to determine--based on the parameters it sets--what 
                     * name(s) the file(s) will be saved under.
                     * 
                     * If not defined, any files sent will be saved as `<project_root>/storage(/<destination>)/<originalName>`.
                     * 
                     * ### Example
                     * ```javascript
                     * {   // curl -X POST https://host/point/12345" ...
                     *     dest(prm, bdy, file) { return 'profile_pics'; },
                     *     name(prm, bdy, file) { return prm.user_id; }, // <---
                     * }   // File is saved as <project_root>/storage/profile_pics/12345.jpg
                     * ```
                     * 
                     * @param prm The path-params sent with the request.
                     * @param bdy The body-params sent with the request.
                     * @param file An object of meta-data retrieved from the uploaded file(s).
                     */
                    name(prm: TPQryObject, bdy: TPQryObject, file: PNTS.File): string;
                };
                /**
                 * A collection of Query Examples.
                 */
                Examples?: { [exampleName: string]: string; };
                /**
                 * A collection of {@link GNParam} objects (_for {@link RouteAU}_).
                 */
                Params?: CLParams;
            };
            /**
             * Config properties for the {@link GNDescr} object.
             */
            export interface Descr {
                /**
                 * Denotes whether a {@link GNParam} is a `path`, `header`, or `query`/`body` parameter.
                 */
                to: PTo;
                /**
                 * A {@link PType} that the Param adheres to.
                 */
                type: PTOpts;
                /**
                 * A description of what the Param entails.
                 */
                description: string;
                /**
                 * Whether or not it is mandator to set this Param.
                 */
                required: boolean;
                /**
                 * If `true`, this param is publicly. Good for Params that are set by the backend.
                 */
                hidden?: boolean;
                /**
                 * A plain-object that describes all the ways in which a {@link GNParam} is matched. This 
                 * for `params` that takes a multitude of specific `string-formats` and dismiss any that
                 * do not conform.
                 * ### Example
                 * ```javascript
                 * {
                 *     matches: {
                 *         "URL": "A valid URL-String (^https?://(?:\\b[\\w_-]\\b\\.)+[a-z]+(?:\\/[\\w%&=_-])\\/?$)",
                 *         "IP": "A valid URL-String (^\\b((\\d|1\\d{1,2}|2([0-4]\\d|5[0-5]))(\\.|$)){4}\\b$)",
                 *     }
                 * }
                 * ```
                 */
                matches?: CLMatches;
            };
            /**
             * Config properties for the {@link GNParam} object.
             */
            export interface Params {
                /**
                 * The fullname of the Param.
                 */
                Name: string;
                /**
                 * An `array` of other names that will reference this Param in:
                 * * {@link Auth.Method.Params} / {@link Auth.Route.Params}
                 * * {@link Data.Method.Params} / {@link Data.Route.Params}
                 * 
                 * ### Example:
                 * ```javascript
                 * // config/endpoints.cfg.js
                 * module.exports = () => ({
                 *     __DEFAULTS: {
                 *         Params: {
                 *             MyParam: new GNParam({ Name: 'My Param', Aliases: ['YourParam'] })
                 *         }
                 *     },
                 *     User: {
                 *         Actions: {
                 *             Friend: new RouteDB({
                 *                 Params: { 
                 *                     YourParam: true // Refers to __DEFAULTS.Params.MyParam
                 *                 }
                 *             })
                 *             "/": new RouteDB({
                 *                 Params: { 
                 *                     MyParam: true // Refers to __DEFAULTS.Params.MyParam
                 *                 }
                 *             })
                 *         }
                 *     }
                 * });
                 * ```
                 */
                Aliases?: string[];
                /**
                 * The default value for the Param. **If this value is declare as `function` that returns the _actual_ value, this `default` will be considered `hidden`, and will _not_ appear in the `REST-API` Docs.**
                 */
                Default: any;
                /**
                 * A callback that handles any post-processing needed before hydration.
                 */
                Format: CBFormat;
                /**
                 * A {@link GNDescr} object or {@link Params.Descr} config describing the Param.
                 */
                Desc: GNDescr | CFG.PNTS.Descr;
            };


            namespace Auth {
                /**
                 * {@link RouteAU}-specific config-properties based on the {@link QueryGN} `interface`.
                 */
                export interface Method extends PNTS.Method<CBRouteAU> {
                    /** @hidden */ Query:  never;
                    /** @hidden */ Params: never;
                    /** @hidden */ Parse:  never;
                    /** @hidden */ Key:    never;
                };
                /**
                 * Config properties for the `AURequest` object.
                 */
                export interface Route extends PNTS.General<CBRouteAU> {
                    /** @inheritdoc */ Methods: Array<('GET'|'POST'|'PUT'|'DELETE'|'MIDDLEWARE')>;
                    /** @hidden     */ Parse:   never;
                    /** @hidden     */ Key:     never;
                    /** @hidden     */ Links:   never;
                };
                /**
                 * A collection of `Auth-Requests` for a `Base-Endpoint`. A `BaseEndpoint` 
                 * represents a **Namespace** for any number of related `Endpoints`.
                 * ### Examples:
                 * ```javascript
                 * // "Auth" is the BaseEndpoint ("/auth")
                 * Auth: {
                 *     Actions: {
                 *          // Resolves to "/auth/login"
                 *          Login:  new RouteAU({ ... }),
                 *          // Resolves to "/auth/logout"
                 *          Logout: new RouteAU({ ... }),
                 *     },
                 *     Errors: {
                 *         // Denies "/auth" & "/auth/"
                 *         BAD_REQ: ['/']
                 *     },
                 * }
                 * ```
                 */
                export interface Base extends PNTS.Base<CLRouteAU> {};
            };
            namespace Data {
                /**
                 * {@link RouteDB}-specific config-properties based on the {@link QueryGN} `interface`.
                 */
                export interface Method<Q extends CBQuery> extends PNTS.Method<CBRouteDB> {
                    /** @hidden     */ Proc:  never;
                    /** @inheritdoc */ Query: Q extends CBQYHandle ? (cls: TPQryObject)=>Promise<QYResult> : string[];
                };
                /**
                 * Config properties for the `DBRequest` object.
                 */
                export interface Route extends PNTS.General<CBRouteDB> {
                    /** @inheritdoc */ Methods: Array<('GET'|'POST'|'PUT'|'DELETE')>;
                    /** @hidden     */ MID:     never;
                };
                /**
                 * A collection of `Data-Requests` for a `BaseEndpoint`. A `BaseEndpoint` 
                 * represents a **Namespace** for any number of related `Endpoints`.
                 * ### Examples:
                 * ```javascript
                 * // "User" is the BaseEndpoint ("/user")
                 * User: {
                 *     Actions: {
                 *          // Resolves to "/user/[0-9]+/settings"
                 *          Settings: new RouteDB({
                 *              // Merge the parameters of the Parent The path requires the "uid" parameter
                 *              // Merge the parameters of the Parent The path requires the "uid" parameter
                 *              Merge: true, 
                 *              ...
                 *          }),
                 *          // Resolves to "/user/[0-9]+"
                 *          "/": new RouteDB({
                 *              Scheme: '/:uid', // The path requires the "uid" parameter
                 *              ...
                 *          }),
                 *     },
                 *     Errors: {
                 *         // Denies "/auth" & "/auth/"
                 *         BAD_REQ: ['/']
                 *     },
                 * }
                 * ```
                 */
                export interface Base extends PNTS.Base<CLRouteDB> {};
            };
            
        };
        /**
         * A defined collection of `CFG.PNTS.Auth.Base`, representing all **Auth-Requests**. This is 
         * declared by using `module.exports` to export a `function` that `returns` 
         * the definition.
         * ### Examples:
         * These are placed in `config/authpoints.cfg.js`.
         * ```javascript
         * // ./config/authpoints.cfg.js
         * module.exports = () => ({
         *     __DEFAULTS: { ... },
         *     Auth:       { ... },
         *     Security:   { ... },
         * });
         * ```
         * 
         * The body of this `function` can be used to declare any variables 
         * and useful `functions` that make your coding easier.
         * @category REST
         */
        export interface AuthPoints extends PNTS.Routes<PNTS.Auth.Base> {};
        /**
         * A defined collection of `PNTS.Data.Base`, representing all **Data-Requests**. This is 
         * declared by using `module.exports` to export a `function` that `returns` 
         * the definition.
         * ### Examples:
         * These are placed in `config/endpoints.cfg.js`.
         * ```javascript
         * // ./config/endpoints.cfg.js
         * module.exports = () => ({
         *     __DEFAULTS: { ... },
         *     Users:      { ... },
         *     Messages:   { ... },
         *     List:       { ... },
         *     ...
         * });
         * ```
         * 
         * The body of this `function` can be used to declare any variables 
         * and useful `functions` that make your coding easier.
         * @category REST
         */
        export interface DataPoints extends PNTS.Routes<PNTS.Data.Base> {};

    };

};


/**
 * A configuration module for the `dffrnt.api` framework.
 */
export module 'dffrnt.confs' {
    /**
     * A `callback` used in `Immutable`.`mergeWith`.
     * @param oldVal The value of the original Object.
     * @param newVal The value of the merging Object.
     * @returns A newly merged object.
     * @private
     */
    export function MERGER(oldVal: any, newVal: any): any;


    /**
     * A request-method configurator for {@link RouteAU}/{@link RouteDB|DB} requests-paths.
     * @typeparam R The type of `Method` this Route-Query pertains to. 
     * @private
     */
    export abstract class QueryGN<R extends (CBRouteAU|CBRouteDB)> implements CFG.PNTS.Method<R> {
        /** @inheritdoc */ readonly Scheme:  String;
        /** @inheritdoc */ readonly Merge:   boolean|TPRouteMerge<R>;
        /** @inheritdoc */ readonly Limits:  String[];
        /** @inheritdoc */ readonly Doc:     CFG.PNTS.Doc;
        /** @inheritdoc */ readonly Proc:    CLProcs;
        /** @inheritdoc */ readonly Query:   CBQYHandle | String[];
        /** @inheritdoc */ readonly Private: boolean;

        /** 
         * A collection of all {@link GNParam|Params} defined on this `QueryGN` instance that is agnostic toward the **Route-type** 
         * (`Auth`/`Data`). This is only needed because {@link CFG.PNTS.Auth.Route|Auth}/{@link CFG.PNTS.Data.Route|Data.Route} 
         * `Params` are defined differently.
         * @hidden
         */ 
        private readonly References: CLParameters;
        /**
         * If `true`, this configuration is now immutable.
         * @hidden
         */
        private readonly Locked: boolean;

        /**
         * Creates a new {@link QueryGN} method for a {@link RouteAU}/{@link RouteDB|DB} request.
         */
        constructor({ 
            Scheme, Merge = false, Limits, Doc, 
            Query, Proc, Params, Parse, Key, 
            Private = true 
        }: CFG.PNTS.Method<R>): QueryGN<R>;

        /**
         * The base `path` of the `GNRoute`.
         */
        private get Base(): string;
        private set Base(val: string): void;
        /**
         * The full `path` of the `GNRoute`.
         */
        private get Path(): string;
        private set Path(val): void;
        /**
         * A digestible scheme pattern.
         */
        private get PathTemplate(): string;
        /**
         * A `RegExp` pattern to match this scheme.
         */
        private get PathMatcher(): RegExp;

        /**
         * Locks the current configuration, permanetly.
         * @hidden
         */
        private Lock(): void;

        /**
         * Creates a digestible scheme pattern given the `path` argument. This used _internally_ 
         * within the {@link Path} `setter`.
         * @param path The path pattern to convert.
         * @return A scheme pattern.
         */
        private static GetParamScheme(path: string|RegExp): string;

    };

    /**
     * A request-method configurator for {@link RouteAU} requests-paths.
     */
    export class QueryAU extends QueryGN<CBRouteAU> {
        /** @inheritdoc */ readonly Proc:  CLProcs;
        /** @hidden     */ readonly Query: never;

        /**
         * Creates a new {@link QueryGN} method for a {@link RouteAU} request.
         */
        constructor({ 
            Scheme, Merge = false, Limits, Doc, Proc, Private = true
        }: CFG.PNTS.Auth.Method): QueryAU;

    };
    /**
     * A request-method configurator for {@link RouteDB} requests-paths.
     */
    export class QueryDB extends QueryGN<CBRouteDB> {
        /** @inheritdoc */ readonly Query:  CBQuery;
        /** @hidden     */ readonly Proc:   never;
        /** @inheritdoc */ readonly Params: CLParams;
        /** @inheritdoc */ readonly Key:    String;

        /**
         * Denotes if the {@link Query} that represents this {@link RouteDB} path is a `Function`.
         */
        private readonly QisFunction: boolean;
        /**
         * Denotes if the {@link Query} that represents this {@link RouteDB} path is  an `AsyncFunction`.
         */
        private readonly QisAsync:    boolean;
        /**
         * Denotes if the {@link Query} that represents this {@link RouteDB} path is `SQL-Array`.
         */
        private readonly QisArray:    boolean;

        /**
         * Creates a new {@link QueryGN} method for a {@link RouteDB} request 
         * that utilizes a custom data retrieval.
         */
        constructor({ 
            Scheme, Merge = false, Limits, Doc, 
            Query, Params, Parse, Key, 
            Private = true 
        }: CFG.PNTS.Data.Method<CBQYHandle>): QueryDB;
        /**
         * Creates a new {@link QueryGN} method for a {@link RouteDB} request 
         * that utilizes a `SQL` query.
         */
        constructor({ 
            Scheme, Merge = false, Limits, Doc, 
            Query, Params, Parse, Key, 
            Private = true 
        }: CFG.PNTS.Data.Method<string[]>): QueryDB;

        /** @inheritdoc */
        Parse(res: TPQryObject): TPQryObject;

    };


    /**
     * The Base Class for the Route Configurators.
     * @private
     */
    export class RouteGN<R extends (CBRouteAU|CBRouteDB)> implements CFG.PNTS.General<R> {
        /**
         * The name of this route.
         */
        readonly Name: string;

        /** @inheritdoc */ readonly Methods: Array<('GET'|'POST'|'PUT'|'DELETE'|'MIDDLEWARE')>;
        /** @inheritdoc */ readonly Sub:     string[];
        /** @hidden     */ readonly Scheme:  never;
        /** @hidden     */ readonly Merge:   never;
        /** @hidden     */ readonly Limits:  never;
        /** @hidden     */ readonly Doc:     never;

        /** 
         * A `GET` handler for this `Route` path.
         * @category Handler 
         */ 
        readonly GET:    (QueryAU|QueryDB);
        /** 
         * A `POST` handler for this `Route` path.
         * @category Handler 
         */ 
        readonly POST:   (QueryAU|QueryDB);
        /** 
         * A `PUT` handler for this `Route` path.
         * @category Handler 
         */ 
        readonly PUT:    (QueryAU|QueryDB);
        /** 
         * A `DELETE` handler for this `Route` path.
         * @category Handler 
         */ 
        readonly DELETE: (QueryAU|QueryDB);
        /** 
         * A `MID` handler for this `Route` path.
         * @category Handler 
         */ 
        readonly MID:    (QueryAU);

        /** @hidden     */ readonly Params:  never;
        /** @hidden     */ readonly Parse:   never;
        /** @hidden     */ readonly Key:     never;
        /** @inheritdoc */ readonly Links:   string[];
        /** @inheritdoc */ readonly Private: boolean;

        /**
         * If `true`, this configuration is now immutable.
         */
        private readonly Locked: boolean;

        /**
         * The Base Class for the Route Configurators.
         */
        constructor({ 
            Methods, Sub, 
            Scheme, Merge = false, Limits, Doc, 
            GET, POST, PUT, DELETE, MID, 
            Params, Parse, Key, 
            Private = true, Links 
        }: CFG.PNTS.General<R>);

        /**
         * Locks the current configuration, permanetly.
         */
        private Lock(): void;

    };

    /**
     * A Route Configurator for `AURequests`.
     */
    export class RouteAU extends RouteGN<CBRouteAU> {
        /** @inheritdoc */ readonly Name: string;
        /** @inheritdoc */ readonly Methods: Array<('GET'|'POST'|'PUT'|'DELETE'|'MIDDLEWARE')>;
        /** @inheritdoc */ readonly Sub:     string[];

        /** 
         * A `GET` handler for this `Auth-Route`.
         * @category Handler 
         */ 
        readonly GET:    QueryAU;
        /** 
         * A `POST` handler for this `Auth-Route`.
         * @category Handler 
         */ 
        readonly POST:   QueryAU;
        /** 
         * A `PUT` handler for this `Auth-Route`.
         * @category Handler 
         */ 
        readonly PUT:    QueryAU;
        /** 
         * A `DELETE` handler for this `Auth-Route`.
         * @category Handler 
         */ 
        readonly DELETE: QueryAU;
        /** 
         * A `DELETE` handler for this `Auth-Route`.
         * @category Handler 
         */ 
        readonly MID:    QueryAU;

        /** @inheritdoc */ readonly Private: boolean;

        /**
         * A Route Configurator for `AURequests`.
         */
        constructor({ 
            Methods, Sub, Scheme = '', 
            Merge = false, Limits, Doc, 
            GET, POST, PUT, DELETE, MID, 
            Private = true 
        }: CFG.PNTS.Auth.Route);

    };
    /**
     * A Route Configurator for `DBRequests`.
     */
    export class RouteDB extends RouteGN<CBRouteDB> {
        /** @inheritdoc */ readonly Name: string;
        /** @inheritdoc */ readonly Methods: Array<('GET'|'POST'|'PUT'|'DELETE')>;
        /** @inheritdoc */ readonly Sub:     string[];

        /** 
         * A `GET` handler for this `Data-Route`.
         * @category Handler 
         */ 
        readonly GET:    QueryDB;
        /** 
         * A `POST` handler for this `Data-Route`.
         * @category Handler 
         */ 
        readonly POST:   QueryDB;
        /** 
         * A `PUT` handler for this `Data-Route`.
         * @category Handler 
         */ 
        readonly PUT:    QueryDB;
        /** 
         * A `DELETE` handler for this `Data-Route`.
         * @category Handler 
         */ 
        readonly DELETE: QueryDB;
        /** 
         * @hidden
         */ 
        readonly MID:    never;

        /** @inheritdoc */ readonly Links:   string[];
        /** @inheritdoc */ readonly Private: boolean;

        /**
         * A Route Configurator for `DBRequests`.
         */
        constructor({ 
            Methods, Sub, Scheme = '/', 
            Merge = false, Limits, Doc, 
            GET, POST, PUT, DELETE,  
            Params, Parse, Key, Links, 
            Private = true 
        }: CFG.PNTS.Data.Route);

        /**
         * A blank {@link RouteDB} object, used for Routes that are really just Namespaces
         * for other Routes. These Routes are never actually implemented.
         * @param Sub A list of the heirarchy the `DBRequest` belongs under.
         * @returns A `RouteDB`  placeholer.
         * @category Static
         */
        static Namespace(Sub?: String[]): RouteDB;

    };


    /**
     * A Collection of {@link GNDescr} Objects for Headers.
     */
    export class GNHeaders {
        /**
         * A Collection of {@link GNDescr} Objects for Headers.
         */
        constructor(headers: CLHeaders);

    };
    /**
     * A Parameter Configurator for {@link CFG.PNTS.Auth.Route|Auth.Route} / {@link CFG.PNTS.Data.Route|Data.Route} definitions.
     * 
     * ### Pre-Made Parameters
     * | Name      | Type     | Versions  | Description |
     * | --------- | :------: | :-------: | ----------- |
     * | `Token`   | `header` | _N/A_     | An `API-Token` that `session-user` must pass in order to make requests. |
     * | `Single`  | `query`  | _N/A_     | A `boolean` that specifies wether to return a list or the first object within the list |
     * | `Limit`   | `query`  | `["SQL"]` | A result limit for pagination. An alternate, SQL-version exists for SQL queries. |
     * | `Page`    | `query`  | `["SQL"]` | A result page for pagination. An alternate, SQL-version exists for SQL queries. |
     * | `CliIP`   | `query`  | _N/A_     | When used, grabs the Client's IP Address. |
     * | `ID`      | `query`  | _N/A_     | `Reserved` - An arbitrary identifier for Client `ReactComponents`. As _non-hidden_ `query`/`body` params are always sent back with the `payload`, this simply ensures a `Component` knows which result is its own. |
     * | `UUID`    | `query`  | _N/A_     |  |
     */
    export class GNParam {
        /**
         * The fullname of the Param.
         * @category Constructor
         */
        readonly public Name: string;
        /**
         * An `array` of other names that will reference this `GNParam` (_see: {@link CFG.PNTS.GNParam.aliases|GNParam.aliases}_).
         * @category Constructor
         */
        readonly public Aliases: string[];
        /**
         * The default value for the Param. **If this value is declare as `function` that returns the _actual_ value, this `default` will be considered `hidden`, and will _not_ appear in the `REST-API` Docs**.
         * @category Constructor
         */
        readonly public Default: any;
        /**
         * A callback that handles any post-processing needed before hydration.
         * @category Constructor
         */
        readonly public Format: CBFormat;
        /**
         * A {@link GNDescr} object or {@link Params.Descr} config describing the `GNParam`.
         * @category Constructor
         */
        readonly public Desc: GNDescr;
        /**
         * The collection of alertnate {@link GNParam.AddVersion|versions} of this {@link GNParam}.
         * @category Constructor
         */
        readonly public Version: { [versionName: string]: GNParam };
        /**
         * This is `true` if a `GNParam's` {@link CFG.PNTS.Params.default|default} is enclosed within a 
         * `callback` instead of a **direct value**.
         * @category Constructor
         */
        readonly public hideDefault: boolean;

        /**
         * A Parameter Configurator for `GNRequest` Objects.
         */
        constructor(configs: CFG.PNTS.Params);

        /**
         * Allows one to add another version of the {@link GNParam}.
         * @param version A string to represent this Version.
         * @param configs Config properties for the {@link GNParam} object.
         * @param use A string specifying a version to derive from.
         * @param derived If `true`, specifies that this Param is to be treated as a different Param.
         * @returns The current {@link GNParam}, for chanining purposes.
         */
        AddVersion(version: string, configs: CFG.PNTS.Params, use: string, derived = false): GNParam;

        /**
         * A `OpenAPI` representation of this Param.
         * @param name An optional Name to give the Param.
         * @returns An **OpenAPI 3.0** formatted, plain-object version of a {@link GNParam}.
         */
        toDoc(name: string): DocParam;

    };
    /**
     * A Parameter Description Documenter for `GNParams` or {@link GNHeaders}.
     */
    export class GNDescr implements CFG.PNTS.Descr {
        /**
         * @inheritdoc
         * @category Constructor
         */
        public readonly to: PTo;
        /**
         * @inheritdoc
         * @category Constructor
         */
        public readonly type: PType;
        /**
         * @inheritdoc
         * @category Constructor
         */
        public readonly description: string;
        /**
         * @inheritdoc
         * @category Constructor
         */
        public readonly required: boolean;
        /**
         * @inheritdoc
         * @category Constructor
         */
        public readonly hidden: boolean;
        /**
         * @inheritdoc
         * @category Constructor
         */
        public readonly matches: CLMatches;


        /**
         * A Parameter Description Documenter for `GNParams` or {@link GNHeaders}.
         */
        constructor(configs: CFG.PNTS.Descr);

        /**
         * Creates a new {@link GNDescr} version by merging the specified configs.
         * @param configs Config properties for the GNDescr object.
         * @return A newly-merged {@link GNDescr}.
         */
        Merge(configs: CFG.PNTS.Descr): GNDescr;

        /**
         * Creates a `deepcopy` of this GNDescr instance.
         * @returns A clone of the {@link GNDescr}.
         */
        toCopy(): GNDescr;

        /**
         * A plain-object representation of this Description.
         * @returns An **OpenAPI 3.0** formatted, plain-object version of a {@link GNDescr}.
         */
        toDoc(): DocDescr;

    };


    /**
     * This `class` is used to define _reusable_ `ParamTypes` which are `requred` in the {@link CFG.PNTS.Descr|Descr} 
     * definitions (_specifically, the {@link CFG.PNTS.Descr.type|Descr.type} property_). 
     * > They're used for `santization` purposes, as well as `OpenAPI` specification. Once instantiated, they serve 
     * as both a `callable-function` and an `object-instance`. An instance can also be extended to created an alternate 
     * `PType` who inherits the {@link CFG.PNTS.PTOpts.sanitizers|sanitizers} of it's `parent` in addition to its 
     * own sanitzer (_if defined_).
     * >  
     * > A {@link CFG.PNTS.PTOpts.sanitizers|sanitizer} is just a `function` that takes the value of a `request-parameter` 
     * sent by Client and ensures that it conformes to a certain standard. 
     * >  
     * > A `PType` can be set as an {@link CFG.PNTS.PTOpts.iterable|iterable}, which assume the `parameter` will be sent 
     * as an `Array`, and perform the `sanitization` over each item.
     */
    export interface PType {
        /**
         * Further restrictions and transformations can be defined on a `PType` when it is **called** as a `function`. When 
         * a `PType` is extended in this manner, it is still of the **same type**. It retains the same `name` and **does not** 
         * appear in the `OpenAPI` docs -- _unless `restriction-properties` have been set_ 
         * (_see {@link CFG.PNTS.PTArgs|PTArgs} for more details_):
         * ```js
         * PT.Text = new PType({
         *         name: 'Text', type: 'String', 
         *         sanitizers(v) { 
         *             return (!!!v || v===undefined ? 
         *                 "" : v.toString().replace(/'/g,"\\'")
         *             ); 
         *         }
         *     });
         * console.log(PT.Text.sanitize('hello, world')); // "hello, world"
         * console.log(PT.Text.sanitize(null)); // ""
         * // Further-customize by Calling the PType as a Function
         * let PT_TxtToArr = PT.Text({ selects: ["hello","world"] });
         * // Prints 
         * console.log(PT_TxtToArr.sanitize('world')); // "world"
         * console.log(PT_TxtToArr.sanitize('noice')); // ""
         * console.log(PT_TxtToArr.sanitize('hello, world')); // ""
         * ```
         * @param configs The customization properties of the `PType`.
         * @returns A customized version of the `PType`.
         */
        ({  separator, sort, join, enclose, 
            map, tags, leveled, grouped, selects, 
            omit, slice, step, min, max, regex, hidden, 
            restricted 
        }: CFG.PNTS.PTArgs): PType;
        
    };
    export class PType extends Function {
        /**
         * @see {@link CFG.PNTS.PTOpts.name|PTOpts.name}
         * @category Constructor
         */
        readonly name: string;
        /**
         * @see {@link CFG.PNTS.PTOpts.type|PTOpts.type}
         * @category Constructor
         */
        readonly type: PTKinds;
        /**
         * A collection of all of the {@link CFG.PNTS.PTOpts.sanitizers} defined for this `PType`.
         * @category Constructor
         */
        readonly sanitizers: CBSanitizer[];
        /**
         * @see {@link CFG.PNTS.PTOpts.iterable|PTOpts.iterable}
         * @category Constructor
         */
        readonly iterable: boolean;

        // --------------------------------------------------------------
        /**
         * @see {@link CFG.PNTS.PTArgs.separator|PTArgs.separator}
         * @category FunctionCall (Cosmetic)
         */
        private readonly separator: string;
        /**
         * @see {@link CFG.PNTS.PTArgs.sort|PTArgs.sort}
         * @category FunctionCall (Cosmetic)
         */
        private readonly sort: boolean;
        /**
         * @see {@link CFG.PNTS.PTArgs.join|PTArgs.join}
         * @category FunctionCall (Cosmetic)
         */
        private readonly join: string;
        /**
         * @see {@link CFG.PNTS.PTArgs.enclose|PTArgs.enclose}
         * @category FunctionCall (Cosmetic)
         */
        private readonly enclose: [string, string];
        /**
         * @see {@link CFG.PNTS.PTArgs.map|PTArgs.map}
         * @category FunctionCall (Cosmetic)
         */
        private readonly map: <T>(value: T, index?: number, array?: Array<T>) => Array<T>;
        /**
         * @see {@link CFG.PNTS.PTArgs.tags|PTArgs.tags}
         * @category FunctionCall (Cosmetic)
         */
        private readonly tags: string[];
        /**
         * @see {@link CFG.PNTS.PTArgs.leveled|PTArgs.leveled}
         * @category FunctionCall (Cosmetic)
         */
        private readonly leveled: boolean;
        /**
         * @see {@link CFG.PNTS.PTArgs.grouped|PTArgs.grouped}
         * @category FunctionCall (Cosmetic)
         */
        private readonly grouped: boolean;
        /**
         * @see {@link CFG.PNTS.PTArgs.selects|PTArgs.selects}
         * @category FunctionCall (Restrictive)
         */
        private readonly selects: Array<{label:string, value:any}>;
        /**
         * @see {@link CFG.PNTS.PTArgs.omit|PTArgs.omit}
         * @category FunctionCall (Restrictive)
         */
        private readonly omit: string[];
        /**
         * @see {@link CFG.PNTS.PTArgs.slice|PTArgs.slice}
         * @category FunctionCall (Restrictive)
         */
        private readonly slice: [number, number?];
        /**
         * @see {@link CFG.PNTS.PTArgs.step|PTArgs.step}
         * @category FunctionCall (Restrictive)
         */
        private readonly step: number;
        /**
         * @see {@link CFG.PNTS.PTArgs.min|PTArgs.min}
         * @category FunctionCall (Restrictive)
         */
        private readonly min: number;
        /**
         * @see {@link CFG.PNTS.PTArgs.max|PTArgs.max}
         * @category FunctionCall (Restrictive)
         */
        private readonly max: number;
        /**
         * @see {@link CFG.PNTS.PTArgs.regex|PTArgs.regex}
         * @category FunctionCall (Restrictive)
         */
        private readonly regex: RegExp;
        /**
         * @see {@link CFG.PNTS.PTArgs.hidden|PTArgs.hidden}
         * @category FunctionCall (Restrictive)
         */
        private readonly hidden: boolean;
        /**
         * @see {@link CFG.PNTS.PTArgs.restricted|PTArgs.restricted}
         * @category FunctionCall (Toggle)
         */
        private readonly restricted: boolean;


        // --------------------------------------------------------------
        /**
         * Creates a **new** `PType`, which serves as the definition of a `Request-Parameter Type`.
         * ```javascript
         * // Singular Sanitizer
         * new PType({ name: "", type: "", sanitizers(v) {...}, iterable: true });
         * ```
         * @param name _See: {@link CFG.PNTS.PTOpts.name|PTOpts.name}._
         * @param type _See: {@link CFG.PNTS.PTOpts.type|PTOpts.type}._
         * @param sanitizers _See: {@link CFG.PNTS.PTOpts.sanitizers|PTOpts.sanitizers}._
         * @param iterable _See: {@link CFG.PNTS.PTOpts.iterable|PTOpts.iterable}._
         * @returns A new `PType`.
         */
        constructor({ name, type, sanitizers, iterable = false }: CFG.PNTS.PTOpts);
        /**
         * Creates a **new** `PType`, which serves as the definition of a `Request-Parameter Type`.
         * ```javascript
         * // Multiple sanitizers, ran in succession
         * new PType({ 
         *     name: "", type: "", sanitizers: [
         *         (v) => (...), 
         *         (v) => (...), 
         *         (v) => (...), 
         *     ],
         * });
         * ```
         */
        constructor({ name, type, sanitizers, iterable = false }: CFG.PNTS.PTOptsMulti);


        // --------------------------------------------------------------
        /**
         * Performs each of the {@link CFG.PNTS.PTOpts.sanitizers|sanitizers} and any {@link CFG.PNTS.PTArgs|PTArg} 
         * transformations that have been defined for a particular `PType`.
         * @param v A `parameter` value froma Client `request`.
         * @returns The sanitized value.
         * @category Main
         */
        sanitize(v: TPQryPrims): TPQryPrims;

        /**
         * Extends the current {@link PType}, producing a new one with and different {@link CFG.PNTS.PTOpts.name|name} and 
         * other modifications. When a `PType` is `extended`, it becomes a new `param-type` and will be included in the 
         * `OpenAPI` docs (_see {@link CFG.PNTS.PTOpts|PTOpts} for more details_).
         * ### Example
         * ```javascript
         * // Type-checks for Array<String>
         * PT.L.ArrStr = new PType({ 
         *     name: "StrArray", type: "String", 
         *     sanitizers(v) { return v.constructor.name===this.type; }, 
         *     iterable: true 
         * });
         * // Type-checks for Array<Number>
         * PT.L.ArrNum = ArrStr.extend({ 
         *     name: "NumArray", type: "Number"
         * });
         * ```
         * @param configs A config `object` for `PTypes`.
         * @returns {PType} The brand-new `PType`.
         * @category Main
         */
        extend({ name, type, sanitizers = undefined, iterable = false }: CFG.PNTS.PTOpts): PType;
        /**
         * Like the {@link PType.constructor|constructor}, the `extend` function can also define an 
         * `Array` of {@link CBSanitizer|sanitizers} in the {@link CFG.PNTS.PTOpts.sanitizers|PTOpts} 
         * argument.
         */
        extend({ name, type, sanitizers = undefined, iterable = false }: CFG.PNTS.PTOptsMulti): PType;


        // --------------------------------------------------------------
        /**
         * Cycles through the sanitization processes
         * @param value The value to sanitze
         * @returns The sanitized value
         * @category Main
         */
        private cycle(value: TPQryPrims): TPQryPrims;

        /**
         * A Unique-Identifier for the Type.
         * @param name Add a Type-Name to the Unique-Identifier.
         * @param dflt A default-value. If set, will assume a Type-Name is needed.
         * @returns The unique identifier.
         * @category Main
         */
        private unique(name?: string, dflt?: any): string;


        // --------------------------------------------------------------
        /**
         * A `string` representation of the `PType`.
         * ### Example
         * ```javascript
         * console.log(new PType({
         *     name: 'TwoNumbers', type: 'Number',
         *     iterable: true, sanitizers(v) { ... }
         * })({
         *     min: 0, max: 2, slice: [0,2]
         * }).toString())
         * ```
         * > #### Console:
         * > ```console
         * > TwoNumbers {
         * >     type: "array",
         * >     items: {
         * >         type: "integer",
         * >         minimum: 1
         * >     },
         * >     minItems: 0,
         * >     maxItems: 2
         * > };
         * > ```
         * @category Presentation
         */
        toString(): string;

        /**
         * A `OpenAPI`-compliant version of a `PType`.
         * ### Example
         * ```javascript
         * (new PType({
         *     name: 'TwoNumbers', type: 'Number',
         *     iterable: true, sanitizers(v) { ... }
         * })({
         *     min: 0, max: 2, slice: [0,2]
         * }).toDoc() === {
         *     type: "array",
         *     items: {
         *         type: "integer",
         *         minimum: 1
         *     },
         *     minItems: 0,
         *     maxItems: 2
         * });
         * ```
         * @category Presentation
         */
        toDoc(): DocPType<TPDocPrims,boolean>;


        // --------------------------------------------------------------
        /** @hidden */ private prototype: any;
        /** @hidden */ private length: number;
        /** @hidden */ private arguments: any;
        /** @hidden */ private caller: Function;
        /** @hidden */ private static Function: FunctionConstructor;

        // --------------------------------------------------------------
        /**
         * Determines whether the given value inherits from this function if this function was used as a constructor function.
         * 
         * A constructor function can control which objects are recognized as its instances by 'instanceof' by overriding this method.
         * @param value 
         * @category Prototype
         */
        [Symbol.hasInstance](value: any): boolean;
        /**
         * Calls the `PType`, substituting the specified object for the this value of the `PType`, and the specified array for the arguments of the `PType`.
         * @param this 
         * @param thisArg The object to be used as the this object.
         * @param argArray A set of arguments to be passed to the function.
         * @category Prototype
         */
        apply(this: PType, thisArg: any, argArray?: any): any;
        /**
         * Calls a `method` of a `PType`, substituting another `PType` for the current `PType`.
         * @param this 
         * @param thisArg The object to be used as the current object.
         * @param argArray A list of arguments to be passed to the method.
         * @category Prototype
         */
        call(this: PType, thisArg: any, ...argArray: any[]): any;
        /**
         * Calls the `PType`, substituting the specified object for the this value of the `PType`, and the specified array for the arguments of the `PType`.
         * @param this 
         * @param thisArg An object to which the this keyword can refer inside the new function.
         * @param argArray A list of arguments to be passed to the new function.
         * @category Prototype
         */
        bind(this: PType, thisArg: any, ...argArray: any[]): any;
    };


    /**
     * A collection of often-used `PTypes`.
     */
    export interface PT {
        [propName: string]: (PType|{[typeName:string]:PType}|Function);
    }
    export class PT {
        /**
         * ...
         */
        static get Docs(): { [typeName: string]: DocPType<TPDocPrims,boolean> };
        /**
         * ...
         */
        static get Examples(): string;
    };
    export namespace PT {
        /**
         * ...
         * @category Primitive
         */
        export const Text: PType;
        /**
         * ...
         * @category Primitive
         */
        export const Num: PType;
        /**
         * ...
         * @category Primitive
         */
        export const Bool: PType;
        /**
         * ...
         * @category Primitive
         */
        export const Obj: PType;
        /**
         * @category Iterable
         */
        export const L: CLPTypes;
        /**
         * @category Iterable
         */
        export const O: CLPTypes;
    };


    /**
     * A collection of often-used groups of **HTTP-Methods**.
     */
    export var _Methods: {
        GET:    ['GET'],
        POST:   ['POST'],
        PUT:    ['PUT'],
        DELETE: ['DELETE'],
        MID:    ['MID'],
        GPOS:   ['GET','POST'],
        GPUT:   ['GET','PUT'],
        MPOS:   ['MID','POST'],
        CUD:    ['POST','PUT','DELETE'],
        EDIT:   ['GET','POST','PUT'],
        FULL:   ['GET','POST','PUT','DELETE'],
        ALL:    ['GET','POST','PUT','DELETE','MID'],
    };


    /** @hidden */
    type DefaultsKeys = 'Kinds' | 'Headers' | 'Params';
    /** @hidden */
    type DefaultsTypes = (CLMethods|CLParams);
    /** @hidden */
    interface CNFDefaults {
        Kinds: CLMethods;
        Headers: CLParameters;
        Params: CLParameters;
    };
    /** @hidden */
    interface CNFDefaultMap {
        Kinds: Immutable.OrderedMap<string,Immutable.List<HMETHODs>>;
        Headers: Immutable.OrderedMap<string,GNParam>;
        Params: Immutable.OrderedMap<string,GNParam>;
    };
    /** @private */
    function DefaultsMap(obj: CNFDefaults): DefaultsMap;
    /** @private */
    interface DefaultsMap extends Imm.OrderedMap<DefaultsKeys,DefaultsTypes> {
        toJS(): CNFDefaults;
        get<I extends keyof CNFDefaults>(key: I): CNFDefaultMap[I];
        set<S extends keyof CNFDefaults>(key: S, value: CNFDefaults[S]): Map<DefaultsKeys, CNFDefaults>;
    };

    /**
     * A collection of often-used `HMETHODs` and `GNParams`.
     * @private
     */
    export var _Defaults = DefaultsMap({
        Kinds: _Methods,
        Headers: {
            Token: GNParam
        },
        Params: {
            Single: GNParam,
            Visible: GNParam,
            Limit: GNParam,
            Page: GNParam,
            CliIP: GNParam,
            ID: GNParam,
            UUID: GNParam
        }
    });


    /**
     * Initializes all customized Configurators.
     */
    export function Init(): {
        /**
         * ...
         */
        Settings: CFG.Settings;
        /**
         * ...
         */
        DB:       CFG.Database;
        /**
         * ...
         */
        NMSP:     CFG.Spaces;
        /**
         * ...
         */
        AuthP:()=>CFG.AuthPoints;
        /**
         * ...
         */
        EndP: ()=>CFG.DataPoints;
    };

}
