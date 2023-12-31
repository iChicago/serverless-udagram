import { ResourceTypes } from '../../constants';

export const S3Bucket = {
  Type: ResourceTypes.AWS_S3_Bucket,
  DependsOn: ["SNSTopicPolicy"],
  Properties: {
    BucketName: "${self:provider.environment.IMAGES_S3_BUCKET}",
    NotificationConfiguration: {
      TopicConfigurations: [
        {
          Event: "s3:ObjectCreated:Put",
          Topic: {
            Ref: "SNSTopicImages",
          },
        },
      ],
    },
    OwnershipControls:{
      Rules: [
        {
          ObjectOwnership: "ObjectWriter",
        }
      ],
    },
    PublicAccessBlockConfiguration: {
      BlockPublicAcls: false,
      BlockPublicPolicy: false,
      IgnorePublicAcls: false,
      RestrictPublicBuckets: false,
    },
    CorsConfiguration:{
      CorsRules: [
        {
          AllowedOrigins: ['*'],
          AllowedHeaders: ['*'],
          AllowedMethods: [
            "GET",
            "PUT",
            "POST",
            "DELETE",
            "HEAD"
          ],
          MaxAge: "3000",
        }
      ],
    },
  },
};