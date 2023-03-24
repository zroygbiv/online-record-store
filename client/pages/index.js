import buildClient from "../api/build-client";

// request from component; always issued from browser
const LandingPage = ({ currentUser }) => {
  return currentUser ? (<h1>You are signed in</h1> 
  ) : (
    <h1>You are not signed in</h1>
  );
};

// request executed during SSR 
LandingPage.getInitialProps = async (context) => {
  const client = buildClient(context);
  const { data } = await client.get('/api/users/currentuser'); 

  return data;
};

export default LandingPage;