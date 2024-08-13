import { Model, DataTypes } from 'sequelize';
import { getConnexion } from '../db/sequelizeClient.js';

class Tag extends Model {}

Tag.init(
    {
        name: {
            type: DataTypes.TEXT,
            allowNull: false,
            unique: true,
        },

        color: {
            type: DataTypes.TEXT,
            allowNull: false,
            defaultValue: '#FFFFFF',
        },
    },
    {
        sequelize: getConnexion(),
        tableName: 'tag',
    }
);

export { Tag };
