import { ApolloClient, InMemoryCache, from, HttpLink } from '@apollo/client';
import { onError } from "@apollo/client/link/error";
import { gql } from '@apollo/client';
import { createUploadLink } from 'apollo-upload-client';

const AuthLink = (operation, next) => {
  const token = localStorage.getItem('jwt');
  if(token) {
    operation.setContext(context => ({
      ...context,
      headers: {
        ...context.headers,
        Authorization: `Bearer ${token}`,
      },
    }));
  }
  return next(operation);
};

const client = new ApolloClient({
  link: from([
    onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors) {
        graphQLErrors.map(({ message, locations, path }) =>
        console.log(`[GraphQL error]: Message: ${message}, Location:
        ${locations}, Path: ${path}`));
        if (networkError) {
          console.log(`[Network error]: ${networkError}`);
        }
      }
    }),
//    new HttpLink({
//	    uri: 'http://ec2-34-221-196-245.us-west-2.compute.amazonaws.com:8000/graphql',
  //  }),
  AuthLink,
    createUploadLink({
	    uri: 'http://ec2-34-219-113-57.us-west-2.compute.amazonaws.com:8000/graphql',
      credentials: 'same-origin',
    }),


  ]),
 cache: new InMemoryCache(),
});

//client.query({
//	query: gql`
//	{
//	posts {
//		id
//		text
//	}
//}`
//}).then(result => console.log(result));



export default client;
