import Joi from 'joi';
import { Card, List } from '../models/index.js';

const hexadecimalColorSchema = Joi.string()
    .pattern(new RegExp('^#([0-9a-fA-F]{3}){1,2}$'))
    .message(
        '"color" with value "#FF00FFF" failed to match expected format. Please use a valid hexadecimal color.'
    );

const cardController = {
    async index(req, res) {
        const cards = await Card.findAll({
            include: 'tags',
        });
        res.json(cards);
    },

    async show(req, res) {
        const { error } = Joi.number()
            .integer()
            .greater(0)
            .validate(req.params.id);
        if (error) {
            return res.status(404).json({
                error: `Card not found. Verify the provided ID. ${error.message}`,
            });
        }

        const cardId = parseInt(req.params.id);
        const card = await Card.findByPk(cardId);

        if (!card) {
            return res.status(404).json({ error: 'Card not found.' });
        }
        res.json(card);
    },
    async destroy(req, res) {
        const cardId = parseInt(req.params.id);

        if (!Number.isInteger(cardId)) {
            return res.status(404).json({ error: `Card not found` });
        }

        const card = await Card.findByPk(cardId);

        if (!card) {
            return res.status(404).json({ error: `Card not found` });
        }

        await card.destroy();
        res.status(204).end();
    },
    async store(req, res) {
        
        const createCardSchema = Joi.object({
            content: Joi.string().min(1).required(),
            list_id: Joi.number().integer().greater(0).required(),
            position: Joi.number().integer().greater(0),
            color: hexadecimalColorSchema,
        });

        const { error } = createCardSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.message });
        }

        const { content, list_id, position, color } = req.body;

        const list = await List.findByPk(list_id);
        if (!list) {
            return res
                .status(404)
                .json({ error: 'The provided list_id does not exist' });
        }

        const createdCard = await Card.create({
            content,
            list_id,
            position, 
            color,
        });

        res.status(201).json(createdCard);
    },

    async update(req, res) {
        const cardId = parseInt(req.params.id);
        console.log(cardId);

        if (!Number.isInteger(cardId)) {
            return res.status(404).json({ error: `Card not found` });
        }

        const updateCardSchema = Joi.object({
            content: Joi.string().min(1),
            position: Joi.number().integer().greater(0),
            list_id: Joi.number().integer().greater(0),
            color: hexadecimalColorSchema,
        })
            .min(1)
            .message(
                "Missing body parameters. Provide at least 'content' or 'position' or 'list_id' or 'color' properties"
            );

        const { error } = updateCardSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.message });
        }

        const { content, position, list_id, color } = req.body;

        const card = await Card.findByPk(cardId);

        if (!card) {
            return res.status(404).json({ error: `Card not found` });
        }

        if (list_id) {
            const list = await List.findByPk(list_id);
            if (!list) {
                return res.status(404).json({ error: `List not found` });
            }
        }

        const updatedCard = await card.update({
            content,
            position,
            color,
            list_id,
        });
        res.json(updatedCard); 
    },
};

export { cardController };
