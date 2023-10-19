// secret_9KE7AhwZ8ZGhoZL4hMYTzFXtkxb2l4OmHlhjc92zths

const { Client } = require('@notionhq/client')
const fs = require('fs');
require('dotenv')

async function getNotionData()  {
    const notion = new Client({
        auth: process.env.AUTH,
    });

    const results = await notion.databases.query({
        database_id: process.env.DATABASE_ID
    });

    fs.writeFileSync('data.json', JSON.stringify(results, null, 2));
}

getNotionData()
