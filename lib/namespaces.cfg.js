
module.exports = {
    Global:     { // RESERVED ~ !!!
        config:     {
            name:        'global',
            title:       'API Remoter',
            description: 'Server API Access',
            accessor:     false,
            page:         null,
        }, 
        expose:     [
            'accessor',
            'rest',
        ],
    },
    Accessor:   { // RESERVED ~ !!!
        config:     {
            name:        'accessor',
            title:       'API Authoriser',
            description: 'Granting Access',
            accessor:     true,
            page:         null,
        },
    },
    REST:       { // RESERVED ~ !!!
        config:     {
            name:        'rest',
            title:       'API Explorer',
            description: 'Querying Data',
            accessor:     false,
            page:        {
                title:      () => 'API Explorer',
                CSS:        ['explorer'],
                styles:      true,
                main:       'explorer',
                type:       'cover',
            },
        },
    },
};
