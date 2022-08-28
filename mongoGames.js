
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://ronik:fun123fun777@cluster0.igxouv6.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
    const collection = client.db("test").collection("items");
    // perform actions on the collection object
    collection.find({}).toArray(function(err, result) {
        if (err) throw err;
        console.log(result);
        client.close();
      });
    //client.close(); 
});
