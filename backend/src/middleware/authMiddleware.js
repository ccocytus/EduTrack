const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        // le token arrive comme "Bearer eyJhbGciOi..."
        const token = req.headers.authorization.split(' ')[1];
        
        // verification du token avec la clé secrete
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        
        // ajout des infos user a la requete
        req.user = {
            id: decodedToken.id,
            role: decodedToken.role
        };
        
        next(); // passage au controlleur suivant
    } catch (error) {
        res.status(401).json({ error: 'Requête non authentifiée !' });
    }
};