import { DynamoDBStreamEvent, DynamoDBStreamHandler } from 'aws-lambda';
import { Client } from '@elastic/elasticsearch';

export const handler: DynamoDBStreamHandler = async (event: DynamoDBStreamEvent) => {
  try {
    const esHost = 'https://' + process.env.ES_ENDPOINT;
    console.log('ES host is ', esHost);


    /**
     * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
     * This one need to be fixed, I'm getting error 
     * 
     * {"Message": "User: anonymous is not authorized to perform: es:ESHttpPut because no resource-based 
     * policy allows the es:ESHttpPut action"}
     * 
     * https://stackoverflow.com/questions/47927278/user-anonymous-is-not-authorized-to-perform-eseshttppost-on-resource
     */
    const es = new Client({
      node: esHost,
    });

    console.log('Processing events batch from DynamoDB', JSON.stringify(event));

    for (const record of event.Records) {
      console.log('Processing record', JSON.stringify(record));
      //todo: do for other actions like update, delete to keep es up to date.
      if (record.eventName !== 'INSERT') {
        continue;
      }

      const newItem = record.dynamodb.NewImage;

      const imageId = newItem.imageId.S;

      const document = {
        imageId: newItem.imageId.S,
        groupId: newItem.groupId.S,
        imageUrl: newItem.imageUrl.S,
        title: newItem.title.S,
        timestamp: newItem.timestamp.S
      };

      /**
       * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
       * This one need to be fixed, I'm getting error 
       * 
       * {"Message": "User: anonymous is not authorized to perform: es:ESHttpPut because no resource-based 
       * policy allows the es:ESHttpPut action"}
       * 
       * https://stackoverflow.com/questions/47927278/user-anonymous-is-not-authorized-to-perform-eseshttppost-on-resource
       */
      await es.index({
        index: 'images-index',
        id: imageId,
        document
      });
    }
  } catch (error) {
    console.log(error);
  }
}

export const main = handler;
