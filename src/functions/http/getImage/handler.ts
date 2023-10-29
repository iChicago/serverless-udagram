import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import * as AWS from 'aws-sdk';
import {HTTPHeaders} from '../../../../constants'

import * as AWSXRay from 'aws-xray-sdk'

const XAWS = AWSXRay.captureAWS(AWS)

const docClient = new XAWS.DynamoDB.DocumentClient();

const imagesTable = process.env.IMAGES_TABLE;
const imageIdIndex = process.env.IMAGE_ID_INDEX;

const getGroups: ValidatedEventAPIGatewayProxyEvent<any> = async (event) => {
  console.log('Processing Event: ', event);

  const imageId = event.pathParameters.imageId;

  const result = await docClient.query({
    TableName: imagesTable,
    IndexName: imageIdIndex,
    KeyConditionExpression: 'imageId = :imageId',
    ExpressionAttributeValues: {
      ':imageId': imageId,
    },
    ScanIndexForward: false,
  }).promise();

  console.log('Query image finished with result ', result);

  if(result.Count !==0){
    return {
      statusCode: 200,
      headers: HTTPHeaders,
      body: JSON.stringify(result.Items[0])
    }
  }

  return {
    statusCode: 404,
    headers: HTTPHeaders,
    body: ''
  }
};

export const main = middyfy(getGroups);