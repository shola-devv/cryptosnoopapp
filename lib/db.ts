import mongoose from "mongoose"

const MONGO_URI = process.env.MONGO_URI

const connect = async () => {
   const connectionState = mongoose.connection.readyState;

   if (connectionState === 1) {
    console.log("already connected")
    return;
   }
     
 if (connectionState === 2) {
    console.log("connecting...")
    return;
   }

   try {
    mongoose.connect(MONGO_URI!, {
        dbName: "cryptosnoop",
        bufferCommands : true 
    });
    console.log("connected");
   } catch(err: any) {
     console.log("Error:", err)
    throw new Error("Error: ", err);
    }
};

export default connect