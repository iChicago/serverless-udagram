import { S3Handler, S3Event } from "aws-lambda";
import { middyfy } from '@libs/lambda';


const sendUploadNotifications: S3Handler = async (event: S3Event) => {
  event.Records.map((record) => console.log(record.s3.object.key));
}

export const main = middyfy(sendUploadNotifications);
