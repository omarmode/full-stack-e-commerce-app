import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import db from "../db/db";
import { formatCurrency, formatNumber } from "@/lib/formatters";

async function getsalesData() {
  const data = await db.order.aggregate({
    _sum: {
      pricePaidIncants: true,
    },
    _count: true,
  });
  return {
    amount: (data._sum.pricePaidIncants || 0) / 100,
    numberOfSales: data._count,
  };
}

async function getUserData() {
  const [userCount, orderData] = await Promise.all([
    db.user.count(),
    db.order.aggregate({
      _sum: { pricePaidIncants: true },
    }),
  ]);
  return {
    userCount,
    averageValuePerUser:
      userCount === 0
        ? 0
        : (orderData._sum.pricePaidIncants || 0) / userCount / 100,
  };
}

async function getProductData() {
  const [activeCount, inactiveCount] = await Promise.all([
    db.product.count({ where: { isAvailableForPurchase: true } }),
    db.product.count({ where: { isAvailableForPurchase: false } }),
  ]);

  return { activeCount, inactiveCount };
}

// مكون الصفحة الافتراضي
export default async function AdminDashboard() {
  const [salesData, userData, productData] = await Promise.all([
    getsalesData(),
    getUserData(),
    getProductData(),
  ]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <DashboardAdmin
        title="Sales"
        suptitle={`${formatNumber(salesData.numberOfSales)} Orders`}
        body={formatCurrency(salesData.amount)}
      />
      <DashboardAdmin
        title="Customers"
        suptitle={`${formatCurrency(
          userData.averageValuePerUser
        )} Average Value`}
        body={formatNumber(userData.userCount)}
      />
      <DashboardAdmin
        title="Active Products"
        suptitle={`${formatNumber(productData.inactiveCount)} Inactive`}
        body={formatNumber(productData.activeCount)}
      />
    </div>
  );
}

// مكون فرعي غير افتراضي
type DashboardAdminProps = {
  title: string;
  suptitle: string;
  body: string;
};

function DashboardAdmin({ title, suptitle, body }: DashboardAdminProps) {
  return (
    <Card
      className="
        bg-gradient-to-r from-purple-400 to-blue-500 text-white rounded-xl shadow-lg
        dark:from-purple-600 blue-600 transition-transform transform hover:scale-105
        hover:shadow-lg hover:bg-indigo-600 active:bg-indigo-700 cursor-pointer
        border border-gray-200 hover:border-transparent
      "
    >
      <CardHeader className="p-4">
        <CardTitle className="text-3xl font-bold text-white">{title}</CardTitle>
        <CardDescription className="text-md text-indigo-200">
          {suptitle}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        <p className="text-lg text-white">{body}</p>
      </CardContent>
    </Card>
  );
}
