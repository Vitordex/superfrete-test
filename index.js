const { addItem, incrementItem } = require("./src/items");

const { initializeApp } = require("firebase-admin/app");

initializeApp();

module.exports = {
    addItem: onRequest(addItem),
    incrementItem: onDocumentCreated("/items/{documentId}", incrementItem)
}
