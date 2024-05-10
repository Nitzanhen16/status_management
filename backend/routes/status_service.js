var express = require('express');
var router = express.Router();
const DButils = require("./utils/DButils");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/**
 * This path returns the favorites recipes that were saved by the logged-in user
 */
router.post('/add_status', async (req,res,next) => {
  try{
    const status_name = req.body.name;
    if (!status_name) {
      throw { status: 422, message: "Unprocessable Entity: Name is required" };
    }
    let statuses = [];
    statuses = await DButils.execQuery(`SELECT name from statuses WHERE name = '${status_name}'`);
    console.log(statuses)
    if (statuses.rowCount > 0) {
      throw {status: 409, message: "status already exists"};
    }

    result = await DButils.execQuery(
        `INSERT INTO statuses (name) VALUES ('${status_name}')`
    );
    console.log(result)
    res.status(200).send({ message: "new status created", success: true });

  } catch(error){
    next(error);
  }
});

module.exports = router;
