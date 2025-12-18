import { auth } from "@/auth";
import UserProfile from "@/app/home";
import CryptoPortfolioPage from "@/app/home/assets";
import AccountsPage from "@/app/home/addresses";


export default async function DashboardPage() {
  const session = await auth();

  const userId = session?.user?.id;
   
 
console.log("USER FROM SESSION:", session?.user);
console.log("USER ID:", session?.user?.id);

  return (
    <>
      <UserProfile userId={userId} />
      <CryptoPortfolioPage userId={userId} />
      <AccountsPage userId={userId} />     
    </>
  );
}

