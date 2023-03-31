import Router from 'next/router';
import useRequest from '../../hooks/use-request';

const RecordShow = ({ record }) => {
  const { doRequest, errors } = useRequest({
    url: '/api/orders',
    method: 'post',
    body: {
      recordId: record.id
    },
    onSuccess: (order) => Router.push('/orders/[orderId]', `/orders/${order.id}`)
  });

  return <div>
    <h4>Title: {record.title}</h4>
    <h4>Price: {record.price}</h4>
    {errors}
    <button onClick={() => doRequest()} className="btn btn-primary">Purchase</button>
  </div>;
};

RecordShow.getInitialProps = async (context, client) => {
  const { recordId } = context.query;
  const { data } = await client.get(`/api/records/${recordId}`);

  return { record: data };
}

export default RecordShow;