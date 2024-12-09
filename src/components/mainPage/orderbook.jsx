export default function Orderbook({ price, amount, when }) {
  const time = when ? new Date(when).toLocaleTimeString() : undefined;
  return (
    <div className="flex text-sm justify-between">
      <div>{amount}</div>
      <div>${price}</div>
      {when && <div>{time}</div>}
    </div>
  );
}
