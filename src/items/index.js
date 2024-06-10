const { logger } = require("firebase-functions");
const { ItemsService } = require("../services/items.service");

exports.addItem = async (req, res) => {
    logger.log("Creating item in database");

    const { name } = req.body;
    
    // Test if name is empty or if it contains harmfull characters
    if(!name || !name.trim() || /['"%;()&+]/.test(name)) {
        logger.error("Invalid body, name should be valid");
        return res.sendStatus(400);
    }

    const itemsService = new ItemsService();
    logger.log("Creating item with name", name);
    let createdItem = null;
    try {
        createdItem = await itemsService.createItem({ name: name, increment_id: 0 });
    } catch (error) {
        logger.error("There was an error creating the item", error);
        return res.sendStatus(500);
    }

    logger.log("Item created successfully", createdItem.id);
    return res.json({ result: `Item with ID: ${createdItem.id} added.` });
};

exports.incrementItem = async (event) => {
    logger.log("Setting increment_id", event.params.documentId);

    const itemsRef = event.data.ref;

    const itemsService = new ItemsService();
    let lastIncrement = 0;
    try {
        lastIncrement = await itemsService.getLastIncrementId();
    } catch (error) {
        logger.error("There was an error finding the last increment_id", event.params.documentId, error);
        throw new HttpsError(500, "Database error");
    }

    const newIncrement = lastIncrement + 1;
    try {
        await itemsService.updateIncrementId(itemsRef, newIncrement);
    } catch (error) {
        logger.error("There was an error setting the item increment_id", event.params.documentId, error);
        throw new HttpsError(500, "Database error");
    }

    logger.log("New increment_id was set successfully", event.params.documentId, newIncrement);
};
