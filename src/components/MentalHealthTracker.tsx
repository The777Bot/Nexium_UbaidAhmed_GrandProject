"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Alert, AlertDescription } from "./ui/alert";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { 
  FaSmile, 
  FaMeh, 
  FaFrown, 
  FaDumbbell, 
  FaPrayingHands, 
  FaUsers, 
  FaBook, 
  FaBriefcase, 
  FaBed, 
  FaMobile, 
  FaPalette, 
  FaUtensils, 
  FaMusic, 
  FaWalking, 
  FaCoffee, 
  FaGamepad,
  FaHeart,
  FaRunning,
  FaSkiing,
  FaBiking,
  FaGraduationCap,
  FaCode,
  FaPen,
  FaCamera,
  FaVideo,
  FaHeadphones,
  FaShoppingCart,
  FaHome,
  FaDog,
  FaUserInjured,
  FaTrash,
  FaEdit
} from "react-icons/fa";

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

const MOOD_EMOJIS = [
  { min: 1, max: 3, icon: <FaFrown className="text-3xl text-red-400" />, label: "Low" },
  { min: 4, max: 7, icon: <FaMeh className="text-3xl text-yellow-400" />, label: "Medium" },
  { min: 8, max: 10, icon: <FaSmile className="text-3xl text-green-400" />, label: "High" },
];

const MOOD_TYPES = [
  { value: "happy", label: "Happy", emoji: "😊", color: "#22c55e" },
  { value: "excited", label: "Excited", emoji: "🤩", color: "#f59e0b" },
  { value: "content", label: "Content", emoji: "😌", color: "#10b981" },
  { value: "calm", label: "Calm", emoji: "😌", color: "#3b82f6" },
  { value: "neutral", label: "Neutral", emoji: "😐", color: "#6b7280" },
  { value: "tired", label: "Tired", emoji: "😴", color: "#8b5cf6" },
  { value: "sad", label: "Sad", emoji: "😢", color: "#3b82f6" },
  { value: "anxious", label: "Anxious", emoji: "😰", color: "#f59e0b" },
  { value: "stressed", label: "Stressed", emoji: "😤", color: "#ef4444" },
  { value: "angry", label: "Angry", emoji: "😠", color: "#dc2626" },
  { value: "frustrated", label: "Frustrated", emoji: "😤", color: "#ea580c" },
  { value: "guilty", label: "Guilty", emoji: "😔", color: "#7c3aed" },
  { value: "lonely", label: "Lonely", emoji: "🥺", color: "#0891b2" },
  { value: "overwhelmed", label: "Overwhelmed", emoji: "😵", color: "#be185d" },
];

const activities: Activity[] = [
  // Physical Activities
  { id: "1", name: "Exercise", impact: "positive", category: "physical", icon: <FaDumbbell />, description: "Gym, running, or any physical workout", freshness: 9 },
  { id: "2", name: "Walking", impact: "positive", category: "physical", icon: <FaWalking />, description: "Outdoor walk or hiking", freshness: 8 },
  { id: "3", name: "Running", impact: "positive", category: "physical", icon: <FaRunning />, description: "Jogging or sprinting", freshness: 9 },
  { id: "4", name: "Swimming", impact: "positive", category: "physical", icon: <FaSkiing />, description: "Swimming or water activities", freshness: 8 },
  { id: "5", name: "Cycling", impact: "positive", category: "physical", icon: <FaBiking />, description: "Biking or cycling", freshness: 9 },
  { id: "6", name: "Yoga", impact: "positive", category: "physical", icon: <FaPrayingHands />, description: "Yoga or stretching", freshness: 9 },

  // Mental Wellness
  { id: "7", name: "Meditation", impact: "positive", category: "mental", icon: <FaPrayingHands />, description: "Mindfulness or meditation practice", freshness: 9 },
  { id: "8", name: "Reading", impact: "positive", category: "mental", icon: <FaBook />, description: "Reading books or articles", freshness: 8 },
  { id: "9", name: "Learning", impact: "positive", category: "mental", icon: <FaGraduationCap />, description: "Studying or learning new skills", freshness: 9 },
  { id: "10", name: "Prayer", impact: "positive", category: "mental", icon: <FaPrayingHands />, description: "Spiritual or religious activities", freshness: 9 },

  // Social Activities
  { id: "11", name: "Socializing", impact: "positive", category: "social", icon: <FaUsers />, description: "Meeting friends or family", freshness: 8 },
  { id: "12", name: "Family Time", impact: "positive", category: "social", icon: <FaHeart />, description: "Quality time with family", freshness: 9 },
  { id: "13", name: "Pet Time", impact: "positive", category: "social", icon: <FaDog />, description: "Playing with pets", freshness: 8 },
  { id: "14", name: "Dating", impact: "positive", category: "social", icon: <FaHeart />, description: "Romantic activities", freshness: 8 },

  // Creative Activities
  { id: "15", name: "Creative Work", impact: "positive", category: "creative", icon: <FaPalette />, description: "Art, music, or creative projects", freshness: 9 },
  { id: "16", name: "Writing", impact: "positive", category: "creative", icon: <FaPen />, description: "Journaling or creative writing", freshness: 9 },
  { id: "17", name: "Photography", impact: "positive", category: "creative", icon: <FaCamera />, description: "Taking photos or videos", freshness: 8 },
  { id: "18", name: "Music", impact: "positive", category: "creative", icon: <FaMusic />, description: "Playing or listening to music", freshness: 9 },

  // Work & Productivity
  { id: "19", name: "Work", impact: "neutral", category: "work", icon: <FaBriefcase />, description: "Professional work activities", freshness: 7 },
  { id: "20", name: "Coding", impact: "positive", category: "work", icon: <FaCode />, description: "Programming or technical work", freshness: 9 },
  { id: "21", name: "Meetings", impact: "neutral", category: "work", icon: <FaUsers />, description: "Work meetings or calls", freshness: 7 },
  { id: "22", name: "Study", impact: "positive", category: "work", icon: <FaBook />, description: "Academic studying", freshness: 9 },

  // Lifestyle
  { id: "23", name: "Cooking", impact: "positive", category: "lifestyle", icon: <FaUtensils />, description: "Cooking or meal prep", freshness: 8 },
  { id: "24", name: "Coffee", impact: "neutral", category: "lifestyle", icon: <FaCoffee />, description: "Coffee or tea breaks", freshness: 7 },
  { id: "25", name: "Shopping", impact: "neutral", category: "lifestyle", icon: <FaShoppingCart />, description: "Shopping or errands", freshness: 7 },
  { id: "26", name: "Cleaning", impact: "positive", category: "lifestyle", icon: <FaHome />, description: "House cleaning or organizing", freshness: 8 },

  // Entertainment
  { id: "27", name: "Gaming", impact: "neutral", category: "entertainment", icon: <FaGamepad />, description: "Video games or board games", freshness: 8 },
  { id: "28", name: "Movies", impact: "neutral", category: "entertainment", icon: <FaVideo />, description: "Watching movies or TV", freshness: 7 },
  { id: "29", name: "Social Media", impact: "neutral", category: "entertainment", icon: <FaMobile />, description: "Social media browsing", freshness: 7 },
  { id: "30", name: "Podcasts", impact: "positive", category: "entertainment", icon: <FaHeadphones />, description: "Listening to podcasts", freshness: 9 },

  // Negative Activities
  { id: "31", name: "Work Stress", impact: "negative", category: "negative", icon: <FaBriefcase />, description: "Stressful work situations", freshness: 6 },
  { id: "32", name: "Poor Sleep", impact: "negative", category: "negative", icon: <FaBed />, description: "Sleep deprivation or insomnia", freshness: 5 },
  { id: "33", name: "Conflict", impact: "negative", category: "negative", icon: <FaUsers />, description: "Arguments or conflicts", freshness: 6 },
  { id: "34", name: "Illness", impact: "negative", category: "negative", icon: <FaUserInjured />, description: "Feeling sick or unwell", freshness: 5 },
];

const categories = [
  { id: "all", name: "All Activities", color: "bg-gray-100 text-gray-700" },
  { id: "physical", name: "Physical", color: "bg-green-100 text-green-700" },
  { id: "mental", name: "Mental Wellness", color: "bg-blue-100 text-blue-700" },
  { id: "social", name: "Social", color: "bg-purple-100 text-purple-700" },
  { id: "creative", name: "Creative", color: "bg-pink-100 text-pink-700" },
  { id: "work", name: "Work", color: "bg-orange-100 text-orange-700" },
  { id: "lifestyle", name: "Lifestyle", color: "bg-teal-100 text-teal-700" },
  { id: "entertainment", name: "Entertainment", color: "bg-indigo-100 text-indigo-700" },
  { id: "negative", name: "Challenges", color: "bg-red-100 text-red-700" },
];

export default function MentalHealthTracker() {
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  // Journal AI
  const [journalPrompt, setJournalPrompt] = useState("");
  const [journalReply, setJournalReply] = useState("");
  const [journalLoading, setJournalLoading] = useState(false);
  const [currentEntry, setCurrentEntry] = useState<Partial<MoodEntry>>({
    mood: 5,
    moodType: "neutral",
    energy: 5,
    sleep: 7,
    stress: 5,
    activities: [],
  });
  const [showForm, setShowForm] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState("7");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [editingEntry, setEditingEntry] = useState<string | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Load entries from localStorage on component mount
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

  // Save entries to localStorage whenever entries change
  useEffect(() => {
    try {
      localStorage.setItem("mentalHealthEntries", JSON.stringify(entries));
    } catch (error) {
      console.error("Error saving entries:", error);
    }
  }, [entries]);

  const saveEntry = useCallback(() => {
    if (!currentEntry.mood || !currentEntry.moodType) {
      alert("Please fill in all required fields");
      return;
    }

    const newEntry: MoodEntry = {
      id: editingEntry || Date.now().toString(),
      date: new Date().toISOString().split("T")[0],
      timestamp: new Date().toISOString(),
      mood: currentEntry.mood || 5,
      moodType: currentEntry.moodType || "neutral",
      energy: currentEntry.energy || 5,
      sleep: currentEntry.sleep || 7,
      stress: currentEntry.stress || 5,
      activities: currentEntry.activities || [],
    };

    if (editingEntry) {
      // Update existing entry
      setEntries(prev => prev.map(entry => entry.id === editingEntry ? newEntry : entry));
      setEditingEntry(null);
    } else {
      // Add new entry
      setEntries(prev => [...prev, newEntry]);
    }

    // Reset form
    setCurrentEntry({ mood: 5, moodType: "neutral", energy: 5, sleep: 7, stress: 5, activities: [] });
    setShowForm(false);
    
    // Show success message
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  }, [currentEntry, editingEntry]);

  const deleteEntry = useCallback((entryId: string) => {
    if (window.confirm("Are you sure you want to delete this entry?")) {
      setEntries(prev => prev.filter(entry => entry.id !== entryId));
    }
  }, []);

  const editEntry = useCallback((entry: MoodEntry) => {
    setCurrentEntry({
      mood: entry.mood,
      moodType: entry.moodType,
      energy: entry.energy,
      sleep: entry.sleep,
      stress: entry.stress,
      activities: entry.activities,
    });
    setEditingEntry(entry.id);
    setShowForm(true);
  }, []);

  const toggleActivity = useCallback((activityId: string) => {
    setCurrentEntry(prev => {
      const currentActivities = prev.activities || [];
      const updatedActivities = currentActivities.includes(activityId)
        ? currentActivities.filter((id) => id !== activityId)
        : [...currentActivities, activityId];
      return { ...prev, activities: updatedActivities };
    });
  }, []);

  const getFilteredData = useCallback(() => {
    const days = parseInt(selectedTimeframe);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    return entries
      .filter((entry) => new Date(entry.date) >= cutoffDate)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [entries, selectedTimeframe]);

  const getMoodDistribution = useCallback(() => {
    const moodRanges = [
      { name: "Excellent (8-10)", min: 8, max: 10, color: "#22c55e", description: "Great mood!" },
      { name: "Good (6-7)", min: 6, max: 7, color: "#10b981", description: "Feeling good" },
      { name: "Okay (4-5)", min: 4, max: 5, color: "#f59e0b", description: "Neutral mood" },
      { name: "Low (2-3)", min: 2, max: 3, color: "#ef4444", description: "Feeling down" },
      { name: "Very Low (1)", min: 1, max: 1, color: "#dc2626", description: "Need support" },
    ];

    const distribution = moodRanges.map(range => {
      const count = entries.filter(entry => entry.mood >= range.min && entry.mood <= range.max).length;
      return {
        name: range.name,
        value: count,
        color: range.color,
        description: range.description,
        percentage: entries.length > 0 ? ((count / entries.length) * 100).toFixed(1) : "0"
      };
    }).filter(item => item.value > 0);

    return distribution;
  }, [entries]);

  const getAverageMood = useCallback(() => {
    if (entries.length === 0) return "0";
    const total = entries.reduce((sum, entry) => sum + entry.mood, 0);
    return (total / entries.length).toFixed(1);
  }, [entries]);

  const getCurrentStreak = useCallback(() => {
    if (entries.length === 0) return 0;
    
    const today = new Date().toISOString().split("T")[0];
    const sortedEntries = [...entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    let streak = 0;
    let currentDate = new Date();
    
    for (const entry of sortedEntries) {
      const entryDate = new Date(entry.date);
      const diffTime = Math.abs(currentDate.getTime() - entryDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays <= 1) {
        streak++;
        currentDate = entryDate;
      } else {
        break;
      }
    }
    
    return streak;
  }, [entries]);

  const getMoodTrend = useCallback(() => {
    return getFilteredData().map((entry) => ({
      date: new Date(entry.date).toLocaleDateString(),
      time: new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      mood: entry.mood,
      energy: entry.energy,
      stress: entry.stress,
      moodType: entry.moodType,
    }));
  }, [getFilteredData]);

  const getMoodEmoji = useCallback((mood: number) => {
    if (mood >= 8) return <FaSmile className="text-green-500" />;
    if (mood >= 5) return <FaMeh className="text-yellow-500" />;
    return <FaFrown className="text-red-500" />;
  }, []);

  const getFilteredActivities = useCallback(() => {
    if (selectedCategory === "all") return activities;
    return activities.filter(activity => activity.category === selectedCategory);
  }, [selectedCategory]);

  const getSelectedActivities = useCallback(() => {
    return activities.filter(activity => currentEntry.activities?.includes(activity.id));
  }, [currentEntry.activities]);

  const getActivityColor = useCallback((freshness: number) => {
    if (freshness >= 9) return { bg: '#dcfce7', border: '#22c55e', text: '#166534' };
    if (freshness >= 7) return { bg: '#dbeafe', border: '#3b82f6', text: '#1e40af' };
    if (freshness >= 5) return { bg: '#fef3c7', border: '#f59e0b', text: '#92400e' };
    return { bg: '#fee2e2', border: '#ef4444', text: '#991b1b' };
  }, []);

  const resetForm = useCallback(() => {
    setCurrentEntry({ mood: 5, moodType: "neutral", energy: 5, sleep: 7, stress: 5, activities: [] });
    setEditingEntry(null);
    setShowForm(false);
  }, []);

  // Memoized values for performance
  const averageMood = useMemo(() => getAverageMood(), [getAverageMood]);
  const currentStreak = useMemo(() => getCurrentStreak(), [getCurrentStreak]);
  const moodTrend = useMemo(() => getMoodTrend(), [getMoodTrend]);
  const moodDistribution = useMemo(() => getMoodDistribution(), [getMoodDistribution]);
  const filteredActivities = useMemo(() => getFilteredActivities(), [getFilteredActivities]);
  const selectedActivities = useMemo(() => getSelectedActivities(), [getSelectedActivities]);

  return (
    <div className="space-y-8">
      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 success-message z-50">
          Entry saved successfully! 🎉
        </div>
      )}

      {/* Greeting and Emojis */}
      <div className="text-center fade-in">
        <h1 className="text-4xl font-extrabold mb-2 drop-shadow-lg">MindMonitor</h1>
        <p className="text-lg text-gray-600 mb-2 italic">&quot;Every day is a fresh start. Track your journey.&quot;</p>
        <div className="flex justify-center gap-2 mt-2">
          {MOOD_EMOJIS.map((mood, idx) => (
            <span key={idx} className="flex flex-col items-center">
              {mood.icon}
              <span className="text-xs text-gray-500">{mood.label}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 slide-up">
        <Card className="text-center p-6 hover-lift">
          <h3 className="text-lg font-semibold text-gray-700">Total Entries</h3>
          <p className="text-3xl font-bold text-blue-600">{entries.length}</p>
        </Card>
        <Card className="text-center p-6 hover-lift">
          <h3 className="text-lg font-semibold text-gray-700">Average Mood</h3>
          <p className="text-3xl font-bold text-green-600 flex items-center justify-center gap-2">
            {averageMood}/10 {getMoodEmoji(Number(averageMood))}
          </p>
        </Card>
        <Card className="text-center p-6 hover-lift">
          <h3 className="text-lg font-semibold text-gray-700">Current Streak</h3>
          <p className="text-3xl font-bold text-purple-600">{currentStreak}</p>
        </Card>
        <Card className="text-center p-6 hover-lift">
          <h3 className="text-lg font-semibold text-gray-700">Days Tracked</h3>
          <p className="text-3xl font-bold text-orange-600">
            {new Set(entries.map((e) => e.date)).size}
          </p>
        </Card>
      </div>


      {/* Add Entry Button */}
      <div className="text-center">
        <Button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary text-lg px-8 py-3"
          variant="default"
          size="lg"
        >
          {showForm ? "Cancel" : editingEntry ? "Editing Entry..." : "Add Today's Entry"}
        </Button>
      </div>

      {/* Journal AI Prompt */}
      <Card className="max-w-xl mx-auto my-8 p-6">
        <h2 className="text-xl font-bold mb-2">Journal AI</h2>
        <p className="text-gray-600 mb-4">How do you feel today? Write a short message and get an AI-powered response.</p>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setJournalLoading(true);
            setJournalReply("");
            try {
              // Replace this URL with your actual n8n webhook endpoint
              const n8nUrl = "https://your-n8n-instance.com/webhook/ai-journal";
              const res = await fetch(n8nUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: journalPrompt })
              });
              const data = await res.json();
              setJournalReply(data.reply || "No reply received.");
            } catch (err) {
              setJournalReply("Error connecting to AI workflow.");
            } finally {
              setJournalLoading(false);
            }
          }}
        >
          <textarea
            className="w-full border rounded p-2 mb-2"
            rows={3}
            placeholder="Type how you feel..."
            value={journalPrompt}
            onChange={e => setJournalPrompt(e.target.value)}
            required
          />
          <Button type="submit" className="btn-primary" disabled={journalLoading || !journalPrompt.trim()}>
            {journalLoading ? "Thinking..." : "Get AI Recommendation"}
          </Button>
        </form>
        {journalReply && (
          <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200 text-blue-900">
            <strong>AI Reply:</strong>
            <div className="mt-1 whitespace-pre-line">{journalReply}</div>
          </div>
        )}
      </Card>

      {/* Entry Form */}
      {showForm && (
        <Card className="slide-up">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              {editingEntry ? "Edit Entry" : "Today's Mental Health Check-in"}
            </h2>
            {editingEntry && (
              <Button
                onClick={resetForm}
                variant="outline"
                size="sm"
                className="text-red-600 hover:text-red-700"
              >
                Cancel Edit
              </Button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mood (1-10) *
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={currentEntry.mood || 5}
                onChange={(e) => setCurrentEntry({...currentEntry, mood: parseInt(e.target.value)})}
                className="input-range w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Very Low</span>
                <span>Very High</span>
              </div>
              <p className="text-center font-semibold mt-2">{currentEntry.mood || 5}/10</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mood Type *
              </label>
              <div className="grid grid-cols-4 gap-2">
                {MOOD_TYPES.map(moodType => (
                  <button
                    key={moodType.value}
                    onClick={() => setCurrentEntry({...currentEntry, moodType: moodType.value})}
                    className={`p-2 rounded-lg text-sm font-medium transition-all duration-200 border-2 ${
                      currentEntry.moodType === moodType.value
                        ? 'border-blue-500 bg-blue-50 shadow-md'
                        : 'border-gray-200 bg-white hover:bg-gray-50'
                    }`}
                    style={{ borderColor: currentEntry.moodType === moodType.value ? moodType.color : undefined }}
                  >
                    <div className="text-lg mb-1">{moodType.emoji}</div>
                    <div className="text-xs">{moodType.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Energy Level (1-10)
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={currentEntry.energy || 5}
                onChange={(e) => setCurrentEntry({...currentEntry, energy: parseInt(e.target.value)})}
                className="input-range w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Very Low</span>
                <span>Very High</span>
              </div>
              <p className="text-center font-semibold mt-2">{currentEntry.energy || 5}/10</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sleep Hours
              </label>
              <input
                type="range"
                min="0"
                max="12"
                step="0.5"
                value={currentEntry.sleep || 7}
                onChange={(e) => setCurrentEntry({...currentEntry, sleep: parseFloat(e.target.value)})}
                className="input-range w-full"
              />
              <p className="text-center font-semibold mt-2">{currentEntry.sleep || 7} hours</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stress Level (1-10)
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={currentEntry.stress || 5}
                onChange={(e) => setCurrentEntry({...currentEntry, stress: parseInt(e.target.value)})}
                className="input-range w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Very Low</span>
                <span>Very High</span>
              </div>
              <p className="text-center font-semibold mt-2">{currentEntry.stress || 5}/10</p>
            </div>
          </div>

          {/* Enhanced Activities Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <label className="block text-lg font-semibold text-gray-800">
                Activities Today
              </label>
              <span className="text-sm text-gray-500">
                {currentEntry.activities?.length || 0} selected
              </span>
            </div>

            {/* Selected Activities Preview */}
            {selectedActivities.length > 0 && (
              <div className="mb-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                <h4 className="text-sm font-semibold text-blue-800 mb-2">Selected Activities:</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedActivities.map(activity => (
                    <span
                      key={activity.id}
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border-2 ${
                        activity.impact === 'positive' ? 'activity-positive' :
                        activity.impact === 'negative' ? 'activity-negative' :
                        'activity-neutral'
                      }`}
                    >
                      {activity.icon}
                      {activity.name}
                      <button
                        onClick={() => toggleActivity(activity.id)}
                        className="ml-1 hover:bg-red-100 rounded-full p-0.5 transition-colors"
                        aria-label={`Remove ${activity.name}`}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Category Filter */}
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
                      selectedCategory === category.id
                        ? category.color + ' ring-2 ring-blue-300'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Activities Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {filteredActivities.map(activity => {
                const isSelected = currentEntry.activities?.includes(activity.id);
                const colors = getActivityColor(activity.freshness);
                return (
                  <button
                    key={activity.id}
                    onClick={() => toggleActivity(activity.id)}
                    className={`group relative p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                      isSelected ? 'shadow-lg' : 'hover:shadow-md'
                    }`}
                    style={{
                      backgroundColor: isSelected ? colors.bg : 'white',
                      borderColor: isSelected ? colors.border : '#e5e7eb',
                    }}
                    title={`${activity.description} (Freshness: ${activity.freshness}/10)`}
                  >
                    {/* Selection Indicator */}
                    {isSelected && (
                      <div 
                        className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                        style={{ backgroundColor: colors.border }}
                      >
                        ✓
                      </div>
                    )}

                    {/* Activity Icon */}
                    <div 
                      className="text-2xl mb-2 transition-colors"
                      style={{ color: isSelected ? colors.text : '#6b7280' }}
                    >
                      {activity.icon}
                    </div>

                    {/* Activity Name */}
                    <div 
                      className="text-sm font-medium transition-colors"
                      style={{ color: isSelected ? colors.text : '#374151' }}
                    >
                      {activity.name}
                    </div>

                    {/* Freshness Indicator */}
                    <div className="absolute bottom-1 right-1 flex items-center gap-1">
                      <div 
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: colors.border }}
                      />
                      <span className="text-xs text-gray-500">{activity.freshness}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Quick Add Suggestions */}
            <div className="mt-4 p-4 bg-gray-50 rounded-xl">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Quick Add Common Activities:</h4>
              <div className="flex flex-wrap gap-2">
                {['Exercise', 'Meditation', 'Socializing', 'Reading', 'Work'].map(activityName => {
                  const activity = activities.find(a => a.name === activityName);
                  if (!activity || currentEntry.activities?.includes(activity.id)) return null;
                  return (
                    <button
                      key={activity.id}
                      onClick={() => toggleActivity(activity.id)}
                      className="px-3 py-1 bg-white border border-gray-200 rounded-full text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      + {activity.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="text-center">
            <Button 
              onClick={saveEntry} 
              className="btn-primary"
              variant="default"
              size="lg"
              disabled={!currentEntry.mood || !currentEntry.moodType}
            >
              {editingEntry ? "Update Entry" : "Save Entry"}
            </Button>
          </div>
        </Card>
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Mood Trend Chart */}
        <Card className="hover-lift">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Mood Trend</h3>
            <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">7 days</SelectItem>
                <SelectItem value="14">14 days</SelectItem>
                <SelectItem value="30">30 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={moodTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-primary)" />
              <XAxis dataKey="date" stroke="var(--text-secondary)" />
              <YAxis domain={[0, 10]} stroke="var(--text-secondary)" />
              <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="card p-3">
                        <p className="font-semibold">{label}</p>
                        <p className="text-sm text-gray-600">Time: {data.time}</p>
                        <p className="text-sm">Mood: {data.mood}/10</p>
                        <p className="text-sm">Energy: {data.energy}/10</p>
                        <p className="text-sm">Stress: {data.stress}/10</p>
                        <p className="text-sm">Type: {data.moodType}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line type="monotone" dataKey="mood" stroke="var(--accent-primary)" strokeWidth={3} />
              <Line type="monotone" dataKey="energy" stroke="var(--accent-secondary)" strokeWidth={3} />
              <Line type="monotone" dataKey="stress" stroke="var(--accent-tertiary)" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Mood Distribution */}
        <Card className="hover-lift">
          <h3 className="text-xl font-semibold mb-4">Mood Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={moodDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentage }) => `${name} (${percentage}%)`}
                outerRadius={80}
                fill="var(--accent-primary)"
                dataKey="value"
              >
                {moodDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="card p-3">
                        <p className="font-semibold">{data.name}</p>
                        <p className="text-sm text-gray-600">{data.description}</p>
                        <p className="text-sm">Count: {data.value} entries</p>
                        <p className="text-sm">Percentage: {data.percentage}%</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Recent Entries or Empty State */}
      {entries.length === 0 ? (
        <Card className="text-center py-16">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mb-4 mx-auto">
            <FaSmile className="text-4xl text-blue-400" />
          </div>
          <p className="text-lg text-gray-500">No entries yet. Start by adding your first check-in!</p>
        </Card>
      ) : (
        <Card className="hover:shadow-lg transition-shadow">
          <h3 className="text-xl font-semibold mb-4">Recent Entries</h3>
          <div className="space-y-4">
            {entries.slice(-5).reverse().map(entry => (
              <div key={entry.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium">{new Date(entry.date).toLocaleDateString()}</p>
                      <span className="text-xs text-gray-500">
                        {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm text-gray-600">
                        Mood: {entry.mood}/10
                      </span>
                      <span className="text-sm">
                        {MOOD_TYPES.find(mt => mt.value === entry.moodType)?.emoji} {entry.moodType}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Energy: {entry.energy}/10 | Sleep: {entry.sleep}h | Stress: {entry.stress}/10
                    </p>
                    
                    <div className="flex gap-1 flex-wrap mt-2">
                      {entry.activities.map(activityId => {
                        const activity = activities.find(a => a.id === activityId);
                        return activity ? (
                          <span
                            key={activityId}
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                              activity.impact === 'positive' ? 'activity-positive' :
                              activity.impact === 'negative' ? 'activity-negative' :
                              'activity-neutral'
                            }`}
                          >
                            {activity.icon}
                            {activity.name}
                          </span>
                        ) : null;
                      })}
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => editEntry(entry)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit entry"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => deleteEntry(entry.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete entry"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Insights */}
      {entries.length > 0 && (
        <Card className="hover:shadow-lg transition-shadow">
          <h3 className="text-xl font-semibold mb-4">Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Alert>
              <AlertDescription>
                <strong>Average Mood:</strong> {averageMood}/10
                {parseFloat(averageMood) >= 7 && " - Great! You're doing well!"}
                {parseFloat(averageMood) < 5 && " - Consider talking to someone or seeking support."}
              </AlertDescription>
            </Alert>
            <Alert>
              <AlertDescription>
                <strong>Tracking Streak:</strong> {currentStreak} days
                {currentStreak >= 7 && " - Excellent consistency!"}
              </AlertDescription>
            </Alert>
          </div>
        </Card>
      )}
    </div>
  );
}