import { S3Handler, S3Event } from "aws-lambda";


const sendUploadNotifications: S3Handler = async (event: S3Event) => {
  console.log('Processing sendUploadNotifications ..........');
  
  event.Records.map((record) => console.log(record.s3.object.key));
}

export const main = sendUploadNotifications;