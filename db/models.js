import { BOOLEAN, DataTypes } from "sequelize";
import DB from "./index.js";

export const User = DB.define("user", {
  forename: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  surname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

await DB.sync();
console.log("database synchronized");
export default DB;
