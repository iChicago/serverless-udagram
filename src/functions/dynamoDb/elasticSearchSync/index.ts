import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      stream: {
        type: "dynamodb",
        arn: {
          'Fn::GetAtt': ['DynamoDBTableImage', 'StreamArn'],
        },
      },
    },
  ],
  environment: {
    ES_ENDPOINT: {
      'Fn::GetAtt': ['ElasticSearchCluster', 'DomainEndpoint'],
    },
  },
};
