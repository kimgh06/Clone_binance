export default function Orderbook({ price, amount, when }) {
  const time = new Date(when).toLocaleTimeString();
  return (
    <div className="flex text-sm justify-between">
      <div>{amount}</div>
      <div>${price}</div>
      {when && <div>{time}</div>}
    </div>
  );
}
