This is simple authentication service based on Express/Node.js platform 
        It uses:
         - Mongoose wrapper for persist data store
         - Mocha & Chai/Chai-http for testing
         - Docker, Docker Compose deploying configuration
         - Nginx as revers-proxy for signing https trafic
         - Certbot for getting certificates

To authenticate you need use next authentication flow:

    -Your domain needs to be allowed (You can add your domain to "Allow List", using settings page
        of this service which can be found on root path of the service domain, you have to get Admin 
        password to permanently addyour domain, or Dev password to alloww your domain only for one day) 
    -
