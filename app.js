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


        // Lecture du fichier index.html
        const filePath = path.join(__dirname, 'web', 'index.html');
        let html = fs.readFileSync(filePath, 'utf-8');

        // Insertion directe des variables dans l'HTML

        html = html.replace(/{{title}}/g, "Actu221 | L’essentiel de l'information");
        html = html.replace(/{{description}}/g,  "Actu221 est une maison de presse dynamique et moderne, spécialisée dans la couverture de l'actualité et des événements locaux et régionaux. Elle vise à offrir une information précise, équilibrée et actuelle à ses lecteurs et auditeurs, en mettant l'accent sur la pertinence des nouvelles pour la communauté qu'elle dessert");
        html = html.replace(/{{imageUrl}}/g, "https://scontent.fcky2-1.fna.fbcdn.net/v/t39.30808-6/276091570_1411801672582180_92972350406487468_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=dvohOpyp8rUQ7kNvgES-8T1&_nc_ht=scontent.fcky2-1.fna&oh=00_AYA1ODKTQTK-lWzyfN3yww73ouXahB-wQtqMmfnsldgobA&oe=66D2ACE0");
        html = html.replace(/{{imageAlt}}/g,  "Actu221");
        html = html.replace(/{{url}}/g,   "https://test-actu.deally.fr/");

        // Envoi de l'HTML modifié au client
        res.send(html);

    } catch (error) {
         // Lecture du fichier index.html
         const filePath = path.join(__dirname, 'web', 'index.html');
         let html = fs.readFileSync(filePath, 'utf-8');
 
         // Insertion directe des variables dans l'HTML
 
         html = html.replace(/{{title}}/g, "Actu221 | L’essentiel de l'information");
         html = html.replace(/{{description}}/g,  "Actu221 est une maison de presse dynamique et moderne, spécialisée dans la couverture de l'actualité et des événements locaux et régionaux. Elle vise à offrir une information précise, équilibrée et actuelle à ses lecteurs et auditeurs, en mettant l'accent sur la pertinence des nouvelles pour la communauté qu'elle dessert");
         html = html.replace(/{{imageUrl}}/g, "https://scontent.fcky2-1.fna.fbcdn.net/v/t39.30808-6/276091570_1411801672582180_92972350406487468_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=dvohOpyp8rUQ7kNvgES-8T1&_nc_ht=scontent.fcky2-1.fna&oh=00_AYA1ODKTQTK-lWzyfN3yww73ouXahB-wQtqMmfnsldgobA&oe=66D2ACE0");
         html = html.replace(/{{imageAlt}}/g,  "Actu221");
         html = html.replace(/{{url}}/g,   "https://test-actu.deally.fr/");
 
         // Envoi de l'HTML modifié au client
         res.send(html);
    }
});


app.get('/article/:slug', async (req, res) => {
    try {

        const urlPath = req.path;
        const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;

        // Afficher le chemin de l'URL et l'URL complète
        console.log('Chemin de l\'URL:', urlPath);
        console.log('URL Complète:', baseApiUrl+urlPath);

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
        html = html.replace(/{{url}}/g,   "https://test-actu.deally.fr/article/alioune-tine-demande-aux-autorits-dassurer-la-scurit-dahmeth-suzanne-camara");

        // Envoi de l'HTML modifié au client
        res.send(html);

    } catch (error) {
        // Lecture du fichier index.html
        const filePath = path.join(__dirname, 'web', 'index.html');
        let html = fs.readFileSync(filePath, 'utf-8');

        // Insertion directe des variables dans l'HTML

        html = html.replace(/{{title}}/g, "Actu221 | L’essentiel de l'information");
        html = html.replace(/{{description}}/g,  "Actu221 est une maison de presse dynamique et moderne, spécialisée dans la couverture de l'actualité et des événements locaux et régionaux. Elle vise à offrir une information précise, équilibrée et actuelle à ses lecteurs et auditeurs, en mettant l'accent sur la pertinence des nouvelles pour la communauté qu'elle dessert");
        html = html.replace(/{{imageUrl}}/g, "https://scontent.fcky2-1.fna.fbcdn.net/v/t39.30808-6/276091570_1411801672582180_92972350406487468_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=dvohOpyp8rUQ7kNvgES-8T1&_nc_ht=scontent.fcky2-1.fna&oh=00_AYA1ODKTQTK-lWzyfN3yww73ouXahB-wQtqMmfnsldgobA&oe=66D2ACE0");
        html = html.replace(/{{imageAlt}}/g,  "Actu221");
        html = html.replace(/{{url}}/g,   "https://test-actu.deally.fr/");

        // Envoi de l'HTML modifié au client
        res.send(html);
    }
});

app.get('/categorie/:slug', async (req, res) => {
    try {

        // Lecture du fichier index.html
        const filePath = path.join(__dirname, 'web', 'index.html');
        let html = fs.readFileSync(filePath, 'utf-8');

        // Insertion directe des variables dans l'HTML

        html = html.replace(/{{title}}/g, "Actu221 | "+req.params.slug);
        html = html.replace(/{{description}}/g,  "Actu221 est une maison de presse dynamique et moderne, spécialisée dans la couverture de l'actualité et des événements locaux et régionaux. Elle vise à offrir une information précise, équilibrée et actuelle à ses lecteurs et auditeurs, en mettant l'accent sur la pertinence des nouvelles pour la communauté qu'elle dessert");
        html = html.replace(/{{imageUrl}}/g, "https://scontent.fcky2-1.fna.fbcdn.net/v/t39.30808-6/276091570_1411801672582180_92972350406487468_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=dvohOpyp8rUQ7kNvgES-8T1&_nc_ht=scontent.fcky2-1.fna&oh=00_AYA1ODKTQTK-lWzyfN3yww73ouXahB-wQtqMmfnsldgobA&oe=66D2ACE0");
        html = html.replace(/{{imageAlt}}/g,  "Actu221");
        html = html.replace(/{{url}}/g,   "https://test-actu.deally.fr/"+req.params.slug);

        
        res.send(html);

    } catch (error) {
        // Lecture du fichier index.html
        const filePath = path.join(__dirname, 'web', 'index.html');
        let html = fs.readFileSync(filePath, 'utf-8');

        // Insertion directe des variables dans l'HTML

        html = html.replace(/{{title}}/g, "Actu221 | "+req.params.slug);
        html = html.replace(/{{description}}/g,  "Actu221 est une maison de presse dynamique et moderne, spécialisée dans la couverture de l'actualité et des événements locaux et régionaux. Elle vise à offrir une information précise, équilibrée et actuelle à ses lecteurs et auditeurs, en mettant l'accent sur la pertinence des nouvelles pour la communauté qu'elle dessert");
        html = html.replace(/{{imageUrl}}/g, "https://scontent.fcky2-1.fna.fbcdn.net/v/t39.30808-6/276091570_1411801672582180_92972350406487468_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=dvohOpyp8rUQ7kNvgES-8T1&_nc_ht=scontent.fcky2-1.fna&oh=00_AYA1ODKTQTK-lWzyfN3yww73ouXahB-wQtqMmfnsldgobA&oe=66D2ACE0");
        html = html.replace(/{{imageAlt}}/g,  "Actu221");
        html = html.replace(/{{url}}/g,   "https://test-actu.deally.fr/"+req.params.slug);

        
        res.send(html);
    }
});


app.get('/login', async (req, res) => {
    try {

         // Lecture du fichier index.html
         const filePath = path.join(__dirname, 'web', 'index.html');
         let html = fs.readFileSync(filePath, 'utf-8');
 
         
        res.send(html);

    } catch (error) {
        // Lecture du fichier index.html
        const filePath = path.join(__dirname, 'web', 'index.html');
        let html = fs.readFileSync(filePath, 'utf-8');

       
        
        res.send(html);
    }
});

app.get('/administratif', async (req, res) => {
    try {

         // Lecture du fichier index.html
         const filePath = path.join(__dirname, 'web', 'index.html');
         let html = fs.readFileSync(filePath, 'utf-8');
 
         
        res.send(html);

    } catch (error) {
        // Lecture du fichier index.html
        const filePath = path.join(__dirname, 'web', 'index.html');
        let html = fs.readFileSync(filePath, 'utf-8');

       
        
        res.send(html);

    }
});

app.get('/redacteur', async (req, res) => {
    try {

        // Lecture du fichier index.html
        const filePath = path.join(__dirname, 'web', 'index.html');
        let html = fs.readFileSync(filePath, 'utf-8');

       
        
        res.send(html);

    } catch (error) {
        // Lecture du fichier index.html
        const filePath = path.join(__dirname, 'web', 'index.html');
        let html = fs.readFileSync(filePath, 'utf-8');

       
        
        res.send(html);

    }
});

app.get('/journaliste', async (req, res) => {
    try {

        // Lecture du fichier index.html
        const filePath = path.join(__dirname, 'web', 'index.html');
        let html = fs.readFileSync(filePath, 'utf-8');

       
        
        res.send(html);

    } catch (error) {
        // Lecture du fichier index.html
        const filePath = path.join(__dirname, 'web', 'index.html');
        let html = fs.readFileSync(filePath, 'utf-8');

       
        
        res.send(html);

    }
});

// Démarrage du serveur
const PORT = process.env.PORT || 7200;
app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});
