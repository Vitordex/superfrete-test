const { logger } = require("firebase-functions");
const { onRequest } = require("firebase-functions/v2/https");
const { onDocumentCreated } = require("firebase-functions/v2/firestore");

const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

initializeApp();

exports.addItem = onRequest(async (req, res) => {
    const { name } = req.body;

    logger.log("Creating item with name", name);
    const writeResult = await getFirestore()
        .collection("items")
        .add({ name: name, increment_id: 0 });
    res.json({ result: `Item with ID: ${writeResult.id} added.` });
});

exports.incrementItem = onDocumentCreated("/items/{documentId}", async (event) => {
    const itemsRef = event.data.ref;

    const response = await getFirestore()
        .collection("items")
        .orderBy('increment_id', 'desc')
        .limit(1)
        .get();
    const lastItem = response.docs.length === 0 ? {} : response.docs[0].data();
    const lastIncrement = lastItem?.increment_id ?? 0;

    logger.log("Setting increment_id", event.params.documentId, lastIncrement);

    return itemsRef.set({ increment_id: lastIncrement + 1 }, { merge: true });
});