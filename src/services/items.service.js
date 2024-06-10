const { getFirestore, DocumentReference } = require("firebase-admin/firestore");
const { Item } = require("../models/item");

class ItemsService {
    /**
     * Creates a new item
     * @param {Item} item The item to create
     * @returns {Promise<Item>}
     */
    createItem(item) {
        return getFirestore().collection("items").add(item);
    }

    /**
     * Updates the increment_id to the latest index
     * @param {DocumentReference} itemRef 
     * @param {number} incrementId 
     * @returns {Promise<void>}
     */
    updateIncrementId(itemRef, incrementId) {
        return itemRef.set({ increment_id: incrementId }, { merge: true })
    }

    /**
     * Retrieves the last increment_id stored in the database
     * @returns {Promise<number>}
     */
    async getLastIncrementId() {
        const response = await getFirestore()
            .collection("items")
            .orderBy('increment_id', 'desc')
            .limit(1)
            .get();

        if (response.docs.length === 0) return 0;
        return response.docs[0].data().increment_id;
    }
}

module.exports = {
    ItemsService
};
