const { app } = require('@azure/functions');
const cosmosClient = require('@azure/cosmos').CosmosClient;
const { endpoint, key, databaseId, containerId } = require('../../config.json');

const client = new cosmosClient({ endpoint, key });
const database = client.database(databaseId);
const container = database.container(containerId);

app.http('createArtist', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        const body = await request.json();
        
        var artist = {
            "name": body.name,
            "nationality": body.nationality,
            "founded": body.founded
        };

        const { resource : createdItem } = await container.items.create(artist);
        const responseMessage = "Artist was enrolled";

        return { body: `${responseMessage}: ${artist.name}` };
    }
});
