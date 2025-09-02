import React from 'react';
import { BarChart3, Users, FileText, Briefcase, TrendingUp, Clock, Award, CheckCircle } from 'lucide-react';

const Dashboard = ({ onClose }) => {
  // Mock data for the dashboard
  const stats = {
    totalApplications: 24,
    averageScore: 78,
    documentsOptimized: 36,
    topSkills: ['React', 'JavaScript', 'TypeScript', 'Node.js', 'Python'],
    recentCompanies: ['Google', 'Microsoft', 'Amazon', 'Meta', 'Apple'],
    applicationsByMonth: [5, 8, 11, 24],
    scoreDistribution: [5, 12, 42, 41],
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <BarChart3 className="h-6 w-6 text-blue-600 mr-2" />
          Application Dashboard
        </h2>
        <button
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Return to Application
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-blue-900">Total Applications</h3>
            <div className="bg-blue-200 p-2 rounded-lg">
              <FileText className="h-5 w-5 text-blue-700" />
            </div>
          </div>
          <div className="text-3xl font-bold text-blue-900">{stats.totalApplications}</div>
          <div className="text-sm text-blue-700 mt-2 flex items-center">
            <TrendingUp className="h-4 w-4 mr-1" />
            <span>+12% from last month</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-purple-900">Average CV Score</h3>
            <div className="bg-purple-200 p-2 rounded-lg">
              <Award className="h-5 w-5 text-purple-700" />
            </div>
          </div>
          <div className="text-3xl font-bold text-purple-900">{stats.averageScore}/100</div>
          <div className="text-sm text-purple-700 mt-2 flex items-center">
            <TrendingUp className="h-4 w-4 mr-1" />
            <span>+5 points improvement</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-green-900">Documents Optimized</h3>
            <div className="bg-green-200 p-2 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-700" />
            </div>
          </div>
          <div className="text-3xl font-bold text-green-900">{stats.documentsOptimized}</div>
          <div className="text-sm text-green-700 mt-2 flex items-center">
            <TrendingUp className="h-4 w-4 mr-1" />
            <span>+8 this week</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 border border-yellow-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-yellow-900">Time Saved</h3>
            <div className="bg-yellow-200 p-2 rounded-lg">
              <Clock className="h-5 w-5 text-yellow-700" />
            </div>
          </div>
          <div className="text-3xl font-bold text-yellow-900">18 hrs</div>
          <div className="text-sm text-yellow-700 mt-2 flex items-center">
            <span>Avg. 45 min per application</span>
          </div>
        </div>
      </div>

      {/* Charts and Additional Data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Applications Over Time */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Applications Over Time</h3>
          <div className="h-64 flex items-end justify-between space-x-2">
            {stats.applicationsByMonth.map((count, index) => {
              const height = (count / Math.max(...stats.applicationsByMonth)) * 100;
              const months = ['Jan', 'Feb', 'Mar', 'Apr'];
              return (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div 
                    className="w-full bg-blue-500 rounded-t-md transition-all duration-500" 
                    style={{ height: `${height}%` }}
                  ></div>
                  <div className="text-xs font-medium text-gray-600 mt-2">{months[index]}</div>
                  <div className="text-sm font-semibold text-gray-800">{count}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Score Distribution */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Score Distribution</h3>
          <div className="h-64 flex items-end justify-between space-x-2">
            {stats.scoreDistribution.map((percentage, index) => {
              const height = (percentage / Math.max(...stats.scoreDistribution)) * 100;
              const ranges = ['0-25', '26-50', '51-75', '76-100'];
              const colors = ['bg-red-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];
              return (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div 
                    className={`w-full ${colors[index]} rounded-t-md transition-all duration-500`} 
                    style={{ height: `${height}%` }}
                  ></div>
                  <div className="text-xs font-medium text-gray-600 mt-2">{ranges[index]}</div>
                  <div className="text-sm font-semibold text-gray-800">{percentage}%</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Skills */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Skills in Your CVs</h3>
          <div className="space-y-3">
            {stats.topSkills.map((skill, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold">
                    {index + 1}
                  </div>
                  <span className="ml-3 text-gray-800">{skill}</span>
                </div>
                <div className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {90 - index * 5}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Companies */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Companies Applied To</h3>
          <div className="space-y-3">
            {stats.recentCompanies.map((company, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700">
                    <Briefcase className="h-4 w-4" />
                  </div>
                  <span className="ml-3 text-gray-800">{company}</span>
                </div>
                <div className="text-sm text-gray-500">
                  {index + 1} {index === 0 ? 'day' : 'days'} ago
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;