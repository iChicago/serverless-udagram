import { ResourceTypes } from '../../constants';

export const SendUploadNotificationsPermission = {
  Type: ResourceTypes.AWS_Lambda_Permission,
  Properties: {
    FunctionName: {
      Ref: "SendUploadNotificationsLambdaFunction"
    },
    Principal: 's3.amazonaws.com',
    Action: "lambda:InvokeFunction",
    SourceAccount: {
      Ref: "AWS::AccountId"
    },
    SourceArn: "arn:aws:s3:::${self:provider.environment.IMAGES_S3_BUCKET}",
  },
};