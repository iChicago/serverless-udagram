import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
const XAWS = AWSXRay.captureAWS(AWS)

const docClient = new XAWS.DynamoDB.DocumentClient()

const connectionsTable = process.env.CONNECTIONS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    console.log('Websocket disconnect', event)

    const connectionId = event.requestContext.connectionId
    const key = {
        id: connectionId
    }

    console.log('Removing item with key: ', key)

    await docClient.delete({
      TableName: connectionsTable,
      Key: key
    }).promise()

    return {
      "statusCode": 200,
      "body": 'Disconnected, See you ...'
    }
  } catch (error) {
    console.log(error);
  }
}


export const main = handler;
