import { ResourceTypes, BillingMode } from '../../constants';

export const DynamoDBTableGroup = {
  Type: ResourceTypes.AWS_DynamoDB_Table,
  Properties: {
    TableName: "${self:provider.environment.GROUPS_TABLE}",
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