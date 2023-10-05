import { ResourceTypes } from '../../constants';

export const BucketPolicy = {
  Type: ResourceTypes.AWS_S3_Bucket_Policy,
  Properties: {
    Bucket: "${self:provider.environment.IMAGES_S3_BUCKET}",
    // AccessControl: "PublicRead",
    PolicyDocument: {
      Id: "MyPolicy",
      Version: "2012-10-17",
      Statement: [
        {
          Sid: "PublicReadForGetBucketObjects",
          Effect: "Allow",
          Principal: '*',
          Action: 's3:GetObject',
          Resource: 'arn:aws:s3:::${self:provider.environment.IMAGES_S3_BUCKET}/*',
        }
      ]
    }
  },
};