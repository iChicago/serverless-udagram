import { ResourceTypes } from '../../constants';

export const Auth0Secret = {
  Type: ResourceTypes.AWS_SECRETS_MANAGER_SECRET,
  Properties: {
    Name: { 'Fn::Sub': '${self:provider.environment.AUTH_0_SECRET_ID}' },
    Description: 'Auth0 secret',
    KmsKeyId: { Ref: 'KMSKey' },
  },
};