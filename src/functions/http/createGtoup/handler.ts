import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import * as AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import {HTTPHeaders} from '../../../../constants'
import { getUserId } from 'src/auth/utils';

const docClient = new AWS.DynamoDB.DocumentClient();
const groupsTable = process.env.GROUPS_TABLE;

const createGroup: ValidatedEventAPIGatewayProxyEvent<any> = async (event) => {
  console.log('Processing Event: ', event);

  const itemId = uuidv4();

  const parsedBody = JSON.parse(JSON.stringify(event.body));

  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]
  
  const newItem = {
    id: itemId,
    userId: getUserId(jwtToken),
    ...parsedBody,
  }

  await docClient.put({
    TableName: groupsTable,
    Item: newItem,
  }).promise();
  
  return {
    statusCode: 201,
    headers: HTTPHeaders,
    body: JSON.stringify(newItem),
  }
};

export const main = middyfy(createGroup);
