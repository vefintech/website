module.exports = {
    'secret': 'fVOFXrmvUo',
    'sessionTime': 86400,
    'registerLinkTime': 1543606636,  //1 Hora
    'home': 'http://www.venezuelafintech.org',
    'audience': 'web',
    'issuer': 'fintechvenezuela',
    'development': {
        "username": "fintechDB",
        "password": "WTf2000",
        "database": "fintechve",
        "host": "127.0.0.1",
        "dialect": "mysql",
        "operatorsAliases": false
    },
    'production': {
        "username": "fintechDB",
        "password": "WTf2000",
        "database": "fintechve",
        "host": "127.0.0.1",
        "dialect": "mysql",
        "operatorsAliases": false     
    },
    'preferedLanguage': 'es',
    'email': {
        'host': 'smtp.sparkpostmail.com',
        'port': '587',
        'secure': false,
        'auth': true,
        'tls': true,
        'user': 'SMTP_Injection',
        'password': '9be48958aa242fe05f88c71f0d7b66d2646ea803',
        'sender': 'no-reply@venezuelafintech.org'
    }
    
};