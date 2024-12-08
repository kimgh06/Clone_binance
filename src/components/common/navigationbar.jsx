import Image from "next/image";
import NavigationButton from "./navigationButton";

export default function Navigationbar() {
  return (
    <nav className="bg-gray-800 flex justify-between py-5 px-20">
      <div className="">
        <div className="flex items-center gap-5">
          <Image src="/coin.png" alt="logo" width={40} height={40} />
          <h2>Coin Market</h2>
        </div>
      </div>
      <div className="flex justify-around items-center gap-5">
        <NavigationButton>Login</NavigationButton>
        <NavigationButton>Sign up</NavigationButton>
      </div>
    </nav>
  );
}
