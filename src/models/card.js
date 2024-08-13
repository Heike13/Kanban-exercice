import { Model, DataTypes } from 'sequelize';
import { getConnexion } from '../db/sequelizeClient.js';

class Card extends Model {}

Card.init(
    {
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },

        position: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
        },
        color: {
            type: DataTypes.TEXT,
            allowNull: false,
            defaultValue: '#FFFFFF',
        },
        list_id: {
            type: DataTypes.INTEGER,
        },
    },
    {
        sequelize: getConnexion(),
        tableName: 'card',
    }
);

export { Card };
