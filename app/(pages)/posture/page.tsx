'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as poseDetection from '@tensorflow-models/pose-detection';
import '@tensorflow/tfjs';
import '@mediapipe/pose';
import { postureTemplates, PostureRule } from '@/lib/postureTemplates';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';

type KeypointData = { keypoints: poseDetection.Keypoint[]; score: number };
type Message = { role: 'user' | 'assistant'; content: string };

function calculateAngle(a: any, b: any, c: any): number {
    const ab = { x: a.x - b.x, y: a.y - b.y };
    const cb = { x: c.x - b.x, y: c.y - b.y };
    const dot = ab.x * cb.x + ab.y * cb.y;
    const magAB = Math.sqrt(ab.x ** 2 + ab.y ** 2);
    const magCB = Math.sqrt(cb.x ** 2 + cb.y ** 2);
    return Math.acos(dot / (magAB * magCB)) * (180 / Math.PI);
}

function AiChat({
    postureScore,
    badJoints,
    exerciseName,
}: {
    postureScore: number;
    badJoints: string[];
    exerciseName: string;
}) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const speak = (text: string) => {
        if (!('speechSynthesis' in window)) return;

        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = 1;
        utterance.pitch = 1;
        utterance.volume = 1;

        utterance.onerror = (event) => {
            console.error('SpeechSynthesis error:', event);
        };

        window.speechSynthesis.speak(utterance);
    };

    const sendMessage = async () => {
        if (!input.trim()) return;
        const userMsg: Message = { role: 'user', content: input };
        const newMessages = [...messages, userMsg];
        setMessages(newMessages);
        setInput('');
        setLoading(true);

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: newMessages,
                    postureData: { exercise: exerciseName, score: postureScore, issues: badJoints },
                }),
            });

            const data = await res.json();
            const aiReply: Message = { role: 'assistant', content: data.reply };
            setMessages([...newMessages, aiReply]);
            speak(data.reply);
        } catch (error) {
            const errorReply: Message = { role: 'assistant', content: "Sorry, I couldn't process your request." };
            setMessages([...newMessages, errorReply]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="text-lg">AI Posture Coach</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="h-48 overflow-y-auto p-2 rounded-lg bg-muted">
                    {messages.length === 0 ? (
                        <p className="text-muted-foreground text-center py-4">
                            Ask your AI coach for posture advice...
                        </p>
                    ) : (
                        messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`mb-2 p-2 rounded-lg ${msg.role === 'user'
                                    ? 'bg-primary text-primary-foreground ml-auto max-w-xs'
                                    : 'bg-secondary text-secondary-foreground mr-auto max-w-xs'
                                    }`}
                            >
                                <strong>{msg.role === 'user' ? 'You:' : 'Coach:'}</strong> {msg.content}
                            </div>
                        ))
                    )}
                    <div ref={messagesEndRef} />
                </div>
                <div className="flex gap-2">
                    <Input
                        placeholder="Ask your AI coach..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                        disabled={loading}
                    />
                    <Button onClick={sendMessage} disabled={loading || !input.trim()}>
                        {loading ? 'Thinking...' : 'Send'}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

export default function PostureChecker() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [category, setCategory] = useState('Strength');
    const [exercises, setExercises] = useState<PostureRule[]>([]);
    const [selectedPosture, setSelectedPosture] = useState<PostureRule | null>(null);
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState('');
    const [badJoints, setBadJoints] = useState<string[]>([]);
    const animationFrameId = useRef<number>();
    const [recording, setRecording] = useState(false);
    const [recordedFrames, setRecordedFrames] = useState<KeypointData[]>([]);
    const playbackIndex = useRef(0);
    const [playingBack, setPlayingBack] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);

    // Update exercise list by category
    useEffect(() => {
        const filtered = postureTemplates.filter((p) => p.category === category);
        setExercises(filtered);
        setSelectedPosture(filtered[0] || null);
        setRecordedFrames([]);
        setScore(0);
        setFeedback('');
        setBadJoints([]);
    }, [category]);

    const speak = (text: string) => {
        if (!('speechSynthesis' in window)) return;

        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = 0.9;
        utterance.pitch = 1;

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = (e) => {
            console.error('Speech error:', e);
            setIsSpeaking(false);
        };

        window.speechSynthesis.speak(utterance);
    };

    useEffect(() => {
        return () => {
            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
            }
        };
    }, []);

    useEffect(() => {
        if (!selectedPosture) return;
        let detector: poseDetection.PoseDetector;
        let video: HTMLVideoElement;

        const init = async () => {
            video = videoRef.current!;
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { width: 1280, height: 720 }
                });
                video.srcObject = stream;

                detector = await poseDetection.createDetector(
                    poseDetection.SupportedModels.MoveNet,
                    { modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING }
                );

                const canvas = canvasRef.current!;
                const ctx = canvas.getContext('2d')!;

                const detectPose = async () => {
                    if (!video || video.readyState < 2) {
                        animationFrameId.current = requestAnimationFrame(detectPose);
                        return;
                    }

                    if (playingBack) {
                        if (playbackIndex.current < recordedFrames.length) {
                            const frame = recordedFrames[playbackIndex.current];
                            ctx.clearRect(0, 0, canvas.width, canvas.height);
                            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                            ctx.fillStyle = 'blue';
                            frame.keypoints.forEach((kp) => {
                                if (kp.score && kp.score > 0.4) {
                                    ctx.beginPath();
                                    ctx.arc(kp.x, kp.y, 5, 0, 2 * Math.PI);
                                    ctx.fill();
                                }
                            });
                            ctx.fillStyle = frame.score >= 80 ? 'green' : 'red';
                            ctx.font = '24px Arial';
                            ctx.fillText(`${selectedPosture?.name || 'Exercise'}: ${frame.score}%`, 50, 50);
                            setScore(frame.score);
                            playbackIndex.current++;
                            animationFrameId.current = requestAnimationFrame(detectPose);
                        } else {
                            setPlayingBack(false);
                            setFeedback('Playback ended');
                        }
                        return;
                    }

                    const poses = await detector.estimatePoses(video);
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

                    if (poses.length > 0) {
                        const keypoints: Record<string, poseDetection.Keypoint> = {};
                        poses[0].keypoints.forEach((p) => {
                            if (p.name) keypoints[p.name] = p;
                        });

                        let totalScore = 0;
                        let checks = 0;
                        let bad: string[] = [];

                        selectedPosture.joints.forEach((joint) => {
                            const [a, b, c] = joint.points.map(
                                (p) => keypoints[`left_${p}`] || keypoints[`right_${p}`]
                            );
                            if (a && b && c && a.score && b.score && c.score &&
                                a.score > 0.4 && b.score > 0.4 && c.score > 0.4) {
                                const angle = calculateAngle(a, b, c);
                                if (angle >= joint.min && angle <= joint.max) {
                                    totalScore++;
                                } else {
                                    bad.push(joint.name);
                                }
                                checks++;
                            }
                        });

                        const postureScore = checks > 0 ? Math.round((totalScore / checks) * 100) : 0;
                        setScore(postureScore);
                        setBadJoints(bad);

                        let feedbackMsg =
                            postureScore >= 80
                                ? 'Great job! Your posture looks good.'
                                : bad.length > 0
                                    ? `Pay attention to your ${bad.join(', ')}. Adjust them.`
                                    : 'Posture not detected properly.';
                        setFeedback(feedbackMsg);

                        if (postureScore !== score && !isSpeaking) {
                            speak(feedbackMsg);
                        }

                        ctx.fillStyle = postureScore >= 80 ? 'green' : 'red';
                        ctx.font = '24px Arial';
                        ctx.fillText(`${selectedPosture.name}: ${postureScore}%`, 50, 50);

                        ctx.fillStyle = 'blue';
                        poses[0].keypoints.forEach((kp) => {
                            if (kp.score && kp.score > 0.4) {
                                ctx.beginPath();
                                ctx.arc(kp.x, kp.y, 5, 0, 2 * Math.PI);
                                ctx.fill();
                            }
                        });

                        if (recording) {
                            setRecordedFrames((prev) => [...prev, {
                                keypoints: poses[0].keypoints,
                                score: postureScore
                            }]);
                        }
                    }

                    animationFrameId.current = requestAnimationFrame(detectPose);
                };
                detectPose();
            } catch (error) {
                console.error('Error initializing pose detection:', error);
                setFeedback('Error accessing camera or pose detection');
            }
        };

        init();
        return () => {
            if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
            if (videoRef.current?.srcObject) {
                const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
                tracks.forEach((track) => track.stop());
                videoRef.current.srcObject = null;
            }
        };
    }, [selectedPosture, recording, playingBack, recordedFrames, score, isSpeaking]);

    const startRecording = () => {
        setRecordedFrames([]);
        setRecording(true);
        setPlayingBack(false);
        speak('Recording started');
    };

    const stopRecording = () => {
        setRecording(false);
        speak('Recording stopped');
    };

    const startPlayback = () => {
        if (recordedFrames.length === 0) {
            speak('No recording found');
            return;
        }
        playbackIndex.current = 0;
        setPlayingBack(true);
        speak('Playing back your session');
    };

    return (
        <div className="min-h-screen w-full max-w-full p-4 flex flex-col bg-background text-foreground">
            <Card className="w-full max-w-7xl mx-auto flex-1 flex flex-col">
                <CardHeader>
                    <CardTitle className="text-2xl md:text-3xl">Posture Checker</CardTitle>
                </CardHeader>

                <CardContent className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left column - Controls and Info */}
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Category</Label>
                                <Select value={category} onValueChange={setCategory}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Array.from(new Set(postureTemplates.map(p => p.category))).map(cat => (
                                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Exercise</Label>
                                <Select
                                    value={selectedPosture?.name || ''}
                                    onValueChange={(value) => {
                                        const sel = exercises.find(ex => ex.name === value);
                                        if (sel) setSelectedPosture(sel);
                                        setScore(0);
                                        setFeedback('');
                                    }}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select exercise" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {exercises.map(ex => (
                                            <SelectItem key={ex.name} value={ex.name}>{ex.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <Label>Posture Score</Label>
                                <Progress value={score} className="h-4 mt-2" />
                                <p className="text-center font-medium mt-2">{score}%</p>
                            </div>

                            <div>
                                <Label>Feedback</Label>
                                <div className="p-4 rounded-lg bg-muted mt-2">
                                    <p className="text-center">{feedback}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <Button
                                onClick={startRecording}
                                disabled={recording || playingBack}
                                variant={recording ? 'default' : 'outline'}
                                className={recording ? 'bg-red-600 hover:bg-red-700 text-white' : ''}
                            >
                                {recording ? 'Recording...' : 'Start Recording'}
                            </Button>

                            <Button
                                onClick={stopRecording}
                                disabled={!recording}
                                variant="outline"
                            >
                                Stop Recording
                            </Button>

                            <Button
                                onClick={startPlayback}
                                disabled={playingBack || recordedFrames.length === 0}
                                variant={playingBack ? 'default' : 'outline'}
                                className={playingBack ? 'bg-blue-600 hover:bg-blue-700 text-white' : ''}
                            >
                                {playingBack ? 'Playing...' : 'Playback'}
                            </Button>
                        </div>
                    </div>

                    {/* Right column - Video and AI Chat */}
                    <div className="space-y-6">
                        <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                            <video ref={videoRef} className="hidden" autoPlay playsInline muted />
                            <canvas
                                ref={canvasRef}
                                width={1280}
                                height={720}
                                className="w-full h-full object-contain"
                            />
                            {selectedPosture && (
                                <div className="absolute bottom-2 left-2 bg-background/80 px-2 py-1 rounded">
                                    <p className="font-medium">{selectedPosture.name}</p>
                                </div>
                            )}
                        </div>

                        <AiChat
                            postureScore={score}
                            badJoints={badJoints}
                            exerciseName={selectedPosture?.name || ''}
                        />
                    </div>
                </CardContent>

                <CardFooter className="text-sm text-muted-foreground">
                    <p>Adjust your posture according to the feedback for better results</p>
                </CardFooter>
            </Card>
        </div>
    );
}