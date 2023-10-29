import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import * as AWS from 'aws-sdk';
import {HTTPHeaders} from '../../../../constants';
import { v4 as uuidv4 } from 'uuid';

import * as AWSXRay from 'aws-xray-sdk'

const XAWS = AWSXRay.captureAWS(AWS)

const docClient = new XAWS.DynamoDB.DocumentClient();

const s3 = new XAWS.S3({
  signatureVersion: 'v4',
})

const groupsTable = process.env.GROUPS_TABLE;
const imagesTable = process.env.IMAGES_TABLE;
const bucketName = process.env.IMAGES_S3_BUCKET;
const urlExpiration = process.env.SIGNED_URL_EXPIRATION;
const urlExpirationAsNumber = parseInt(urlExpiration, 10);

const createImage: ValidatedEventAPIGatewayProxyEvent<any> = async (event) => {
  console.log('Processing Event: ', event);

  const groupId = event.pathParameters.groupId;
  const validGroupId = await groupExists(groupId);

  if(!validGroupId){
    return {
      statusCode: 404,
      headers: HTTPHeaders,
      body: JSON.stringify({
        error: "Group does not exist"
      })
    }
  }

  // create image
  const imageId = uuidv4();
  const newItem = await putImageToDatabase(groupId, imageId, event);

  const url = getUploadUrl(imageId);
  
  return {
    statusCode: 201,
    headers: HTTPHeaders,
    body: JSON.stringify({
      newItem: newItem,
      uploadUrl: url,
    })
  }
};

async function groupExists(groupId: string) {
  const result = await docClient.get({
    TableName: groupsTable,
    Key: {
      id: groupId,
    }
  }).promise();

  console.log('Get group: ', result);
  return !!result.Item;
  
}

async function putImageToDatabase(groupId: string, imageId: string, event) {
  const timestamp = new Date().toISOString();
  const newImage = JSON.parse(JSON.stringify(event.body));

  const newItem = {
    groupId,
    timestamp,
    imageId,
    ...newImage,
    imageUrl: `https://${bucketName}.s3.amazonaws.com/${imageId}`,
  }

  console.log('Storing new item: ', newItem);
  
  await docClient.put({
    TableName: imagesTable,
    Item: newItem,
  }).promise();

  return newItem;
}

function getUploadUrl(imageId: string) {
  console.log('Getting upload url');
  return s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: imageId,
    Expires: urlExpirationAsNumber,
  });
}

export const main = middyfy(createImage);
