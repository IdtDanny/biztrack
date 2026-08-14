'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Package, Users, TrendingUp, Bell, User, LogOut } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const stats = [
  { 
    title: 'Revenue', 
    value: 'RWF 125,430', 
    icon: <DollarSign className="h-5 w-5" />, 
    change: '+12%',
    changeLabel: 'vs last month',
    gradient: 'from-green-500 to-emerald-600'
  },
  { 
    title: 'Sales', 
    value: '1,234', 
    icon: <TrendingUp className="h-5 w-5" />, 
    change: '+8%',
    changeLabel: 'vs last month',
    gradient: 'from-blue-500 to-cyan-600'
  },
  { 
    title: 'Products', 
    value: '3,845', 
    icon: <Package className="h-5 w-5" />, 
    change: '+3%',
    changeLabel: 'vs last month',
    gradient: 'from-amber-500 to-orange-600'
  },
  { 
    title: 'Customers', 
    value: '256', 
    icon: <Users className="h-5 w-5" />, 
    change: '+15%',
    changeLabel: 'vs last month',
    gradient: 'from-purple-500 to-pink-600'
  },
];

const recentActivity = [
  { id: 'INV-1234', amount: 'RWF 45,000', status: 'Paid', time: '2 hours ago' },
  { id: 'INV-1233', amount: 'RWF 12,500', status: 'Pending', time: '5 hours ago' },
  { id: 'INV-1232', amount: 'RWF 89,000', status: 'Paid', time: '1 day ago' },
  { id: 'INV-1231', amount: 'RWF 32,000', status: 'Overdue', time: '2 days ago' },
];

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/login');
    } else {
      setLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background bg-grid-pattern">
        <div className="glass-deep rounded-2xl p-8 flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground text-sm">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background bg-grid-pattern p-4 md:p-6 relative">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-300/10 dark:bg-blue-500/5 rounded-full blur-3xl animate-float pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-300/10 dark:bg-amber-500/5 rounded-full blur-3xl animate-float delay-1000 pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 glass-deep rounded-2xl border border-white/5 dark:border-white/5 p-4 mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold gradient-text">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Welcome back! Here's what's happening with your business.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="glass-modern border-none rounded-full relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-red-500 rounded-full" />
          </Button>
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="glass-modern border-none rounded-full flex items-center gap-2 px-3">
                <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-white font-semibold text-sm shadow-lg shadow-primary/20">
                  JD
                </div>
                <span className="hidden sm:inline text-sm font-medium">John Doe</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="glass-deep border border-white/5 rounded-xl">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                <User className="h-4 w-4" /> Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2 cursor-pointer" onClick={handleLogout}>
                <LogOut className="h-4 w-4" /> Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="glass-deep border border-white/5 dark:border-white/5 hover:border-white/10 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl md:text-3xl font-bold tracking-tight mt-1">{stat.value}</p>
                  </div>
                  <div className={`p-2.5 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg shadow-${stat.gradient.split(' ')[1]}/20`}>
                    <span className="text-white">{stat.icon}</span>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-xs font-medium text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full">
                    {stat.change}
                  </span>
                  <span className="text-xs text-muted-foreground">{stat.changeLabel}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Chart and Recent Activity */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="glass-deep border border-white/5 dark:border-white/5 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Revenue Overview</CardTitle>
            <p className="text-sm text-muted-foreground">Monthly revenue for the current year</p>
          </CardHeader>
          <CardContent className="h-64 md:h-80 flex items-center justify-center">
            <div className="w-full h-full flex items-center justify-center">
              {/* Placeholder for Recharts */}
              <div className="w-full h-full flex flex-col items-center justify-center gap-4">
                <div className="w-full h-12 glass-deep rounded-lg animate-pulse" />
                <div className="w-3/4 h-12 glass-deep rounded-lg animate-pulse" />
                <div className="w-1/2 h-12 glass-deep rounded-lg animate-pulse" />
                <p className="text-sm text-muted-foreground mt-4">
                  📊 Chart will be displayed here using Recharts
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-deep border border-white/5 dark:border-white/5">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentActivity.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-xl glass-modern border border-white/5 hover:border-white/10 transition-all duration-200"
              >
                <div>
                  <p className="text-sm font-medium">{item.id}</p>
                  <p className="text-xs text-muted-foreground">{item.time}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{item.amount}</p>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      item.status === 'Paid'
                        ? 'bg-green-500/10 text-green-500'
                        : item.status === 'Pending'
                        ? 'bg-amber-500/10 text-amber-500'
                        : 'bg-red-500/10 text-red-500'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { motion } from 'framer-motion';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { DollarSign, Package, Users, TrendingUp } from 'lucide-react';

// const stats = [
//   { title: 'Revenue', value: '₦ 125,430', icon: <DollarSign className="h-5 w-5 text-green-500" />, change: '+12%' },
//   { title: 'Sales', value: '1,234', icon: <TrendingUp className="h-5 w-5 text-blue-500" />, change: '+8%' },
//   { title: 'Products', value: '3,845', icon: <Package className="h-5 w-5 text-amber-500" />, change: '+3%' },
//   { title: 'Customers', value: '256', icon: <Users className="h-5 w-5 text-purple-500" />, change: '+15%' },
// ];

// export default function DashboardPage() {
//   const router = useRouter();
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Only run on client
//     if (typeof window === 'undefined') return;

//     const token = localStorage.getItem('accessToken');
//     if (!token) {
//       router.push('/login');
//     } else {
//       setLoading(false);
//     }
//   }, [router]);

//   // Show loading spinner while checking auth
//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex flex-wrap items-center justify-between gap-4">
//         <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
//         <p className="text-sm text-gray-500 dark:text-gray-400">Welcome back!</p>
//       </div>

//       {/* Stats Grid */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
//         {stats.map((stat, index) => (
//           <motion.div
//             key={stat.title}
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: index * 0.1 }}
//           >
//             <Card className="glass-card">
//               <CardContent className="p-4 md:p-6">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.title}</p>
//                     <p className="text-2xl font-bold">{stat.value}</p>
//                   </div>
//                   <div className="p-2 bg-white/20 dark:bg-slate-700/20 rounded-lg">
//                     {stat.icon}
//                   </div>
//                 </div>
//                 <div className="mt-2 flex items-center text-xs text-green-500">
//                   <span>{stat.change}</span>
//                   <span className="ml-1 text-gray-500 dark:text-gray-400">vs last month</span>
//                 </div>
//               </CardContent>
//             </Card>
//           </motion.div>
//         ))}
//       </div>

//       {/* Chart and Recent Activity */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         <Card className="glass-card lg:col-span-2">
//           <CardHeader>
//             <CardTitle>Revenue Overview</CardTitle>
//           </CardHeader>
//           <CardContent className="h-64 md:h-80 flex items-center justify-center text-gray-400 dark:text-gray-500">
//             <p>Chart will be displayed here (Recharts)</p>
//           </CardContent>
//         </Card>

//         <Card className="glass-card">
//           <CardHeader>
//             <CardTitle>Recent Activity</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             {[1, 2, 3, 4].map((i) => (
//               <div key={i} className="flex justify-between items-center border-b border-white/10 dark:border-slate-700/30 pb-2 last:border-0">
//                 <div>
//                   <p className="text-sm font-medium">Invoice #{i}234</p>
//                   <p className="text-xs text-gray-500">2 hours ago</p>
//                 </div>
//                 <span className="text-xs text-green-500">Paid</span>
//               </div>
//             ))}
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }