const { addItem, incrementItem } = require("../../src/items");
const { ItemsService } = require("../../src/services/items.service");

jest.mock('firebase-functions', () => ({
    logger: {
        log: console.log,
        error: console.log
    }
}));


jest.mock("../../src/services/items.service");

describe("addItem", () => {
    it("should return 400 if name is invalid", async () => {
        const req = { body: { name: "invalid'name" } };
        const res = { sendStatus: jest.fn() };

        await addItem(req, res);

        expect(res.sendStatus).toHaveBeenCalledWith(400);
    });

    it("should return 500 if there is an error creating the item", async () => {
        const req = { body: { name: "validName" } };
        const res = { sendStatus: jest.fn(), json: jest.fn() };
        ItemsService.prototype.createItem = jest.fn().mockRejectedValue(new Error());

        await addItem(req, res);

        expect(res.sendStatus).toHaveBeenCalledWith(500);
    });

    it("should return 200 and the created item if successful", async () => {
        const req = { body: { name: "validName" } };
        const res = { sendStatus: jest.fn(), json: jest.fn() };
        const createdItem = { id: "123", name: "validName", increment_id: 0 };
        ItemsService.prototype.createItem = jest.fn().mockResolvedValue(createdItem);

        await addItem(req, res);

        expect(res.json).toHaveBeenCalledWith({ result: `Item with ID: ${createdItem.id} added.` });
    });
});

describe("incrementItem", () => {
    it("should throw an error if there is an error getting the last increment_id", async () => {
        const event = { data: { ref: {} }, params: { documentId: "123" } };
        ItemsService.prototype.getLastIncrementId = jest.fn().mockRejectedValue(new Error());

        await expect(incrementItem(event)).rejects.toThrow();
    });

    it("should throw an error if there is an error updating the increment_id", async () => {
        const event = { data: { ref: {} }, params: { documentId: "123" } };
        ItemsService.prototype.getLastIncrementId = jest.fn().mockResolvedValue(0);
        ItemsService.prototype.updateIncrementId = jest.fn().mockRejectedValue(new Error());

        await expect(incrementItem(event)).rejects.toThrow();
    });

    it("should not throw an error if successful", async () => {
        const event = { data: { ref: {} }, params: { documentId: "123" } };
        ItemsService.prototype.getLastIncrementId = jest.fn().mockResolvedValue(0);
        ItemsService.prototype.updateIncrementId = jest.fn().mockResolvedValue();

        await expect(incrementItem(event)).resolves.not.toThrow();
    });
});
