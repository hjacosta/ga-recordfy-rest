const { Sequelize } = require("sequelize");
const { db: config } = require("../config");

const sequelize = new Sequelize(config.db, config.user, config.password, {
  host: config.host,
  dialect: config.dialect,
  operatorsAliases: false,
  timezone: config.timezone,
  pool: {
    max: config.pool.max,
    min: config.pool.min,
    acquire: config.pool.acquire,
    idle: config.pool.idle,
  },
});

const db = sequelize;

async function list(table, query) {
  let res =
    await db.query(`SELECT user_id, first_name, last_name, email, phone_number, secondary_phone_number, address, 
                    status, created_by,  to_char(created_at, 'dd TMMonth FMYYYYThh24:mi') as created_at, to_char(modified_at, 'dd TMMonth FMYYYYThh24:mi') as modified_at
    FROM ${table};`);

  return res[0];
}

async function get(table, whereConditions) {
  try {
    let whereString = "";
    Object.entries(whereConditions).forEach((condition, index) => {
      if (index == 0) {
        whereString = `WHERE ${condition[0]} like '%${condition[1]}%'`;
      } else {
        if (condition[0].toLowerCase().includes("at")) {
          whereString +=
            condition[1]?.length > 0
              ? `AND ${condition[0]} = '${condition[1]}' `
              : "";
        } else {
          whereString +=
            condition[1]?.length > 0
              ? `AND lower(${condition[0]}) LIKE '${
                  condition[1].toLowerCase() + "%"
                }' `
              : "";
        }
      }

      return whereString;
    });

    let query = `SELECT ${Object.keys(whereConditions).join()}
                      FROM ${table}
                      ${whereString}`;

    let res = await db.query(query);

    return res[0];
  } catch (error) {
    console.log(error);
  }
}

async function insert(table, data) {
  // console.log(table, data);

  try {
    let queryString = `INSERT INTO ${table} (${Object.keys(data).join()})
                       VALUES(${Object.values(data)
                         .map((data) => typeof data != "boolean" && `'${data}'`)
                         .join(",")})`;

    let res = await db.query(queryString);
    console.log(res);
    return data;
  } catch (error) {
    console.log(error);
  }
}

async function update(table, data) {
  try {
    let updateFields = "";
    let fieldHistory = [];
    Object.entries(data).forEach((item, index) => {
      console.log(item[0]);

      updateFields +=
        item[1]?.toString().length > 0 && item[0] != `${table}_id`
          ? `${index != 0 && fieldHistory.length > 0 ? ", " : ""}${item[0]} = ${
              typeof item[1] == "boolean" ? item[1] : `'${item[1]}'`
            } `
          : "";

      if (item[1]?.toString().length > 0 && item[0] != `${table}_id`) {
        fieldHistory.push(item);
      }

      return updateFields;
    });

    let queryString = `UPDATE ${table} SET ${updateFields} WHERE ${table}_id = '${
      data[table + "_id"]
    }'`;

    console.log(queryString);
    await db.query(queryString);
    return data;
  } catch (error) {
    console.log(error);
  }
}

async function remove(table, id) {}

function getQueryDefaultString(table) {
  return table != "auth"
    ? `,to_char(created_at, 'dd TMMonth FMYYYYThh24:mi') as created_at, to_char(modified_at, 'dd TMMonth FMYYYYThh24:mi') as modified_at`
    : "";
}

module.exports = {
  list,
  get,
  insert,
  update,
  remove,
};
