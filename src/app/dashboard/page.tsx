import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard-header";
import { dbConnect } from "@/lib/dbConfig";
import User from "@/models/users.model";
import UsersTable from "@/components/user-table"; // Import the new client component

const getUsers = async () => {
  await dbConnect();
  const users = await User.find().sort({ createdAt: -1 }); // Sort by newest first
  return users;
};

const DashboardPage = async () => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return redirect("/signin");
  }

  const users = await getUsers();

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader user={session.user} />
      <main className="flex-1 p-4">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <UsersTable users={JSON.parse(JSON.stringify(users))} /> {/* Pass users as prop */}
      </main>
    </div>
  );
};

export default DashboardPage;
