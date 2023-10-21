import { ResourceTypes } from '../../constants';

export const KMSKeyAlias = {
  Type: ResourceTypes.AWS_KMS_ALIAS,
  Properties: {
    AliasName: "alias/auth0Key-${self:provider.stage}",
    TargetKeyId: { Ref: 'KMSKey' },
  },
};