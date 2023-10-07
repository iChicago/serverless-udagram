import { ResourceTypes } from '../../constants';

export const SNSTopicImages = {
  Type: ResourceTypes.AWS_SNS_Topic,
  Properties: {
    DisplayName: 'Images bucket topic',
    TopicName: "${self:custom.topicName}",
  },
};