import Link from "next/link";

// request from component; always issued from browser
const LandingPage = ({ currentUser, records }) => {
  const recordList = records.map(record => {
    return (
      <tr key={record.id}>
        <td>{record.title}</td>
        <td>{record.price}</td>
        <td>
          <Link className="nav-link" href="/records/[recordId]" as={`/records/${record.id}`}>
            View
          </Link>
        </td>
      </tr>
    );
  })
  return (
    <div>
      <h1>For Sale</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>More Info</th>
          </tr>
        </thead>
        <tbody>
          {recordList}
        </tbody>
      </table>
    </div>
  );
};

// request executed during SSR 
LandingPage.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get('/api/records');

  return { records: data };
};

export default LandingPage;