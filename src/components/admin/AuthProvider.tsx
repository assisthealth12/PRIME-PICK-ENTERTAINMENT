"use client";

import { useEffect, useState, createContext, useContext } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { useRouter, usePathname } from "next/navigation";

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);

      // Protect admin routes
      if (!user && pathname?.startsWith("/admin") && pathname !== "/admin/login") {
        router.push("/admin/login");
      }
      
      // Redirect logged in users from login to dashboard
      if (user && pathname === "/admin/login") {
        router.push("/admin");
      }
    });

    return () => unsubscribe();
  }, [pathname, router]);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {loading ? (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white">
          <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}
