
module.exports = {
	Debug: 	true,
	Port: 	3001,
	Services: 	[
		'http://localhost:3001/gbl-accessor',
		'http://localhost:3001/gbl-rest',
	],
	APIDoc: {
		info: {
			title: "Untitled API",
			description: "",
			termsOfService: "",
			contact: { 
				name: "Contact Name",
				email: "email.address@domain.com",
				url: "https://domain.com/support",
			},
			license: {
				name: "Apache 2.0",
				url: "http://www.apache.org/licenses/LICENSE-2.0.html"
			},
			version: "1.0.0"
		},
		externalDocs: {},
		servers: [],
	},
	Folders: {
		Uploads: {
			Folder:  'uploads',
			Age: 	 365*86400,
			Matcher: /\?(?:\w+=.+)$/,
			Headers: null,
		},
		Publics: {
			Folder:  'public',
			Age: 	 365*86400,
			Matcher: /\?(?:\w+=.+)$/,
			Headers: null,
		}
	},
	Session: {
		Secret: "Or53cr3tmYshQuldk-eyr@nd@MbeWE!_rds0me7h!Ng",
		Age: 	{
			Out: (1000*300),
			In:  (((1000*60*60)*24)*30),
		},
		REDIS: 	{
			Config: {
				Host: 		'localhost',
				Port: 		6379,
				Password: 	'myp@55w0rd',
			},
			Main:	{ Index: 0, Name: 'Client' },
			Stores: [
				{ Index: 1, Name: 'Users'   },
				{ Index: 2, Name: 'Limits'  },
				{ Index: 3, Name: 'Lockers' },
			]
		},
		Auth: {
			Flush: 	false,
			SQL: 	{
				Login: 	 "SELECT email_address, user_pass FROM users WHERE email_address = ?",
				Profile: "SELECT * FROM users WHERE email_address = ?"
			},
			Format: {
				Account: 'email_address',
				Profile: "*",
				Scopes: [
					'user_id',
					'display_name',
					'email_address',
					'user_pass',
				]
			}
		},
		Limits: {
			All: {
				"IP/Day": {
					total: 5000, method: 'all',
					lookup: ['connection.remoteAddress'],
				}
			}
		},
		Plugins:	{

		},
	}
};
