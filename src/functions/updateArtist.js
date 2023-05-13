const { app } = require('@azure/functions');
const cosmosClient = require('@azure/cosmos').CosmosClient;
const { endpoint, key, databaseId, containerId } = require('../../config.json');

const client = new cosmosClient({ endpoint, key });
const database = client.database(databaseId);
const container = database.container(containerId);

app.http('updateArtist', {
    methods: ['PUT'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        var dataQuery = {
            query: "SELECT * FROM Artists art WHERE art.name =" + "'" + request.query.get('name') + "'"
        };

        const { resources: items } = await container.items
        .query(dataQuery)
        .fetchAll();
    
        var data = items[0];
        var id = data.id;
        
        data.name = request.query.get('newName');

        const { resource : updatedItem } = await container
            .item(id)
            .replace(data);

        var responseMessage = "Artist was udpated";
        return { body : responseMessage };
    }
});