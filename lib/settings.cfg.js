
module.exports = {
	Debug: 	true,
	Port: 	3001,
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
		Age: 	(((3600*1000)*24)*30),
		REDIS: 	{
			Config: {
				Host: 		'localhost',
				Port: 		6379,
				Password: 	'Pion33r247',
			},
			Main:	'Client',
			Stores: [
				'Users',
				'Limits',
				'Lockers',
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
		}
	}
};
