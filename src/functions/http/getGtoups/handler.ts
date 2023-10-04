import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import * as AWS from 'aws-sdk';
import {HTTPHeaders} from '../../../../constants'

const docClient = new AWS.DynamoDB.DocumentClient();

const groupsTable = process.env.GROUPS_TABLE;

const getGroups: ValidatedEventAPIGatewayProxyEvent<any> = async (event) => {
  console.log('Processing Event: ', event);

  const result = await docClient.scan({
    TableName: groupsTable
  }).promise();

  const items = result.Items;
  
  return {
    statusCode: 200,
    headers: HTTPHeaders,
    body: JSON.stringify(items)
  }
};

export const main = middyfy(getGroups);
