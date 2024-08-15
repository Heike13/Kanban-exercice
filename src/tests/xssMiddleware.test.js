import request from 'supertest';
import { describe, it, expect } from '@jest/globals';
import express from 'express';
import xssMiddleware from '../middlewares/xssMiddleware';

const app = express();
app.use(express.json());
app.use(xssMiddleware);

// La route de test pour les requêtes POST
app.post('/test', (req, res) => {
    res.status(200).send(req.body);
});
// La route de test pour les requêtes GET avec query
app.get('/test', (req, res) => {
    res.status(200).send(req.query);
});

// La route de test pour les requêtes GET avec params
app.get('/test/:name', (req, res) => {
    res.status(200).send({ name: req.params.name });
});

describe('xssMiddleware', () => {
    it('should clean malicious entries for req.body', async () => {
        const maliciousBody = { name: '<script>alert("xss")</script>' };
        const cleanedBody = {
            name: '&lt;script&gt;alert("xss")&lt;/script&gt;',
        };

        const response = await request(app).post('/test').send(maliciousBody);

        expect(response.status).toBe(200);
        expect(response.body).toEqual(cleanedBody);
    });

    it('should clean malicious entries for req.query', async () => {
        const maliciousQuery = { name: '<script>alert("xss")</script>' };
        const cleanedQuery = {
            name: '&lt;script&gt;alert("xss")&lt;/script&gt;',
        };

        const response = await request(app).get('/test').query(maliciousQuery);

        expect(response.status).toBe(200);
        expect(response.body).toEqual(cleanedQuery);
    });

    it('should clean malicious entries for req.params', async () => {
        const maliciousParams = '<script>alert("xss")</script>';
        const encodedParams = encodeURIComponent(maliciousParams); // Encode special characters
        const cleanedParams = '&lt;script&gt;alert("xss")&lt;/script&gt;';

        const response = await request(app).get(`/test/${encodedParams}`);

        // Décoder la valeur de `name` dans la réponse avant comparaison
        const decodedResponseBody = JSON.parse(JSON.stringify(response.body));
        decodedResponseBody.name = decodeURIComponent(decodedResponseBody.name);

        expect(response.status).toBe(200);
        expect(decodedResponseBody).toEqual({ name: cleanedParams });
    });
});
