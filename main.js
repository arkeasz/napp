// secret_9KE7AhwZ8ZGhoZL4hMYTzFXtkxb2l4OmHlhjc92zths
const dotenv = require('dotenv');
const { Client } = require('@notionhq/client');
dotenv.config();

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const databaseId = process.env.NOTION_DATABASE_ID;

async function addToDatabase(databaseId, task, type_name, importance, category, timebolck, date) {
    try {
        const response = await notion.pages.create({
            parent: {
                database_id: databaseId,
            },
            properties: {
                'Name': {
                    type: 'title',
                    title: [
                    {
                        type: 'text',
                        text: {
                            content: task,
                        },
                    },
                    ],
                },
                'Type': {
                    type: 'select',
                    select: {
                        name: type_name
                    }
                },
                'Category': {
                    type: 'select',
                    select: {
                        name: category
                    }
                },
                'Timeblock': {
                    type: 'select',
                    select: {
                        name: timebolck
                    }
                },
                'Importance': {
                    type: 'select',
                    select: {
                        name: importance
                    }
                },
                "Status":   {
                    type: 'checkbox',
                    checkbox: false
                },
                'Do Date': {
                    type: 'date',
                    date: date
                },
            }
        });
        console.log(response);
    } catch (error) {
        console.error(error.body);
    }
}

async function queryDatabase(databaseId, task) {
    try {
        const response = await notion.databases.query({
            database_id: databaseId,
            "filter": {
                "property": "Name",
                "rich_text": {
                    "contains": task
                },
            }
          });

        return response.results[0].id;
    } catch (error){
        console.log(error.body);
    }
}

function updateItem(databaseId, task, status, inputDate) {
    queryDatabase(databaseId, task)
        .then(async pageId => {
            try {
                const response = await notion.pages.update({
                    page_id: pageId,
                    properties: {
                        'Name': {
                            type: 'title',
                            title: [
                            {
                                type: 'text',
                                text: {
                                    content: task,
                                },
                            },
                            ],
                        },
                        'Status': {
                            checkbox: status,
                        },
                        'Do Date': {
                            type: 'date',
                            date: {
                                "start": inputDate
                            }
                        },
                    },
                    });
                console.log(response);
            } catch (error) {
                console.log(error.body);
            }
        });
}

function deleteItem(databaseId, task) {
    try {
        queryDatabase(databaseId, task)
            .then(async pageId => {
                const response = await notion.blocks.delete({
                    block_id: pageId,
                });
                console.log(response);

            })
    } catch (error) {
        console.log(error.body);
    }
}

// deleteItem(databaseId, 'pintar Salon');
// addToDatabase(databaseId, 'Pintar Salon', 'Inbox', "Moderate", 'Event', 'Before Launch',null);
updateItem(databaseId, 'Pintar Salon', true, "2023-10-25");
