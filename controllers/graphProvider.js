const { ApolloClient, createHttpLink, InMemoryCache, ApolloLink } = require('@apollo/client');
const fetch = require('cross-fetch'); // Required for Apollo Client in Node.js

// Define the backend endpoint and project-specific details
const BACKEND_ENDPOINT = process.env.BACKEND_ENDPOINT;  // Replace with actual backend endpoint
const PROJECT_ID = process.env.PROJECT_ID;  // Replace with actual project ID

// Create the HTTP link for GraphQL connection
const httpLink = createHttpLink({
  uri: `${BACKEND_ENDPOINT}/v1/query`,
  credentials: 'include',
  fetch,  // Use cross-fetch in Node.js environment
});

// Create the cache
const cache = new InMemoryCache();

// Function to create an ApolloLink for adding authentication headers
const authLink = (token) => {
  console.log("TOKEN", token)
  console.log("PROJECT_ID", PROJECT_ID)
  return new ApolloLink((operation, forward) => {
    if (token) {
    
      // Set the necessary headers, including authentication and project details
      operation.setContext(({ headers = {} }) => ({
        headers: {
          ...headers,
          'X-Project-ID': PROJECT_ID,
          'X-Platform-ID': 'turnkey_web',
          ...(token && {
            authorization: token ? `Bearer ${token}` : '',
          }),
        },
      }));
    }
    return forward(operation);
  });
};

// Function to initialize the Apollo Client with authentication
const createClient = (token) => {
  const link = authLink(token).concat(httpLink);
  return new ApolloClient({
    link: link,
    cache: cache,
  });
};

/**
 * Example function to execute a GraphQL query
 * @param {String} token - The authentication token
 * @param {String} query - The GraphQL query to execute
 * @param {Object} variables - The variables for the query
 */
const executeGraphQLQuery = async (token, query, variables = {}) => {
  const client = createClient(token);
  
  try {
    const response = await client.query({
      query,
      variables,
    });
    
    return response.data;
  } catch (error) {
    console.error('Error executing GraphQL query:', error);
    throw error;
  }
};

module.exports = { createClient, executeGraphQLQuery };
