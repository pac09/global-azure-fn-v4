const { app } = require('@azure/functions');
const cosmosClient = require('@azure/cosmos').CosmosClient;
const { endpoint, key, databaseId, containerId } = require('../../config.json');

const client = new cosmosClient({ endpoint, key });
const database = client.database(databaseId);
const container = database.container(containerId);

app.http('getArtist', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        var dataQuery = {
            query: "SELECT * FROM Artists art WHERE art.name =" + "'" + request.query.get('name') + "'"
        };
        
        const { resources: items } = await container.items
            .query(dataQuery)
            .fetchAll();
        
        var data = items[0];
        var jsonData = {
            "id": data.id,
            "name": data.name,
            "nationality": data.nationality,
            "founded": data.founded
        };

        return {
            status: 200,
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify(jsonData)
        };
    }
});