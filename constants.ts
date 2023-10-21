export class ResourceTypes {
    static readonly AWS_S3_Bucket = 'AWS::S3::Bucket';
    static readonly AWS_S3_Bucket_Policy = 'AWS::S3::BucketPolicy';
    static readonly AWS_DynamoDB_Table = 'AWS::DynamoDB::Table';
    static readonly AWS_SNS_Topic = 'AWS::SNS::Topic';
    static readonly AWS_Lambda_Function = 'AWS::Lambda::Function';
    static readonly AWS_Lambda_Permission = 'AWS::Lambda::Permission';
    static readonly AWS_Elasticsearch_Domain = 'AWS::Elasticsearch::Domain';
    static readonly AWS_SNS_TOPIC_POLICY = 'AWS::SNS::TopicPolicy';
    static readonly AWS_API_GATEWAY_GATEWAY_RESPONSE = 'AWS::ApiGateway::GatewayResponse';
    static readonly AWS_KMS_KEY = 'AWS::KMS::Key';
    static readonly AWS_KMS_ALIAS = 'AWS::KMS::Alias';
    static readonly AWS_SECRETS_MANAGER_SECRET = 'AWS::SecretsManager::Secret';
    // Add more resource types as needed
    // https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-template-resource-type-ref.html
}

export class BillingMode {
    static readonly PAY_PER_REQUEST = 'PAY_PER_REQUEST';
    static readonly PROVISIONED = 'PROVISIONED';
}

export const HTTPHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
};
