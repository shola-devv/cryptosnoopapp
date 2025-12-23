import { auth } from "@/lib/auth";
import UserProfile from "@/app/home/page";
import CryptoPortfolioPage from "@/app/home/assets/page";
import AccountsPage from "@/app/home/addresses/page";


export default async function DashboardPage() {
  const session = await auth();

  const userId = session?.user?.id;
   
 
console.log("USER FROM SESSION:", session?.user);
console.log("USER ID:", session?.user?.id);

  return (
    <>
      <UserProfile />
      <CryptoPortfolioPage />
      <AccountsPage />     
    </>
  );
}

