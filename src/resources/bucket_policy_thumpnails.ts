import { ResourceTypes } from '../../constants';

export const BucketPolicyThumpnails = {
  Type: ResourceTypes.AWS_S3_Bucket_Policy,
  DependsOn: ["S3BucketThumpnails"],
  Properties: {
    Bucket: "${self:provider.environment.THUMBNAILS_S3_BUCKET}",
    PolicyDocument: {
      Id: "BucketPolicyThumpnails",
      Version: "2012-10-17",
      Statement: [
        {
          Sid: "PublicReadForGetBucketObjects",
          Effect: "Allow",
          Principal: '*',
          Action: 's3:GetObject',
          Resource: 'arn:aws:s3:::${self:provider.environment.THUMBNAILS_S3_BUCKET}/*',
        },
      ]
    }
  },
};