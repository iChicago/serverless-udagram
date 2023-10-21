import { ResourceTypes } from '../../constants';

// we will add cors headers
// if our custom authorized denied access to any functions 
// otherwise, the browser will throw cors error

export const GatewayResponseDefault4XX = {
  Type: ResourceTypes.AWS_API_GATEWAY_GATEWAY_RESPONSE,
  Properties: {
    ResponseType: 'DEFAULT_4XX',
    RestApiId: {
      Ref: 'ApiGatewayRestApi',
    },
    ResponseParameters: {
      'gatewayresponse.header.Access-Control-Allow-Origin': "'*'",
      'gatewayresponse.header.Access-Control-Allow-Headers': "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'",
      'gatewayresponse.header.Access-Control-Allow-Methods': "'GET,OPTIONS,POST'",
    },
  },
};