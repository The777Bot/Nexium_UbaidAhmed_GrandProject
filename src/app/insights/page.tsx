'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { 
  FaSmile, 
  FaMeh, 
  FaFrown, 
  FaArrowUp, 
  FaArrowDown, 
  FaCalendarAlt,
  FaChartLine,
  FaLightbulb,
  FaHeart,
  FaBrain,
  FaDumbbell,
  FaUsers
} from 'react-icons/fa';

interface MoodEntry {
  id: string;
  date: string;
  timestamp: string;
  mood: number;
  moodType: string;
  energy: number;
  sleep: number;
  stress: number;
  activities: string[];
}

interface Activity {
  id: string;
  name: string;
  impact: "positive" | "negative" | "neutral";
  category: string;
  icon: React.ReactNode;
  description: string;
  freshness: number;
}

const activities: Activity[] = [
  { id: "1", name: "Exercise", impact: "positive", category: "physical", icon: <FaDumbbell />, description: "Gym, running, or any physical workout", freshness: 9 },
  { id: "2", name: "Walking", impact: "positive", category: "physical", icon: <FaDumbbell />, description: "Outdoor walk or hiking", freshness: 8 },
  { id: "3", name: "Running", impact: "positive", category: "physical", icon: <FaDumbbell />, description: "Jogging or sprinting", freshness: 9 },
  { id: "4", name: "Swimming", impact: "positive", category: "physical", icon: <FaDumbbell />, description: "Swimming or water activities", freshness: 8 },
  { id: "5", name: "Cycling", impact: "positive", category: "physical", icon: <FaDumbbell />, description: "Biking or cycling", freshness: 9 },
  { id: "6", name: "Yoga", impact: "positive", category: "physical", icon: <FaDumbbell />, description: "Yoga or stretching", freshness: 9 },
  { id: "7", name: "Meditation", impact: "positive", category: "mental", icon: <FaBrain />, description: "Mindfulness or meditation practice", freshness: 9 },
  { id: "8", name: "Reading", impact: "positive", category: "mental", icon: <FaBrain />, description: "Reading books or articles", freshness: 8 },
  { id: "9", name: "Learning", impact: "positive", category: "mental", icon: <FaBrain />, description: "Studying or learning new skills", freshness: 9 },
  { id: "10", name: "Prayer", impact: "positive", category: "mental", icon: <FaBrain />, description: "Spiritual or religious activities", freshness: 9 },
  { id: "11", name: "Socializing", impact: "positive", category: "social", icon: <FaUsers />, description: "Meeting friends or family", freshness: 8 },
  { id: "12", name: "Family Time", impact: "positive", category: "social", icon: <FaHeart />, description: "Quality time with family", freshness: 9 },
  { id: "13", name: "Pet Time", impact: "positive", category: "social", icon: <FaHeart />, description: "Playing with pets", freshness: 8 },
  { id: "14", name: "Dating", impact: "positive", category: "social", icon: <FaHeart />, description: "Romantic activities", freshness: 8 },
];

export default function InsightsPage() {
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState("30");

  useEffect(() => {
    try {
      const savedEntries = localStorage.getItem("mentalHealthEntries");
      if (savedEntries) {
        const parsedEntries = JSON.parse(savedEntries);
        setEntries(parsedEntries);
      }
    } catch (error) {
      console.error("Error loading entries:", error);
    }
  }, []);

  const getFilteredData = useMemo(() => {
    const days = parseInt(selectedTimeframe);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    return entries
      .filter((entry) => new Date(entry.date) >= cutoffDate)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [entries, selectedTimeframe]);

  const getAverageMood = useMemo(() => {
    if (entries.length === 0) return 0;
    const total = entries.reduce((sum, entry) => sum + entry.mood, 0);
    return total / entries.length;
  }, [entries]);

  const getMoodTrend = useMemo(() => {
    if (getFilteredData.length < 2) return "stable";
    const recentMood = getFilteredData.slice(-7).reduce((sum, entry) => sum + entry.mood, 0) / Math.min(7, getFilteredData.slice(-7).length);
    const olderMood = getFilteredData.slice(0, -7).reduce((sum, entry) => sum + entry.mood, 0) / Math.max(1, getFilteredData.slice(0, -7).length);
    if (recentMood > olderMood + 1) return "improving";
    if (recentMood < olderMood - 1) return "declining";
    return "stable";
  }, [getFilteredData]);

  const getTopActivities = useMemo(() => {
    const activityCounts: { [key: string]: number } = {};
    const activityMoodScores: { [key: string]: number[] } = {};

    entries.forEach(entry => {
      entry.activities.forEach(activityId => {
        activityCounts[activityId] = (activityCounts[activityId] || 0) + 1;
        if (!activityMoodScores[activityId]) activityMoodScores[activityId] = [];
        activityMoodScores[activityId].push(entry.mood);
      });
    });

    return Object.entries(activityCounts)
      .map(([activityId, count]) => {
        const activity = activities.find(a => a.id === activityId);
        const avgMood = activityMoodScores[activityId].reduce((sum, mood) => sum + mood, 0) / activityMoodScores[activityId].length;
        return { activity, count, avgMood };
      })
      .filter(item => item.activity)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [entries]);

  const getMoodInsights = useMemo(() => {
    const insights = [];
    
    if (getAverageMood >= 8) {
      insights.push("Excellent! Your mood is consistently high. Keep up the great work!");
    } else if (getAverageMood >= 6) {
      insights.push("Good mood levels! You're maintaining a positive outlook.");
    } else if (getAverageMood >= 4) {
      insights.push("Your mood is moderate. Consider adding more positive activities to your routine.");
    } else {
      insights.push("Your mood has been low. Consider reaching out to friends, family, or a mental health professional.");
    }

    if (getMoodTrend === "improving") {
      insights.push("Great news! Your mood has been improving recently. Whatever you're doing, keep it up!");
    } else if (getMoodTrend === "declining") {
      insights.push("Your mood has been declining. Try to identify what might be causing this and consider positive coping strategies.");
    }

    if (getTopActivities.length > 0) {
      const topActivity = getTopActivities[0];
      if (topActivity.avgMood >= 7) {
        insights.push(`${topActivity.activity?.name} seems to really boost your mood! Consider doing it more often.`);
      }
    }

    return insights;
  }, [getAverageMood, getMoodTrend, getTopActivities]);

  const getWeeklyPatterns = useMemo(() => {
    const dayOfWeekMoods: { [key: string]: number[] } = {};
    
    entries.forEach(entry => {
      const day = new Date(entry.date).toLocaleDateString('en-US', { weekday: 'long' });
      if (!dayOfWeekMoods[day]) dayOfWeekMoods[day] = [];
      dayOfWeekMoods[day].push(entry.mood);
    });

    return Object.entries(dayOfWeekMoods)
      .map(([day, moods]) => ({
        day,
        avgMood: moods.reduce((sum, mood) => sum + mood, 0) / moods.length,
        count: moods.length
      }))
      .sort((a, b) => b.avgMood - a.avgMood);
  }, [entries]);

  if (entries.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <Card className="text-center py-16">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mb-4 mx-auto">
            <FaChartLine className="text-4xl text-blue-400" />
          </div>
          <h1 className="text-2xl font-bold mb-4">No Data Yet</h1>
          <p className="text-gray-600 mb-6">Start tracking your mental health to see personalized insights and patterns.</p>
          <Button onClick={() => window.location.href = '/'} variant="default" size="lg">
            Start Tracking
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-extrabold mb-2">Mental Health Insights</h1>
        <p className="text-lg text-gray-600">Discover patterns and trends in your emotional well-being</p>
      </div>

      {/* Timeframe Selector */}
      <div className="flex justify-center">
        <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
          {[7, 14, 30, 90].map(days => (
            <button
              key={days}
              onClick={() => setSelectedTimeframe(days.toString())}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedTimeframe === days.toString()
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {days} days
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="text-center p-6 hover-lift">
          <div className="flex items-center justify-center mb-2">
            {getAverageMood >= 8 ? (
              <FaSmile className="text-3xl text-green-500" />
            ) : getAverageMood >= 5 ? (
              <FaMeh className="text-3xl text-yellow-500" />
            ) : (
              <FaFrown className="text-3xl text-red-500" />
            )}
          </div>
          <h3 className="text-lg font-semibold text-gray-700">Average Mood</h3>
          <p className="text-3xl font-bold text-indigo-600">{getAverageMood.toFixed(1)}/10</p>
        </Card>

        <Card className="text-center p-6 hover-lift">
          <div className="flex items-center justify-center mb-2">
            {getMoodTrend === "improving" ? (
              <FaArrowUp className="text-3xl text-green-500" />
            ) : getMoodTrend === "declining" ? (
              <FaArrowDown className="text-3xl text-red-500" />
            ) : (
              <FaChartLine className="text-3xl text-blue-500" />
            )}
          </div>
          <h3 className="text-lg font-semibold text-gray-700">Mood Trend</h3>
          <p className="text-xl font-bold capitalize text-indigo-600">{getMoodTrend}</p>
        </Card>

        <Card className="text-center p-6 hover-lift">
          <div className="flex items-center justify-center mb-2">
            <FaCalendarAlt className="text-3xl text-purple-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700">Entries Analyzed</h3>
          <p className="text-3xl font-bold text-purple-600">{getFilteredData.length}</p>
        </Card>
      </div>

      {/* Insights */}
      <Card className="hover-lift">
        <div className="flex items-center gap-2 mb-4">
          <FaLightbulb className="text-2xl text-yellow-500" />
          <h2 className="text-2xl font-bold">Personalized Insights</h2>
        </div>
        <div className="space-y-3">
          {getMoodInsights.map((insight, index) => (
            <Alert key={index}>
              <AlertDescription className="text-base">{insight}</AlertDescription>
            </Alert>
          ))}
        </div>
      </Card>

      {/* Top Activities */}
      {getTopActivities.length > 0 && (
        <Card className="hover:shadow-lg transition-shadow">
          <h2 className="text-2xl font-bold mb-4">Your Most Frequent Activities</h2>
          <div className="space-y-4">
            {getTopActivities.map((item, index) => (
              <div key={item.activity?.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="text-2xl text-indigo-600">{item.activity?.icon}</div>
                  <div>
                    <h3 className="font-semibold">{item.activity?.name}</h3>
                    <p className="text-sm text-gray-600">{item.activity?.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{item.count} times</p>
                  <p className="text-sm text-gray-600">Avg mood: {item.avgMood.toFixed(1)}/10</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Weekly Patterns */}
      {getWeeklyPatterns.length > 0 && (
        <Card className="hover:shadow-lg transition-shadow">
          <h2 className="text-2xl font-bold mb-4">Weekly Mood Patterns</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {getWeeklyPatterns.map((pattern) => (
              <div key={pattern.day} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-semibold">{pattern.day}</h3>
                  <p className="text-sm text-gray-600">{pattern.count} entries</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{pattern.avgMood.toFixed(1)}/10</p>
                  <div className="flex items-center gap-1">
                    {pattern.avgMood >= 8 ? (
                      <FaSmile className="text-green-500" />
                    ) : pattern.avgMood >= 5 ? (
                      <FaMeh className="text-yellow-500" />
                    ) : (
                      <FaFrown className="text-red-500" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Recommendations */}
      <Card className="hover:shadow-lg transition-shadow">
        <h2 className="text-2xl font-bold mb-4">Recommendations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <h3 className="font-semibold text-green-800 mb-2">Keep Doing</h3>
            <ul className="text-sm text-green-700 space-y-1">
              {getTopActivities.filter(item => item.avgMood >= 7).slice(0, 3).map(item => (
                <li key={item.activity?.id}>• {item.activity?.name}</li>
              ))}
            </ul>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-800 mb-2">Try More</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Meditation and mindfulness</li>
              <li>• Regular exercise</li>
              <li>• Quality time with loved ones</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}