require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID;
const assert = require("assert");
const mongoDBConnectionString = `mongodb+srv://${process.env.mongoDBUsername}:${process.env.mongoDBPassword}@cluster0-cthkj.mongodb.net/${process.env.db}?retryWrites=true&w=majority`;
var client = new MongoClient(mongoDBConnectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//GENERAL
(async () => {
  try {
    await client.connect((err) => {
      if (err) throw err;
      if (client.isConnected()) {
        console.log("Connection established to DB");
      } else {
        throw new Error("Connection not established to DB");
      }
    });
  } catch (err) {
    console.log("Connection not established to DB");
    // console.log(err);
  }
})();

function testServer(req, res) {
  try {
    res.status(200).send("Server is running...");
  } catch (err) {
    console.log("Error");
    res.status(500).send(err);
  }
}

function endPointNotFound(req, res) {
  try {
    res.status(404).send("Endpoint not found");
  } catch (err) {
    console.log("Error");
    res.status(500).send(err);
  }
}

async function addDataToDB(req, res) {
  try {
    let new_data = req.body;
    let db = req.query.db;
    assert(new_data !== undefined, "Invalid data sent");
    assert(
      db !== undefined,
      "Database name should be included in query string"
    );
    if (db === "biography") {
      assert(new_data.data !== undefined, "Property data should be included");
      assert(new_data.date !== undefined, "Property date should be included");
      assert(
        new_data.is_active !== undefined,
        "Property is_active should be included"
      );
    } else if (db === "experience") {
      assert(
        new_data.jobTitle !== undefined,
        "Property jobTitle should be included"
      );
      assert(
        new_data.companyName !== undefined,
        "Property companyName should be included"
      );
      assert(
        new_data.dateFrom !== undefined,
        "Property dateFrom should be included"
      );
      assert(
        new_data.dateTo !== undefined,
        "Property dateTo should be included"
      );
      assert(
        new_data.isCoop !== undefined,
        "Property isCoop should be included"
      );
      assert(
        new_data.descriptions !== undefined,
        "Property descriptions should be included"
      );
      assert(
        new_data.isWork !== undefined,
        "Property isWork should be included"
      );
      assert(
        new_data.isVolunteer !== undefined,
        "Property isVolunteer should be included"
      );
      assert(
        new_data.isActive !== undefined,
        "Property isActive should be included"
      );
    }

    if (client.isConnected()) {
      await client
        .db(process.env.db)
        .collection(db)
        .insertOne(new_data, (err, result) => {
          if (err) throw err;
          res.status(201).send(result.insertedId);
        });
    } else {
      throw new Error("Database Connection failed");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
}

async function removeDataFromDB(req, res) {
  try {
    let id = req.body._id;
    let db = req.query.db;
    assert(id !== undefined, "Invalid data sent");
    assert(
      db !== undefined,
      "Database name should be included in query string"
    );
    if (client.isConnected()) {
      await client
        .db(process.env.db)
        .collection(db)
        .deleteOne({ _id: new ObjectID(id) }, (err, result) => {
          if (err) throw err;
          res.status(200).send(result);
        });
    } else {
      throw new Error("Database Connection failed");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
}

async function getDataFromDBHelper(db, condition, callback) {
  if (client.isConnected()) {
    let param = condition !== undefined ? condition : {};
    await client
      .db(process.env.db)
      .collection(db)
      .find(param)
      .toArray((err, result) => {
        callback(err, result);
      });
  } else {
    callback(new Error("Database connection failed"), undefined);
  }
}

async function getDataFromDB(req, res) {
  try {
    let db = req.query.db;
    let condition = req.body;
    await getDataFromDBHelper(db, condition, (err, result) => {
      if (err) throw err;
      res.status(200).send(result);
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
}

async function updateDataInDBHelper(db, value, callback) {
  if (client.isConnected()) {
    let id = value._id;
    delete value._id;
    await client
      .db(process.env.db)
      .collection(db)
      .updateOne(
        { _id: new ObjectID(id) },
        { $set: value },
        { upsert: true },
        (err, result) => {
          callback(err, result);
        }
      );
  } else {
    callback(new Error("Database Connection failed"), undefined);
  }
}

async function updateDataInDB(req, res) {
  try {
    let value = req.body;
    let db = req.query.db;
    assert(value !== undefined, "Invalid data sent");
    assert(
      db !== undefined,
      "Database name should be included in query string"
    );
    assert(value._id !== undefined, "Property id should be included");

    if (db === "biography") {
      assert(value.data !== undefined, "Property data should be included");
    } else if (db === "experience") {
      assert(
        value.jobTitle !== undefined ||
          value.companyName !== undefined ||
          value.dateFrom !== undefined ||
          value.dateTo !== undefined ||
          value.location !== undefined ||
          value.descriptions !== undefined ||
          value.isCoop !== undefined ||
          value.isWork !== undefined ||
          value.isVolunteer !== undefined ||
          value.isActive !== undefined,
        "no data to be updated sent"
      );
    }

    await updateDataInDBHelper(db, value, (err, result) => {
      if (err) throw err;
      res.status(200).send(result);
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
}

//BIOGRAPHY
async function setBiographyActive(req, res) {
  try {
    let bio = req.body;
    bio.is_active = true;
    assert(bio !== undefined, "Invalid data sent");
    assert(bio._id !== undefined, "Property id should be included");
    if (client.isConnected()) {
      await getDataFromDBHelper(
        "biography",
        { is_active: true },
        async (err, value) => {
          if (err) throw err;
          let old_active_bio;
          if (value.length !== 0) {
            old_active_bio = value[0];
            old_active_bio.is_active = false;
          }
          await updateDataInDBHelper("biography", bio, async (err, val) => {
            if (err) throw err;
            if (val && value.length !== 0) {
              await updateDataInDBHelper(
                "biography",
                old_active_bio,
                async (err, value) => {
                  if (err) throw err;
                  res.status(200).send(value);
                }
              );
            } else {
              res.status(200).send(val);
            }
          });
        }
      );
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
}

module.exports = {
  testServer,
  endPointNotFound,
  addDataToDB,
  removeDataFromDB,
  getDataFromDB,
  updateDataInDB,
  setBiographyActive,
};
