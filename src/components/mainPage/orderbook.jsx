export default function Orderbook({ price, quantity }) {
  return (
    <p className="flex text-sm justify-between">
      <div>{quantity}</div>
      <div>${price}</div>
    </p>
  );
}
