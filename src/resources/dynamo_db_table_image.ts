import { ResourceTypes, BillingMode } from '../../constants';

export const DynamoDBTableImage = {
  Type: ResourceTypes.AWS_DynamoDB_Table,
  Properties: {
    TableName: "${self:provider.environment.IMAGES_TABLE}",
    AttributeDefinitions: [
      {
        AttributeName: 'groupId',
        AttributeType: 'S',
      },
      {
        AttributeName: 'timestamp',
        AttributeType: 'S',
      },
      {
        AttributeName: 'imageId',
        AttributeType: 'S',
      },
    ],
    KeySchema: [
      {
        AttributeName: 'groupId',
        KeyType: 'HASH',
      },
      {
        AttributeName: 'timestamp',
        KeyType: 'RANGE',
      },
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: '${self:provider.environment.IMAGE_ID_INDEX}',
        KeySchema: [
          {
            AttributeName: 'imageId',
            KeyType: 'HASH',
          },
        ],
        Projection: {
          ProjectionType: 'ALL'
        }
      }
    ],
    BillingMode: BillingMode.PAY_PER_REQUEST,
    StreamSpecification: {
      StreamViewType: "NEW_IMAGE",
    },
  },
};