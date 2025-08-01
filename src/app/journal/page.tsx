'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { 
  FaPen, 
  FaSave, 
  FaTrash, 
  FaEdit, 
  FaCalendarAlt,
  FaClock,
  FaHeart,
  FaLightbulb,
  FaBookOpen
} from 'react-icons/fa';

interface JournalEntry {
  id: string;
  date: string;
  timestamp: string;
  title: string;
  content: string;
  mood: number;
  tags: string[];
}

const MOOD_EMOJIS = [
  { value: 1, emoji: "😢", label: "Very Sad" },
  { value: 2, emoji: "😔", label: "Sad" },
  { value: 3, emoji: "😐", label: "Neutral" },
  { value: 4, emoji: "🙂", label: "Okay" },
  { value: 5, emoji: "😊", label: "Happy" },
  { value: 6, emoji: "😄", label: "Very Happy" },
  { value: 7, emoji: "🤩", label: "Excited" },
  { value: 8, emoji: "🥰", label: "Loved" },
  { value: 9, emoji: "😍", label: "Amazing" },
  { value: 10, emoji: "🤗", label: "Perfect" },
];

const SUGGESTED_TAGS = [
  "gratitude", "reflection", "goals", "challenges", "achievements", 
  "relationships", "work", "health", "creativity", "learning"
];

export default function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [currentEntry, setCurrentEntry] = useState<Partial<JournalEntry>>({
    title: '',
    content: '',
    mood: 5,
    tags: [],
  });
  const [editingEntry, setEditingEntry] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string>('all');

  // Load entries from localStorage
  useEffect(() => {
    try {
      const savedEntries = localStorage.getItem("journalEntries");
      if (savedEntries) {
        const parsedEntries = JSON.parse(savedEntries);
        setEntries(parsedEntries);
      }
    } catch (error) {
      console.error("Error loading journal entries:", error);
    }
  }, []);

  // Save entries to localStorage whenever entries change
  useEffect(() => {
    try {
      localStorage.setItem("journalEntries", JSON.stringify(entries));
    } catch (error) {
      console.error("Error saving journal entries:", error);
    }
  }, [entries]);

  const saveEntry = useCallback(() => {
    if (!currentEntry.title?.trim() || !currentEntry.content?.trim()) {
      alert("Please fill in both title and content");
      return;
    }

    const newEntry: JournalEntry = {
      id: editingEntry || Date.now().toString(),
      date: new Date().toISOString().split("T")[0],
      timestamp: new Date().toISOString(),
      title: currentEntry.title.trim(),
      content: currentEntry.content.trim(),
      mood: currentEntry.mood || 5,
      tags: currentEntry.tags || [],
    };

    if (editingEntry) {
      // Update existing entry
      setEntries(prev => prev.map(entry => entry.id === editingEntry ? newEntry : entry));
      setEditingEntry(null);
    } else {
      // Add new entry
      setEntries(prev => [newEntry, ...prev]);
    }

    // Reset form
    setCurrentEntry({ title: '', content: '', mood: 5, tags: [] });
    setShowForm(false);
    
    // Show success message
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  }, [currentEntry, editingEntry]);

  const deleteEntry = useCallback((entryId: string) => {
    if (window.confirm("Are you sure you want to delete this journal entry?")) {
      setEntries(prev => prev.filter(entry => entry.id !== entryId));
    }
  }, []);

  const editEntry = useCallback((entry: JournalEntry) => {
    setCurrentEntry({
      title: entry.title,
      content: entry.content,
      mood: entry.mood,
      tags: entry.tags,
    });
    setEditingEntry(entry.id);
    setShowForm(true);
  }, []);

  const toggleTag = useCallback((tag: string) => {
    setCurrentEntry(prev => {
      const currentTags = prev.tags || [];
      const updatedTags = currentTags.includes(tag)
        ? currentTags.filter(t => t !== tag)
        : [...currentTags, tag];
      return { ...prev, tags: updatedTags };
    });
  }, []);

  const resetForm = useCallback(() => {
    setCurrentEntry({ title: '', content: '', mood: 5, tags: [] });
    setEditingEntry(null);
    setShowForm(false);
  }, []);

  const getFilteredEntries = useCallback(() => {
    if (selectedTag === 'all') return entries;
    return entries.filter(entry => entry.tags.includes(selectedTag));
  }, [entries, selectedTag]);

  const getMoodEmoji = useCallback((mood: number) => {
    const moodData = MOOD_EMOJIS.find(m => m.value === mood);
    return moodData?.emoji || "😐";
  }, []);

  const getMoodLabel = useCallback((mood: number) => {
    const moodData = MOOD_EMOJIS.find(m => m.value === mood);
    return moodData?.label || "Neutral";
  }, []);

  const getAllTags = useCallback(() => {
    const tagSet = new Set<string>();
    entries.forEach(entry => {
      entry.tags.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet);
  }, [entries]);

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8">
      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 success-message z-50">
          Journal entry saved successfully! 📝
        </div>
      )}

      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-extrabold mb-2">Personal Journal</h1>
        <p className="text-lg text-gray-600">Reflect on your thoughts, feelings, and experiences</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="text-center p-6 hover-lift">
          <div className="flex items-center justify-center mb-2">
            <FaBookOpen className="text-3xl text-blue-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700">Total Entries</h3>
          <p className="text-3xl font-bold text-blue-600">{entries.length}</p>
        </Card>
        <Card className="text-center p-6 hover-lift">
          <div className="flex items-center justify-center mb-2">
            <FaCalendarAlt className="text-3xl text-green-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700">Days Journaled</h3>
          <p className="text-3xl font-bold text-green-600">
            {new Set(entries.map(e => e.date)).size}
          </p>
        </Card>
        <Card className="text-center p-6 hover-lift">
          <div className="flex items-center justify-center mb-2">
            <FaHeart className="text-3xl text-red-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700">Average Mood</h3>
          <p className="text-3xl font-bold text-red-600">
            {entries.length > 0 
              ? (entries.reduce((sum, entry) => sum + entry.mood, 0) / entries.length).toFixed(1)
              : "0"
            }/10
          </p>
        </Card>
        <Card className="text-center p-6 hover-lift">
          <div className="flex items-center justify-center mb-2">
            <FaLightbulb className="text-3xl text-yellow-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700">Unique Tags</h3>
          <p className="text-3xl font-bold text-yellow-600">{getAllTags().length}</p>
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
          {showForm ? "Cancel" : editingEntry ? "Editing Entry..." : "Write New Entry"}
        </Button>
      </div>

      {/* Entry Form */}
      {showForm && (
        <Card className="slide-up">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              {editingEntry ? "Edit Journal Entry" : "New Journal Entry"}
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

          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={currentEntry.title || ''}
                onChange={(e) => setCurrentEntry({...currentEntry, title: e.target.value})}
                className="input-field w-full"
                placeholder="What's on your mind today?"
                maxLength={100}
              />
            </div>

            {/* Mood */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                How are you feeling? *
              </label>
              <div className="grid grid-cols-5 gap-2">
                {MOOD_EMOJIS.map(mood => (
                  <button
                    key={mood.value}
                    onClick={() => setCurrentEntry({...currentEntry, mood: mood.value})}
                    className={`p-3 rounded-lg text-center transition-all duration-200 border-2 ${
                      currentEntry.mood === mood.value
                        ? 'border-blue-500 bg-blue-50 shadow-md'
                        : 'border-gray-200 bg-white hover:bg-gray-50'
                    }`}
                  >
                    <div className="text-2xl mb-1">{mood.emoji}</div>
                    <div className="text-xs text-gray-600">{mood.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Thoughts *
              </label>
              <textarea
                value={currentEntry.content || ''}
                onChange={(e) => setCurrentEntry({...currentEntry, content: e.target.value})}
                className="input-field w-full"
                rows={8}
                placeholder="Write about your day, your feelings, your goals, or anything that's on your mind..."
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags (optional)
              </label>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_TAGS.map(tag => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
                      currentEntry.tags?.includes(tag)
                        ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
              {currentEntry.tags && currentEntry.tags.length > 0 && (
                <p className="text-sm text-gray-500 mt-2">
                  Selected: {currentEntry.tags.join(', ')}
                </p>
              )}
            </div>

            <div className="text-center">
              <Button 
                onClick={saveEntry} 
                className="btn-primary"
                variant="default"
                size="lg"
                disabled={!currentEntry.title?.trim() || !currentEntry.content?.trim()}
              >
                {editingEntry ? "Update Entry" : "Save Entry"}
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Tag Filter */}
      {entries.length > 0 && (
        <div className="flex flex-wrap gap-2 justify-center">
          <button
            onClick={() => setSelectedTag('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              selectedTag === 'all'
                ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-300'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All Entries
          </button>
          {getAllTags().map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedTag === tag
                  ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-300'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}

      {/* Journal Entries */}
      {getFilteredEntries().length === 0 ? (
        <Card className="text-center py-16">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mb-4 mx-auto">
            <FaPen className="text-4xl text-blue-400" />
          </div>
          <p className="text-lg text-gray-500">
            {entries.length === 0 
              ? "No journal entries yet. Start writing to reflect on your journey!"
              : "No entries found with the selected tag."
            }
          </p>
        </Card>
      ) : (
        <div className="space-y-6">
          {getFilteredEntries().map(entry => (
            <Card key={entry.id} className="hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-800">{entry.title}</h3>
                    <span className="text-2xl">{getMoodEmoji(entry.mood)}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <div className="flex items-center gap-1">
                      <FaCalendarAlt />
                      {new Date(entry.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <FaClock />
                      {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className="flex items-center gap-1">
                      <FaHeart />
                      {getMoodLabel(entry.mood)}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
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
              
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap">{entry.content}</p>
              </div>

              {entry.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200">
                  {entry.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Writing Prompts */}
      {entries.length === 0 && (
        <Card className="hover:shadow-lg transition-shadow">
          <h2 className="text-2xl font-bold mb-4">Writing Prompts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">Reflection</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• What made you smile today?</li>
                <li>• What's something you're grateful for?</li>
                <li>• What did you learn about yourself?</li>
              </ul>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">Goals & Growth</h3>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• What's your biggest challenge right now?</li>
                <li>• What would you like to improve?</li>
                <li>• What are you looking forward to?</li>
              </ul>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}