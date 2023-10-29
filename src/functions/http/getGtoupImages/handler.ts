import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import * as AWS from 'aws-sdk';
import {HTTPHeaders} from '../../../../constants'
import * as AWSXRay from 'aws-xray-sdk'

const XAWS = AWSXRay.captureAWS(AWS)

const docClient = new XAWS.DynamoDB.DocumentClient();

const groupsTable = process.env.GROUPS_TABLE;
const imagesTable = process.env.IMAGES_TABLE;

const getGroups: ValidatedEventAPIGatewayProxyEvent<any> = async (event) => {
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

  const images = await getImagesPerGroup(groupId);
  
  return {
    statusCode: 200,
    headers: HTTPHeaders,
    body: JSON.stringify(images)
  }
};

export const main = middyfy(getGroups);


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

async function getImagesPerGroup(groupId: string) {
  const result = await docClient.query({
    TableName: imagesTable,
    KeyConditionExpression: 'groupId = :groupId',
    ExpressionAttributeValues: {
      ':groupId': groupId,
    },
    ScanIndexForward: false,
  }).promise();

  return result.Items;
}

