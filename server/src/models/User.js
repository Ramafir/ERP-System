const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = sequelize => {
    let User = {};

    if (sequelize) {
        User = sequelize.define(
            'User',
            {
                id: {
                    primaryKey: true,
                    type: DataTypes.UUID,
                    defaultValue: DataTypes.UUIDV4
                },
                firstName: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                lastName: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                fullName: {
                    type: DataTypes.VIRTUAL,
                    get() {
                        return `${this.firstName} ${this.lastName}`;
                    }
                },
                birthDate: {
                    type: DataTypes.DATEONLY,
                    allowNull: false
                },
                email: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    unique: {
                        args: true,
                        msg: 'already in use',
                        fields: [sequelize.fn('lower', sequelize.col('email'))]
                    }
                },
                password: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                passwordResetToken: {
                    type: DataTypes.STRING,
                    allowNull: true,
                    defaultValue: null
                },
                passwordResetTokenExpiresAt: {
                    type: DataTypes.DATE,
                    allowNull: true,
                    defaultValue: null
                },
                vacationDaysTotal: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    defaultValue: 0
                },
                vacationDaysTaken: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    defaultValue: 0
                }
            },
            {
                paranoid: true,
                timestamps: true,
                defaultScope: {
                    attributes: {
                        exclude: [
                            'password',
                            'passwordResetTokenExpiresAt',
                            'passwordResetToken'
                        ]
                    }
                },
                hooks: {
                    beforeSave: (user, options) => {
                        if (options.fields.includes('password')) {
                            user.password = bcrypt.hashSync(user.password, 8);
                        }
                    }
                },
                scopes: {}
            }
        );

        User.associate = ({ Contract, Vacation, Role }) => {
            User.hasMany(Contract, {
                as: 'contracts',
                foreignKey: 'userId',
                sourceKey: 'id',
                onDelete: 'cascade'
            });

            User.hasMany(Vacation, {
                as: 'vacations',
                foreignKey: 'userId',
                sourceKey: 'id',
                onDelete: 'cascade'
            });

            User.belongsToMany(Role, {
                as: 'roles',
                through: 'User2Role',
                foreignKey: 'userId',
                otherKey: 'roleId',
                onDelete: 'cascade'
            });
        };

        User.prototype.isAdmin = async function () {
            const roles = await this.getRoles();

            return roles.some(role => role.name.toLowerCase() === 'admin');
        };
    }

    return User;
};
