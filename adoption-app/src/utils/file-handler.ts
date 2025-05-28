import * as fs from "fs";

const uploadDir = './public/uploads';

const uploadImage = async (image: File) => {
    const buffer = Buffer.from(await image.arrayBuffer());

    try {
        await fs.writeFile(`${uploadDir}/${image.name}`, buffer, (err) => {
            console.log(err);
        });
    } catch(error) {
        console.log(error);
    }

}

export default uploadImage;