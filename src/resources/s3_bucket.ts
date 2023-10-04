import { ResourceTypes } from '../../constants';

export const S3Bucket = {
  Type: ResourceTypes.AWS_S3_Bucket,
  Properties: {
    BucketName: "${self:provider.environment.IMAGES_S3_BUCKET}",
    // needed here instead of sendNotification index because s3 will attempt to crate a new buckt while its already exists
    NotificationConfiguration: {
      LambdaConfigurations: [
        {
          Event: "s3:ObjectCreated:*",
          Function: {
            'Fn::GetAtt': ["SendUploadNotificationsLambdaFunction", "Arn"]
          }
        }
      ],
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