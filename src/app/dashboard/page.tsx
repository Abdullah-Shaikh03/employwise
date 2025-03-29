// "use client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard-header";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { dbConnect } from "@/lib/dbConfig";
import User from "@/models/users.model"; // Ensure this model exists
async function getUsers(page: number, limit: number) {
  await dbConnect();
  const users = await User.find()
    .skip((page - 1) * limit)
    .limit(limit);
  const totalUsers = await User.countDocuments();
  return { users, totalUsers };
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams?: { page?: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/signin");
  }

  const page = Number(searchParams?.page) || 1;
  const limit = 5;
  const { users, totalUsers } = await getUsers(page, limit);

  const totalPages = Math.ceil(totalUsers / limit);

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader user={session.user} />
      <main className="container mx-auto py-6 px-4 flex sm:flex-row gap-2"></main>
      <div className="flex justify-center">
        <div className="w-full max-w-4xl overflow-x-auto">
          <Table className="w-full border border-gray-300 rounded-lg shadow-md">
            <TableCaption className="text-gray-600">
              A list of all users
            </TableCaption>
            <TableHeader className="bg-gray-100">
              <TableRow>
                <TableHead className="p-3 text-left font-medium">No.</TableHead>
                <TableHead className="p-3 text-left w-[150px]">Name</TableHead>
                <TableHead className="p-3 text-left">Email</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map(
                (
                  user: { _id: string; name: string; email: string },
                  index: number
                ) => (
                  <TableRow
                    key={user._id}
                    className="hover:bg-gray-50 border-b"
                  >
                    <TableCell className="p-3">
                      {(page - 1) * limit + index + 1}
                    </TableCell>
                    <TableCell className="p-3 mx-3">{user.name}</TableCell>
                    <TableCell className="p-3">{user.email}</TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center gap-4 mt-4">
        {page > 1 && (
          <a
            href={`?page=${page - 1}`}
            className="px-4 py-2 bg-gray-200 rounded"
          >
            Previous
          </a>
        )}
        <span>
          Page {page} of {totalPages}
        </span>
        {page < totalPages && (
          <a
            href={`?page=${page + 1}`}
            className="px-4 py-2 bg-gray-200 rounded"
          >
            Next
          </a>
        )}
      </div>
    </div>
  );
}
