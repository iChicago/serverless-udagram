import { ResourceTypes, BillingMode } from '../../constants';

export const DynamoDBTableWebsokcetConnectinos = {
  Type: ResourceTypes.AWS_DynamoDB_Table,
  Properties: {
    TableName: "${self:provider.environment.CONNECTIONS_TABLE}",
    AttributeDefinitions: [
      {
        AttributeName: 'id',
        AttributeType: 'S',
      },
    ],
    KeySchema: [
      {
        AttributeName: 'id',
        KeyType: 'HASH',
      },
    ],
    BillingMode: BillingMode.PAY_PER_REQUEST
  },
};