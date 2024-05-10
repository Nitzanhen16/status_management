var express = require('express');
var router = express.Router();
const DButils = require("./utils/DButils");

/* GET home page. */
router.get('/', async (req, res, next) => {
    // res.render('index', { title: 'Express' });
    try {
        let details = await getCurrectStatus()
        res.status(200).send(details);
    } catch (error) {
        next(error);
    }
});

/**
 * This path returns the favorites recipes that were saved by the logged-in user
 */
router.post('/add_status', async (req, res, next) => {
    try {
        const status_name = req.body.name;
        if (!status_name) {
            throw {status: 422, message: "Unprocessable Entity: Name is required"};
        }
        let statuses = await DButils.execQuery(`SELECT name
                                                from statuses
                                                WHERE name = '${status_name}'`);
        if (statuses.rowCount > 0) {
            throw {status: 409, message: "status name must be unique"};
        }

        await DButils.execQuery(`INSERT INTO statuses (name)
                                 VALUES ('${status_name}')`);
        // res.status(200).send({ message: "new status created", success: true });
        let details = await getCurrectStatus()
        res.status(200).send(details);

    } catch (error) {
        next(error);
    }
});

router.post('/add_transition', async (req, res, next) => {
    try {
        const trans_name = req.body.name;
        const from_id = req.body.from_id;
        const to_id = req.body.to_id;

        if (!trans_name || !from_id || !to_id) {
            throw {status: 422, message: "Unprocessable Entity: Name is required"};
        }
        let transitions = await DButils.execQuery(`SELECT name
                                                   from transitions
                                                   WHERE name = '${trans_name}'`);
        if (transitions.rowCount > 0) {
            throw {status: 409, message: "transition name must be unique."};
        }

        await DButils.execQuery(`INSERT INTO transitions (name, from_id, to_id)
                                 VALUES ('${trans_name}', '${from_id}', '${to_id}')`);
        // res.status(200).send({ message: "new transition created", success: true });
        let details = await getCurrectStatus()
        res.status(200).send(details);

    } catch (error) {
        next(error);
    }
});

router.post('/del_status', async (req, res, next) => {
    try {
        const status_name = req.body.name;

        if (!status_name) {
            throw {status: 422, message: "Unprocessable Entity: status ID is required"};
        }
        await DButils.execQuery(`DELETE
                                 from statuses
                                 WHERE name = '${status_name}'`);
        // res.status(200).send({ message: "status deleted successfully", success: true });
        let details = await getCurrectStatus()
        res.status(200).send(details);
    } catch (error) {
        next(error);
    }
});

router.post('/del_transition', async (req, res, next) => {
    try {
        const trans_name = req.body.name;
        if (!trans_name) {
            throw {status: 422, message: "Unprocessable Entity: status ID is required"};
        }
        await DButils.execQuery(`DELETE
                                 from transitions
                                 WHERE name = '${trans_name}'`);
        // res.status(200).send({ message: "transition deleted successfully", success: true });
        let details = await getCurrectStatus()
        res.status(200).send(details);
    } catch (error) {
        next(error);
    }
});

router.post('/reset', async (req, res, next) => {
    try {
        await DButils.execQuery('DELETE from statuses');
        await DButils.execQuery('DELETE from transitions');
        res.status(200).send();
    } catch (error) {
        next(error);
    }
});

async function getCurrectStatus() {
    // Retrive all information from tables
    let statuses = await DButils.execQuery('SELECT * from statuses order by status_id');
    let transitions = await DButils.execQuery('SELECT * from transitions order by trans_id');
    status_list = statuses.rows
    transition_list = transitions.rows

    // Update [INIT] status
    const minId = Math.min(...status_list.map(obj => obj.status_id)); // Get the minimum id
    status_list.forEach(status => status.init = (status.status_id === minId));


    // Update [FINAL] statuses
    const transFromIds = transition_list.map(obj => obj.from_id);
    status_list.forEach(status => status.final = !transFromIds.includes(status.status_id))

    // Update [ORPHAN] statuses
    // Find all reachable statuses from the initial status
    const reachableStatuses = new Set([minId]); // Use a Set for efficient lookups
    // Sort transitions by from_id for efficient processing
    transition_list.sort((a, b) => a.from_id - b.from_id);
    // Loop through transitions and update reachable statuses
    for (const transition of transition_list) {
        if (reachableStatuses.has(transition.from_id)) {
            reachableStatuses.add(transition.to_id);
        }
    }
    status_list.forEach(status => status.orphan = ![...reachableStatuses].includes(status.status_id))

    // return all details
    let details = {
        "statuses": status_list, "transitions": transition_list,
    }
    return details
}

module.exports = router;
