const { PutObjectCommand, GetObjectCommand, DeleteObjectsCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { S3Client } = require("@aws-sdk/client-s3");

const s3Client = new S3Client({ 
  region: process.env.S3_REGION, 
  credentials: { accessKeyId: process.env.S3_KEY_LOCAL, secretAccessKey: process.env.S3_PASSWORD_LOCAL }
});

async function UploadS3File(base64, tipo, nomeArquivo) {
  try {

    console.log("UploadS3File");

    const nomeBucket = process.env.S3_BUCKET;

    const params = {
      Bucket: nomeBucket,
      Key: nomeArquivo,
      Body: base64,
      ContentEncoding: 'base64',
      ContentType: tipo
    };
    
    const results = await s3Client.send(new PutObjectCommand(params));

    console.log("Successfully created " + params.Key + " and uploaded it to " + params.Bucket + "/" + params.Key);
    return results;
  } catch (err) {
    throw new Error(err.message);
  }
};

async function GetUrl(nomeArquivo) {
  try {
    const command = new GetObjectCommand({Bucket: process.env.S3_BUCKET, Key: nomeArquivo });
    const url = await getSignedUrl(s3Client, command, { expiresIn: 15 * 60 }); // expires in seconds
    return url;
  } catch (err) {
    throw new Error(err.message);
  }
}

async function RemoverS3(nomeArquivo) {
  try {
    const param = { 
      Bucket: process.env.S3_BUCKET, 
      Key: nomeArquivo 
    };

    const response = await s3Client.deleteObjects(param);

    await s3Client.deleteObject(param, function(err, data) {
      if (err)    console.log(err,err.stack);
      else        console.log("Response:",data);
    }).promise();

    console.log(response)
    return response;

  } catch (err) {
    throw new Error(err.message);
  }
}

module.exports = { UploadS3File, GetUrl, RemoverS3 }