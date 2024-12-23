import { Sequelize } from "sequelize";

// connect to database
const DB = new Sequelize({
  dialect: "sqlite",
  storage: "./database.sqlite",
});

export default DB;
