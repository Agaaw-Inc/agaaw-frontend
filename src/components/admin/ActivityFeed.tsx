import { activityData } from "@/lib/mock/dashboardData";

export default function ActivityFeed() {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h3 className="font-semibold mb-4">Recent Activity</h3>
      <ul className="space-y-3">
        {activityData.map((activity) => (
          <li key={activity.id} className="flex justify-between text-sm">
            <span>{activity.message}</span>
            <span className="text-gray-400">{activity.time}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}