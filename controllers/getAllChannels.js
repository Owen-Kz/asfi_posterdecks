const { gql } = require('graphql-tag');
const { executeGraphQLQuery } = require('./graphProvider');
// Define the GraphQL query to fetch all channels
const GET_ALL_CHANNELS = gql`
  query GetAllChannels {
    getChannels {
      channel
      title
      secret
    }
    # joinChannel(passphrase: "*") {
    #   channel
    # }
  }
`;

/**
 * Fetch all channels from the database with their channel, title, and secret.
 * @param {String} token - The authentication token
 * @returns {Promise<Array>} A promise that resolves to an array of channel information
 */
async function getAllChannels(token) {
  try {
    // Execute the GraphQL query using the Apollo Client
    const response = await executeGraphQLQuery(token, GET_ALL_CHANNELS);

    // Check if there are channels in the response
    if (response?.channels) {
      console.log('getAllChannels', 'API getAllChannels successful.');
      return response.channels.map((channelData) => ({
        channel: channelData.channel,
        title: channelData.title,
        secret: channelData.secret,
      }));
    } else {
      throw new Error('No channels found in the response.');
    }
  } catch (error) {
    console.error('getAllChannels', 'Error occurred while fetching channels.', error);
    throw error;
  }
}

module.exports = getAllChannels;
