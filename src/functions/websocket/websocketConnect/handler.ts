import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
const XAWS = AWSXRay.captureAWS(AWS)

const docClient = new XAWS.DynamoDB.DocumentClient()

const connectionsTable = process.env.CONNECTIONS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    console.log('Websocket connect', event)

    const connectionId = event.requestContext.connectionId
    const timestamp = new Date().toISOString()

    const item = {
      id: connectionId,
      timestamp
    }

    console.log('Storing item: ', item)

    await docClient.put({
      TableName: connectionsTable,
      Item: item
    }).promise()

    return {
      "statusCode": 200,
      "body": 'Connected, Welcome ...'
    }
  } catch (error) {
    console.log(error);
  }
}

export const main = handler;
