import ImageKit, { toFile } from '@imagekit/nodejs';

const client = new ImageKit({
    publicKey: process.env['IMAGEKIT_PUBLIC_KEY'],
    privateKey: process.env['IMAGEKIT_PRIVATE_KEY'],
    urlEndpoint: process.env['IMAGEKIT_URL_ENDPOINT'],
});

export async function uploadFile(file, fileName){
    const result = await client.files.upload({
        file: await toFile(file, fileName),
        fileName: fileName,
    })

    return result;
}

