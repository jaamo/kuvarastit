const Sequelize = require("sequelize");

class Db {
  sequelize: any = null;
  user: any = null;
  constructor() {
    this.sequelize = new Sequelize(
      "postgres://postgres:kuvarastit@127.0.0.1:5432/postgres"
    );

    this.user = this.sequelize.define(
      "user",
      {
        email: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true
        },
        password: {
          type: Sequelize.STRING,
          allowNull: false
        },
        token: {
          type: Sequelize.STRING,
          allowNull: true,
          unique: true
        }
      },
      {
        // options
      }
    );
  }
}

module.exports = Db;
