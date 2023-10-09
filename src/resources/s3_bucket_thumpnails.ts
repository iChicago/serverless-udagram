import { ResourceTypes } from '../../constants';

export const S3BucketThumpnails = {
  Type: ResourceTypes.AWS_S3_Bucket,
  Properties: {
    BucketName: "${self:provider.environment.IMAGES_S3_BUCKET}",
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