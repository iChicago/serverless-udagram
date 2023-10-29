import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import cors from '@middy/http-cors'


import { getAllGroups } from 'src/businessLogic/groups';
//import {HTTPHeaders} from '../../../../constants'

const getGroups: ValidatedEventAPIGatewayProxyEvent<any> = async (event) => {
  console.log('Processing Event: ', event);

  const items = await getAllGroups();
  
  return {
    statusCode: 200,
    // we will use middleware to apply the headers
    //headers: HTTPHeaders,
    body: JSON.stringify(items)
  }
};

export const main = middyfy(getGroups).use(cors({credentials: true}));
