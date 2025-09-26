"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "../lib/hooks/useAuth";
import SignInWithGoogle from "../components/SignInWithGoogle";
import VoiceRecorder from "../components/VoiceRecorder";
import { getDocuments } from "../lib/firebase/firebaseUtils";
import { isFirebaseConfigured } from "../lib/firebase/firebase";

interface VoiceNote {
    id: string;
    text: string;
    timestamp: string;
}

export default function Home() {
    const { user, loading } = useAuth();
    const [notes, setNotes] = useState<VoiceNote[]>([]);
    const [notesLoading, setNotesLoading] = useState(false);

    const loadNotes = async () => {
        if (!user) return;
        setNotesLoading(true);
        try {
            const userNotes = await getDocuments('notes');
            setNotes(userNotes);
        } catch (error) {
            console.error('Error loading notes:', error);
        } finally {
            setNotesLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            loadNotes();
        }
    }, [user]);

    if (loading) {
        return (
            <main className="flex min-h-screen flex-col items-center justify-center p-8">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
                <p className="mt-4 text-gray-600">Loading...</p>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        Voice-to-Text App
                    </h1>
                    <p className="text-gray-600">
                        Record your voice and convert it to text in real-time
                    </p>
                    {!isFirebaseConfigured && (
                        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <p className="text-yellow-800 font-medium">Demo Mode</p>
                            <p className="text-yellow-700 text-sm">
                                Firebase is not configured. Authentication and data persistence are disabled.
                                Voice recording will still work for demonstration purposes.
                            </p>
                        </div>
                    )}
                </div>

                {/* Authentication Section */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h2 className="text-2xl font-semibold mb-4">Authentication</h2>
                    {!isFirebaseConfigured ? (
                        <div className="text-center">
                            <p className="text-gray-600 mb-4">Authentication is disabled in demo mode</p>
                            <div className="p-4 bg-gray-100 rounded-lg">
                                <p className="text-sm text-gray-600">
                                    To enable authentication, configure Firebase environment variables:
                                </p>
                                <code className="text-xs text-gray-800 block mt-2 p-2 bg-white rounded">
                                    NEXT_PUBLIC_FIREBASE_API_KEY, NEXT_PUBLIC_FIREBASE_PROJECT_ID, etc.
                                </code>
                            </div>
                        </div>
                    ) : user ? (
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <img
                                    src={user.photoURL || ''}
                                    alt="Profile"
                                    className="w-10 h-10 rounded-full"
                                />
                                <div>
                                    <p className="font-medium">{user.displayName}</p>
                                    <p className="text-sm text-gray-500">{user.email}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => window.location.reload()}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                            >
                                Sign Out
                            </button>
                        </div>
                    ) : (
                        <div className="text-center">
                            <p className="text-gray-600 mb-4">Sign in to save your voice notes</p>
                            <SignInWithGoogle />
                        </div>
                    )}
                </div>

                {/* Voice Recording Section */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h2 className="text-2xl font-semibold mb-4">Voice Recording</h2>
                    <p className="text-gray-600 mb-6">
                        Click the button below to start recording. Your speech will be converted to text in real-time.
                    </p>
                    <VoiceRecorder />
                </div>

                {/* Notes Display Section */}
                {(user || !isFirebaseConfigured) && (
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-semibold">
                                {!isFirebaseConfigured ? 'Demo Voice Notes' : 'Your Voice Notes'}
                            </h2>
                            <button
                                onClick={loadNotes}
                                disabled={notesLoading}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
                            >
                                {notesLoading ? 'Loading...' : 'Refresh'}
                            </button>
                        </div>

                        {notesLoading ? (
                            <div className="text-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                                <p className="mt-2 text-gray-600">Loading notes...</p>
                            </div>
                        ) : notes.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <p>
                                    {!isFirebaseConfigured
                                        ? 'No demo notes yet. Start recording to see them here!'
                                        : 'No voice notes yet. Start recording to see them here!'
                                    }
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {notes.map((note: VoiceNote, index: number) => (
                                    <div key={note.id || index} className="border rounded-lg p-4 bg-gray-50">
                                        <div className="flex justify-between items-start mb-2">
                                            <p className="text-sm text-gray-500">
                                                {new Date(note.timestamp).toLocaleString()}
                                            </p>
                                        </div>
                                        <p className="text-gray-800">{note.text}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Features Info */}
                <div className="mt-8 bg-blue-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-blue-900 mb-3">Features Included</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
                        <div className="flex items-center space-x-2">
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            <span>Real-time voice transcription with Deepgram</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className={`w-2 h-2 rounded-full ${isFirebaseConfigured ? 'bg-blue-500' : 'bg-gray-400'}`}></span>
                            <span className={isFirebaseConfigured ? 'text-blue-800' : 'text-gray-600'}>
                                Google authentication with Firebase {!isFirebaseConfigured && '(Demo Mode)'}
                            </span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className={`w-2 h-2 rounded-full ${isFirebaseConfigured ? 'bg-blue-500' : 'bg-gray-400'}`}></span>
                            <span className={isFirebaseConfigured ? 'text-blue-800' : 'text-gray-600'}>
                                Automatic note saving to Firestore {!isFirebaseConfigured && '(Demo Mode)'}
                            </span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            <span>Responsive design with Tailwind CSS</span>
                        </div>
                    </div>
                    {!isFirebaseConfigured && (
                        <div className="mt-4 p-3 bg-yellow-100 rounded-lg">
                            <p className="text-yellow-800 text-sm">
                                <strong>Note:</strong> To enable full functionality, configure Firebase environment variables
                                and Deepgram API key in your .env.local file.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
