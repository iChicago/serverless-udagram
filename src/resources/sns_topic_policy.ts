import { ResourceTypes } from '../../constants';

export const SNSTopicPolicy = {
  Type: ResourceTypes.AWS_SNS_TOPIC_POLICY,
  DependsOn: ["SNSTopicImages"],
  Properties: {
    PolicyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Principal: {
            AWS: '*',
          },
          Action: 'sns:Publish',
          Resource: {
            Ref: 'SNSTopicImages',
          },
          Condition: {
            ArnLike: {
              "aws:SourceArn": {
                "Fn::Join": [
                  "",
                  [
                    "arn:aws:s3:::",
                    "${self:provider.environment.IMAGES_S3_BUCKET}"
                  ]
                ]
              }
            },
          },
        },
      ],
    },
    Topics: [
      {
        Ref: 'SNSTopicImages',
      },
    ],
  },
};