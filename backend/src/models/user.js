const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const bcrypt = require("bcrypt");

const User = sequelize.define(
    "User",
    {
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "N/A",
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "N/A",
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        role: {
            type: DataTypes.ENUM("user", "admin"),
            defaultValue: "user", // كل مستخدم جديد بشكل افتراضي user
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: true
        },

        isBlocked: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },

        blockedUntil: {
            type: DataTypes.DATE,
            allowNull: true
        },
    },
    {
        timestamps: true,
    }
);
User.beforeCreate(async (user) => {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

});
User.beforeUpdate(async (user) => {
    if (user.changed("password")) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
    }
});
User.prototype.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);

};
module.exports = User;