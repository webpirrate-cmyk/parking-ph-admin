import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import LogoutButton from "@/components/LogoutButton";

export default async function Home() {
  const session = await auth();

  // If not authenticated, redirect to login
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 dark:from-zinc-950 dark:via-black dark:to-zinc-900">
      <div className="w-full max-w-md">
        <div className="backdrop-blur-xl bg-white/80 dark:bg-zinc-900/80 border border-zinc-200/50 dark:border-zinc-800/50 shadow-2xl rounded-2xl p-8">
          {/* User Info */}
          <div className="flex flex-col items-center text-center mb-6">
            {/* Profile Image */}
            {session.user.image && (
              <div className="relative h-24 w-24 rounded-full overflow-hidden ring-4 ring-blue-500/20 mb-4">
                <Image
                  src={session.user.image}
                  alt={session.user.name || "User"}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            {/* User Details */}
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white mb-1">
              {session.user.name}
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              {session.user.email}
            </p>
          </div>

          {/* Logout Button */}
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}
