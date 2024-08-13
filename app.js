const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const app = express();

function getSecondParagraph(html) {
    // Utilisation de regex pour capturer le contenu des balises <p>
    const paragraphs = html.match(/<p[^>]*>(.*?)<\/p>/gi);

    // Vérifie s'il y a au moins deux paragraphes
    if (paragraphs && paragraphs.length >= 2) {
        // Extraction du deuxième paragraphe et suppression des balises HTML
        const secondParagraph = paragraphs[1].replace(/<\/?[^>]+(>|$)/g, "");
        return secondParagraph.trim(); // Suppression des espaces en trop
    }

    // Retourne null si le deuxième paragraphe n'existe pas
    return null;
}

// URL de l'API pour récupérer l'article
const apiUrl = 'https://api-actu.deally.fr/api/v1/articles/article/alioune-tine-demande-aux-autorits-dassurer-la-scurit-dahmeth-suzanne-camara';

const baseApiUrl = 'https://api-actu.deally.fr/api/v1/articles';


app.get('/', async (req, res) => {
    try {

        const urlPath = req.path;
        const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;

        // Afficher le chemin de l'URL et l'URL complète
        console.log('Chemin de l\'URL:', urlPath);
        console.log('URL Complète:', fullUrl);

        // Récupération de l'objet article depuis l'API
        const response = await axios.get(apiUrl);
        const article = response.data.data;

        // Lecture du fichier index.html
        const filePath = path.join(__dirname, 'web', 'index.html');
        let html = fs.readFileSync(filePath, 'utf-8');

        // Insertion directe des variables dans l'HTML

        html = html.replace(/{{title}}/g, article.titre || '');
        html = html.replace(/{{description}}/g, getSecondParagraph(article.description) || '');
        html = html.replace(/{{imageUrl}}/g, "https://api-actu.deally.fr"+ article.image.url || '');
        html = html.replace(/{{imageAlt}}/g,  article.titre || '');
        html = html.replace(/{{content}}/g,   "image");

        // Envoi de l'HTML modifié au client
        res.send(html);

    } catch (error) {
        console.error('Erreur lors de la récupération de l\'article ou du rendu du fichier :', error);
        res.status(500).send('Erreur serveur');
    }
});


app.get('/article/:slug', async (req, res) => {
    try {

        const urlPath = req.path;
        const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;

        // Afficher le chemin de l'URL et l'URL complète
        console.log('Chemin de l\'URL:', urlPath);
        console.log('URL Complète:', fullUrl);

        // Récupération de l'objet article depuis l'API
        const response = await axios.get(baseApiUrl+req.path);
        const article = response.data.data;

        // Lecture du fichier index.html
        const filePath = path.join(__dirname, 'web', 'index.html');
        let html = fs.readFileSync(filePath, 'utf-8');

        // Insertion directe des variables dans l'HTML

        html = html.replace(/{{title}}/g, article.titre || '');
        html = html.replace(/{{description}}/g, getSecondParagraph(article.description) || '');
        html = html.replace(/{{imageUrl}}/g, "https://api-actu.deally.fr"+ article.image.url || '');
        html = html.replace(/{{imageAlt}}/g,  article.titre || '');
        html = html.replace(/{{content}}/g,   "image");

        // Envoi de l'HTML modifié au client
        res.send(html);

    } catch (error) {
        console.error('Erreur lors de la récupération de l\'article ou du rendu du fichier :', error);
        res.status(500).send('Erreur serveur');
    }
});

// Démarrage du serveur
const PORT = process.env.PORT || 7200;
app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});
