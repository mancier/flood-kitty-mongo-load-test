const faker = require("faker");
const MongoClient = require("mongodb").MongoClient;

const KITTY_MAX_NUMBER= process.env.MAX_NUMBER || 1000

function randomIntFromInterval(min, max) { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
}
async function seedDB() {
    const uri = process.env.DB_URI;
    const client = new MongoClient(uri, {
        useNewUrlParser: true,
    });
    try {
        await client.connect();
        console.log("Connected correctly to server");
        const collection = client.db("iot").collection("kitty");
        // The drop() command destroys all data from a collection.
        // Make sure you run it against proper database and collection.
        //collection.drop();
        // make a bunch of time series data
        let timeSeriesData = [];
        for (let i = 0; i < KITTY_MAX_NUMBER; i++) {
            const firstName = faker.name.firstName();
            const lastName = faker.name.lastName();
            let newDay = {
                timestamp_day: faker.date.past(),
                cat: faker.random.word(),
                owner: {
                    email: faker.internet.email(firstName, lastName),
                    firstName,
                    lastName,
                },
                events: [],
            };
            for (let j = 0; j < randomIntFromInterval(1, 6); j++) {
                let newEvent = {
                    timestamp_event: faker.date.past(),
                    weight: randomIntFromInterval(14,16),
                }
                newDay.events.push(newEvent);
            }
            timeSeriesData.push(newDay);
        }
        collection.insertMany(timeSeriesData);
        console.log("Database seeded! :)");
        client.close();
    } catch (err) {
        console.log(err.stack);
    }
}
seedDB();