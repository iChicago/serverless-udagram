import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import {HTTPHeaders} from '../../../../constants'
import { CreateGroupRequest } from 'src/requests/CreateGroupRequest';
import { createGroup } from 'src/businessLogic/groups';

const handler: ValidatedEventAPIGatewayProxyEvent<any> = async (event) => {
  console.log('Processing Event: ', event);
  
  const newGroup: CreateGroupRequest = JSON.parse(JSON.stringify(event.body));

  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]

  console.log('Creating a new group ', newGroup);
  
  const newItem = await createGroup(newGroup, jwtToken);

  return {
    statusCode: 201,
    headers: HTTPHeaders,
    body: JSON.stringify(newItem),
  }
};

export const main = middyfy(handler);
