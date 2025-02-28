const express = require('express');
const axios = require('axios');
const fs = require('fs');
const cheerio = require('cheerio');
const compression = require('compression');
const path = require('path');
const app = express();
app.use(compression());

function getSecondParagraph(html) {
    const $ = cheerio.load(html);
    const paragraphs = $('p').toArray(); // Récupère tous les <p>

    return paragraphs.length >= 2 ? $(paragraphs[1]).text().trim() : null;
}

// URL de l'API pour récupérer l'article

const baseApiUrl = 'https://api-actu.yaatalmbinde.sn/api/v1/articles';

// Lire le fichier une seule fois au démarrage
const filePath = path.join(__dirname, 'web', 'index.html');
let cachedHtml = "";

fs.promises.readFile(filePath, 'utf-8')
    .then(data => cachedHtml = data)
    .catch(err => console.error("Erreur de lecture du fichier HTML :", err));

app.get('/', async (req, res) => {
    try {
        if (!cachedHtml) {
            return res.status(500).send("Erreur interne du serveur, HTML introuvable");
        }

        // Définition des variables dynamiques
        const replacements = {
            "{{title}}": "Actu221 , 1er média digital du SÉNÉGAL",
            "{{description}}": "vous offre l'actualité en temps réel ! Des analyses exclusives, Des interviews percutantes. 📲Rejoignez-nous",
            "{{image}}": "https://api-actu.yaatalmbinde.sn/actu221-file/a221-logo.jpg",
            "{{imageAlt}}": "Actu221",
            "{{url}}": "https://a221.net/"
        };

        let html = cachedHtml;
        for (const [key, value] of Object.entries(replacements)) {
            html = html.replace(new RegExp(key, "g"), value);
        }

        res.send(html);

    } catch (error) {
        console.error("Erreur lors du chargement de index.html :", error);
        res.status(500).send("Erreur interne du serveur");
    }
});



app.get('/article/:slug', async (req, res) => {
    try {

        const urlPath = req.path;

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
        html = html.replace(/{{image}}/g, "https://api-actu.yaatalmbinde.sn"+ article.image.url || '');
        html = html.replace(/{{imageAlt}}/g,  article.titre || '');
        html = html.replace(/{{url}}/g,   "https://a221.net"+req.path);

        // Envoi de l'HTML modifié au client
        res.send(html);

    }
    catch (error) {
        // Lecture du fichier index.html
        const filePath = path.join(__dirname, 'web', 'index.html');
        let html = fs.readFileSync(filePath, 'utf-8');

        // Insertion directe des variables dans l'HTML

        html = html.replace(/{{title}}/g, "Actu221 | L’essentiel de l'information");
        html = html.replace(/{{description}}/g,  "Actu221 est une maison de presse dynamique et moderne, spécialisée dans la couverture de l'actualité et des événements locaux et régionaux. Elle vise à offrir une information précise, équilibrée et actuelle à ses lecteurs et auditeurs, en mettant l'accent sur la pertinence des nouvelles pour la communauté qu'elle dessert");
        html = html.replace(/{{image}}/g, "https://scontent.fcky2-1.fna.fbcdn.net/v/t39.30808-6/276091570_1411801672582180_92972350406487468_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=dvohOpyp8rUQ7kNvgES-8T1&_nc_ht=scontent.fcky2-1.fna&oh=00_AYA1ODKTQTK-lWzyfN3yww73ouXahB-wQtqMmfnsldgobA&oe=66D2ACE0");
        html = html.replace(/{{imageAlt}}/g,  "Actu221");
        html = html.replace(/{{url}}/g,   "https://a221.net/");

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
        html = html.replace(/{{image}}/g, "https://scontent.fcky2-1.fna.fbcdn.net/v/t39.30808-6/276091570_1411801672582180_92972350406487468_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=dvohOpyp8rUQ7kNvgES-8T1&_nc_ht=scontent.fcky2-1.fna&oh=00_AYA1ODKTQTK-lWzyfN3yww73ouXahB-wQtqMmfnsldgobA&oe=66D2ACE0");
        html = html.replace(/{{imageAlt}}/g,  "Actu221");
        html = html.replace(/{{url}}/g,   "https://a221.net/"+req.params.slug);
        res.send(html);

    } catch (error) {
        // Lecture du fichier index.html
        const filePath = path.join(__dirname, 'web', 'index.html');
        let html = fs.readFileSync(filePath, 'utf-8');

        // Insertion directe des variables dans l'HTML

        html = html.replace(/{{title}}/g, "Actu221 | "+req.params.slug);
        html = html.replace(/{{description}}/g,  "Actu221 est une maison de presse dynamique et moderne, spécialisée dans la couverture de l'actualité et des événements locaux et régionaux. Elle vise à offrir une information précise, équilibrée et actuelle à ses lecteurs et auditeurs, en mettant l'accent sur la pertinence des nouvelles pour la communauté qu'elle dessert");
        html = html.replace(/{{image}}/g, "https://scontent.fcky2-1.fna.fbcdn.net/v/t39.30808-6/276091570_1411801672582180_92972350406487468_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=dvohOpyp8rUQ7kNvgES-8T1&_nc_ht=scontent.fcky2-1.fna&oh=00_AYA1ODKTQTK-lWzyfN3yww73ouXahB-wQtqMmfnsldgobA&oe=66D2ACE0");
        html = html.replace(/{{imageAlt}}/g,  "Actu221");
        html = html.replace(/{{url}}/g,   "https://a221.net/"+req.params.slug);

        
        res.send(html);
    }
});

app.get('/tag/:slug', async (req, res) => {
    try {

        // Lecture du fichier index.html
        const filePath = path.join(__dirname, 'web', 'index.html');
        let html = fs.readFileSync(filePath, 'utf-8');

        // Insertion directe des variables dans l'HTML

        html = html.replace(/{{title}}/g, "Actu221 | "+req.params.slug);
        html = html.replace(/{{description}}/g,  "Actu221 est une maison de presse dynamique et moderne, spécialisée dans la couverture de l'actualité et des événements locaux et régionaux. Elle vise à offrir une information précise, équilibrée et actuelle à ses lecteurs et auditeurs, en mettant l'accent sur la pertinence des nouvelles pour la communauté qu'elle dessert");
        html = html.replace(/{{image}}/g, "https://scontent.fcky2-1.fna.fbcdn.net/v/t39.30808-6/276091570_1411801672582180_92972350406487468_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=dvohOpyp8rUQ7kNvgES-8T1&_nc_ht=scontent.fcky2-1.fna&oh=00_AYA1ODKTQTK-lWzyfN3yww73ouXahB-wQtqMmfnsldgobA&oe=66D2ACE0");
        html = html.replace(/{{imageAlt}}/g,  "Actu221");
        html = html.replace(/{{url}}/g,   "https://a221.net/"+req.params.slug);
        res.send(html);

    } catch (error) {
        // Lecture du fichier index.html
        const filePath = path.join(__dirname, 'web', 'index.html');
        let html = fs.readFileSync(filePath, 'utf-8');

        // Insertion directe des variables dans l'HTML

        html = html.replace(/{{title}}/g, "Actu221 | "+req.params.slug);
        html = html.replace(/{{description}}/g,  "Actu221 est une maison de presse dynamique et moderne, spécialisée dans la couverture de l'actualité et des événements locaux et régionaux. Elle vise à offrir une information précise, équilibrée et actuelle à ses lecteurs et auditeurs, en mettant l'accent sur la pertinence des nouvelles pour la communauté qu'elle dessert");
        html = html.replace(/{{image}}/g, "https://scontent.fcky2-1.fna.fbcdn.net/v/t39.30808-6/276091570_1411801672582180_92972350406487468_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=dvohOpyp8rUQ7kNvgES-8T1&_nc_ht=scontent.fcky2-1.fna&oh=00_AYA1ODKTQTK-lWzyfN3yww73ouXahB-wQtqMmfnsldgobA&oe=66D2ACE0");
        html = html.replace(/{{imageAlt}}/g,  "Actu221");
        html = html.replace(/{{url}}/g,   "https://a221.net/"+req.params.slug);

        
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

app.get('/recent', async (req, res) => {
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

app.use(express.static(path.join(__dirname, 'web'), {
    maxAge: '30d', // Cache les fichiers statiques pendant 30 jours
    immutable: true // Indique que les fichiers ne changent pas souvent
}));


// Démarrage du serveur
const PORT = process.env.PORT || 7200;
app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});
