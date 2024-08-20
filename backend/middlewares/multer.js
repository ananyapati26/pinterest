import multer from "multer";

const storage = multer.memoryStorage()



const uploadFile = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, 
    
}).single("file");

// const uploadFile = multer({ storage }).single("file");

export default uploadFile;