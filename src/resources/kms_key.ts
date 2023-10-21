import { ResourceTypes } from '../../constants';

export const KMSKey = {
  Type: ResourceTypes.AWS_KMS_KEY,
  Properties: {
    Description: 'KMS key to encrypt Auth0 secret',
    KeyPolicy: {
      Version: '2012-10-17',
      Id: 'key-default-1',
      Statement: [
        {
          Sid: 'Allow administration of the key',
          Effect: 'Allow',
          Principal: {
            AWS: {
              'Fn::Join': [
                ':',
                [
                  'arn:aws:iam:',
                  { Ref: 'AWS::AccountId' },
                  'root',
                ],
              ],
            },
          },
          Action: ['kms:*'],
          Resource: '*',
        },
      ],
    },
  },
};