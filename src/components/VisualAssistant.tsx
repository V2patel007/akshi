import { useState, useEffect, useRef } from 'react';
import { Mic, Camera, Volume2, VolumeX, MicOff, Play, Pause } from 'lucide-react';

// Use environment variable for the API key
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

// TypeScript interfaces for Speech Recognition
interface SpeechRecognitionEvent {
    results: {
        [index: number]: {
            [index: number]: {
                transcript: string;
                confidence: number;
            };
        };
    };
}

interface SpeechRecognitionErrorEvent {
    error: string;
}

interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    maxAlternatives: number;
    start(): void;
    stop(): void;
    onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
    onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
    onend: ((this: SpeechRecognition, ev: Event) => any) | null;
    onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
}

declare global {
    interface Window {
        SpeechRecognition: {
            new(): SpeechRecognition;
        };
        webkitSpeechRecognition: {
            new(): SpeechRecognition;
        };
    }
}

function VisualAssistant() {
    // Core states
    const [isListening, setIsListening] = useState(false);
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [assistantResponse, setAssistantResponse] = useState('');
    const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [speechEnabled, setSpeechEnabled] = useState(true);
    const [currentQuestion, setCurrentQuestion] = useState('');
    const [error, setError] = useState<string | null>(null);
    
    // Refs
    const videoRef = useRef<HTMLVideoElement>(null);
    const recognitionRef = useRef<any>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
    const speechTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Check browser support
    const hasSpeechRecognition = !!(window.SpeechRecognition || (window as any).webkitSpeechRecognition);
    const hasSpeechSynthesis = !!window.speechSynthesis;

    const captureImage = (): string | null => {
        if (!videoRef.current || !canvasRef.current) {
            console.log('Video or canvas ref not available');
            return null;
        }

        const video = videoRef.current;
        const canvas = canvasRef.current;

        console.log('Video ready state:', video.readyState);
        console.log('Video dimensions:', video.videoWidth, 'x', video.videoHeight);

        if (video.readyState < 2) {
            console.log('Video not ready yet');
            return null;
        }

        if (video.videoWidth === 0 || video.videoHeight === 0) {
            console.log('Video has no dimensions');
            return null;
        }

        const context = canvas.getContext('2d');
        if (!context) {
            console.log('Cannot get canvas context');
            return null;
        }

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        console.log('Image captured successfully');
        return dataUrl;
    };

    const analyzeImageWithOpenAI = async (imageDataUrl: string, question: string): Promise<string> => {
        if (!OPENAI_API_KEY) {
            return `I would analyze the image and answer: "${question}". However, the OpenAI API key is not configured. To enable real AI vision analysis, please configure your VITE_OPENAI_API_KEY environment variable.`;
        }

        try {
            const requestBody = {
                model: "gpt-4o",
                messages: [
                    {
                        role: "user",
                        content: [
                            {
                                type: "text",
                                text: `You are a visual assistant helping users understand what they see. Analyze this image and answer the question: "${question}"

Please provide a clear, detailed, and helpful response. Focus on:
- Being descriptive and specific about what you observe
- Answering the user's question directly
- Including relevant details about colors, objects, people, text, or scenes
- Keeping the response conversational and accessible
- If there's text in the image, read it accurately
- If asked about safety or navigation, provide practical guidance

Keep your response under 200 words but be thorough and helpful.`
                            },
                            {
                                type: "image_url",
                                image_url: {
                                    url: imageDataUrl,
                                    detail: "low"
                                },
                            },
                        ],
                    },
                ],
                max_tokens: 1024,
            };

            const response = await fetch(OPENAI_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${OPENAI_API_KEY}`,
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`API request failed: ${response.status} - ${errorData?.error?.message || response.statusText}`);
            }

            const data = await response.json();

            if (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
                return data.choices[0].message.content;
            } else {
                throw new Error('Invalid response from AI service');
            }
        } catch (error) {
            console.error('OpenAI API Error:', error);
            throw error;
        }
    };

    const speak = (text: string, onEndCallback?: () => void) => {
        if (!speechEnabled || !hasSpeechSynthesis || !text.trim()) {
            if (onEndCallback) onEndCallback();
            return;
        }

        stopSpeaking();

        if (speechTimeoutRef.current) {
            clearTimeout(speechTimeoutRef.current);
        }

        try {
            const utterance = new SpeechSynthesisUtterance(text.trim());
            utteranceRef.current = utterance;

            utterance.rate = 0.85;
            utterance.pitch = 1.0;
            utterance.volume = 0.9;
            utterance.lang = 'en-US';

            const voices = window.speechSynthesis.getVoices();
            if (voices.length > 0) {
                const preferredVoice = voices.find(voice =>
                    voice.lang.startsWith('en') &&
                    (voice.name.includes('Google') || voice.name.includes('Microsoft') || voice.name.includes('Natural'))
                ) || voices.find(voice => voice.lang.startsWith('en'));

                if (preferredVoice) {
                    utterance.voice = preferredVoice;
                }
            }

            utterance.onstart = () => setIsSpeaking(true);
            utterance.onend = () => {
                setIsSpeaking(false);
                utteranceRef.current = null;
                if (onEndCallback) onEndCallback();
            };
            utterance.onerror = () => {
                setIsSpeaking(false);
                utteranceRef.current = null;
                if (onEndCallback) onEndCallback();
            };

            window.speechSynthesis.speak(utterance);
        } catch (error) {
            console.error('Error in speak function:', error);
            setIsSpeaking(false);
            if (onEndCallback) onEndCallback();
        }
    };

    const stopSpeaking = () => {
        try {
            if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
                window.speechSynthesis.cancel();
            }
            if (speechTimeoutRef.current) {
                clearTimeout(speechTimeoutRef.current);
            }
            setIsSpeaking(false);
            utteranceRef.current = null;
        } catch (error) {
            console.error('Error stopping speech:', error);
        }
    };

    const processQuestion = async (question: string) => {
        console.log('Processing question:', question);
        console.log('Camera active state:', isCameraActive);
        console.log('Media stream:', mediaStream);
        console.log('Video element ready state:', videoRef.current?.readyState);
        console.log('Video src object:', videoRef.current?.srcObject);
        
        // Check if video element has a source (more reliable check)
        if (!videoRef.current || !videoRef.current.srcObject) {
            const message = 'Camera is not active. Please turn on the camera first.';
            setError(message);
            speak(message);
            setIsProcessing(false);
            return;
        }

        // Wait a bit for video to be ready if needed
        let retries = 0;
        while (videoRef.current.readyState < 2 && retries < 10) {
            console.log(`Waiting for video to be ready... attempt ${retries + 1}`);
            await new Promise(resolve => setTimeout(resolve, 200));
            retries++;
        }

        if (videoRef.current.readyState < 2) {
            const message = 'Camera is not ready yet. Please wait a moment and try again.';
            setError(message);
            speak(message);
            setIsProcessing(false);
            return;
        }

        try {
            const imageDataUrl = captureImage();
            if (!imageDataUrl) {
                const message = 'Unable to capture image. Please ensure the camera is working properly.';
                setError(message);
                speak(message);
                setIsProcessing(false);
                return;
            }

            setCapturedImage(imageDataUrl);
            const response = await analyzeImageWithOpenAI(imageDataUrl, question);
            
            setAssistantResponse(response);
            setError(null);
            speak(response, () => setIsProcessing(false));
        } catch (error: any) {
            console.error('Error processing question:', error);
            const errorMessage = error.message || 'Sorry, I encountered an error analyzing the image. Please try again.';
            setError(errorMessage);
            setAssistantResponse(errorMessage);
            speak(errorMessage, () => setIsProcessing(false));
        }
    };

    const startListening = async () => {
        if (!hasSpeechRecognition) {
            const message = 'Speech recognition is not supported in this browser. Please try Chrome or Edge.';
            setError(message);
            speak(message);
            return;
        }

        // Check if video has a source (most reliable check)
        if (!videoRef.current || !videoRef.current.srcObject) {
            const message = 'Please turn on the camera first.';
            setError(message);
            speak(message);
            return;
        }

        if (isListening || isProcessing) {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
            setIsListening(false);
            setIsProcessing(false);
            return;
        }
        
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            stream.getTracks().forEach(track => track.stop());
        } catch (error) {
            const errorMessage = 'Microphone access denied. Please allow microphone permissions and try again.';
            setError(errorMessage);
            speak(errorMessage);
            return;
        }
        
        setIsProcessing(true);
        setCurrentQuestion('');
        setAssistantResponse('');
        setError(null);

        speak('I\'m listening. Please ask your question about what I see.', () => {
            if (recognitionRef.current && !isListening) {
                try {
                    recognitionRef.current.start();
                } catch (error) {
                    console.error('Error starting recognition:', error);
                    const message = 'Unable to start voice recognition. Please try again.';
                    setError(message);
                    speak(message);
                    setIsProcessing(false);
                }
            }
        });
    };

    const toggleCamera = async () => {
        if (isCameraActive) {
            // Stop camera
            if (mediaStream) {
                mediaStream.getTracks().forEach(track => track.stop());
            }
            if (videoRef.current) {
                videoRef.current.srcObject = null;
            }
            setMediaStream(null);
            setIsCameraActive(false);
            setCapturedImage(null);
            setError(null);
            speak("Camera stopped.");
        } else {
            // Start camera
            try {
                const constraints = {
                    video: {
                        facingMode: 'environment',
                        width: { ideal: 1280, min: 640 },
                        height: { ideal: 720, min: 480 }
                    },
                    audio: false
                };

                console.log('Getting user media...');
                const stream = await navigator.mediaDevices.getUserMedia(constraints);
                console.log('Got media stream:', stream);

                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    console.log('Set video source');
                    
                    // Handle video loading
                    const handleVideoReady = () => {
                        if (videoRef.current) {
                            videoRef.current.play().then(() => {
                                console.log('Video started playing successfully');
                                // Set states after successful play
                                setMediaStream(stream);
                                setIsCameraActive(true);
                                setError(null);
                                speak("Camera started. You can now ask questions about what I see.");
                            }).catch((error) => {
                                console.error('Video play error:', error);
                                setError('Failed to start video playback');
                            });
                        }
                    };

                    if (videoRef.current.readyState >= 1) {
                        // Video metadata already loaded
                        console.log('Video metadata already loaded');
                        handleVideoReady();
                    } else {
                        // Wait for metadata to load
                        console.log('Waiting for video metadata to load');
                        videoRef.current.onloadedmetadata = handleVideoReady;
                    }
                } else {
                    console.error('Video ref not available');
                    throw new Error('Video element not available');
                }
            } catch (error: any) {
                console.error('Camera error:', error);
                setIsCameraActive(false);
                setMediaStream(null);
                
                let errorMessage = 'Unable to access camera. ';
                if (error.name === 'NotAllowedError') {
                    errorMessage += 'Please allow camera permissions and try again.';
                } else if (error.name === 'NotFoundError') {
                    errorMessage += 'No camera found on this device.';
                } else {
                    errorMessage += 'Please check your camera settings and try again.';
                }

                setError(errorMessage);
                speak(errorMessage);
            }
        }
    };

    // Speech recognition setup
    useEffect(() => {
        if (!hasSpeechRecognition) return;

        const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();

        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
            setIsListening(true);
            setError(null);
        };

        recognition.onresult = (event: SpeechRecognitionEvent) => {
            const result = event.results[0][0];
            const transcript = result.transcript.trim();

            if (transcript && transcript.length > 2) {
                setCurrentQuestion(transcript);
                speak(`I heard: ${transcript}. Let me analyze what I can see.`, () => {
                    processQuestion(transcript);
                });
            } else {
                speak('I didn\'t catch that clearly. Please try asking your question again.');
                setIsProcessing(false);
            }
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
            console.error('Speech recognition error:', event.error);
            setIsListening(false);

            let errorMessage = '';
            switch (event.error) {
                case 'not-allowed':
                    errorMessage = 'Microphone access denied. Please allow microphone permissions and try again.';
                    break;
                case 'no-speech':
                    errorMessage = 'No speech detected. Please try speaking more clearly.';
                    break;
                case 'audio-capture':
                    errorMessage = 'No microphone found. Please check your microphone.';
                    break;
                case 'network':
                    errorMessage = 'Network error. Please check your internet connection.';
                    break;
                default:
                    errorMessage = 'Speech recognition failed. Please try again.';
            }

            if (errorMessage && event.error !== 'aborted') {
                setError(errorMessage);
                speak(errorMessage);
            }
            setIsProcessing(false);
        };

        recognitionRef.current = recognition;

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            stopSpeaking();
            if (speechTimeoutRef.current) {
                clearTimeout(speechTimeoutRef.current);
            }
            if (mediaStream) {
                mediaStream.getTracks().forEach(track => track.stop());
            }
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 via-blue-900 to-gray-900 text-white p-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-20">
                    <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                        
                    </h1>
                    <p className="text-gray-300"></p>
                </div>

                {/* Error Display */}
                {error && (
                    <div className="mb-6 bg-red-900/50 border border-red-500/50 rounded-lg p-4 text-center">
                        <p className="text-red-200">{error}</p>
                        <button
                            onClick={() => setError(null)}
                            className="mt-2 bg-red-600/50 hover:bg-red-600/70 text-white py-1 px-3 rounded text-sm transition-colors"
                        >
                            Dismiss
                        </button>
                    </div>
                )}

                {/* Camera Feed */}
                <div className="relative aspect-video bg-black rounded-lg overflow-hidden mb-6 border border-gray-700">
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover"
                    />
                    <canvas ref={canvasRef} className="hidden" />

                    {/* Processing Overlay */}
                    {capturedImage && isProcessing && (
                        <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                            <div className="text-center">
                                <div className="w-48 h-36 mx-auto mb-4 rounded overflow-hidden border border-blue-500/50">
                                    <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" />
                                </div>
                                <div className="animate-spin rounded-full h-8 w-8 border-3 border-blue-400 border-t-transparent mx-auto mb-2"></div>
                                <p className="text-white">Analyzing image...</p>
                            </div>
                        </div>
                    )}

                    {/* Listening Indicator */}
                    {isListening && (
                        <div className="absolute top-4 right-4">
                            <div className="bg-red-600/90 text-white px-3 py-1 rounded-full font-bold animate-pulse">
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                                    <span>Listening</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Camera Off State */}
                    {!isCameraActive && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Camera className="w-8 h-8 text-gray-300" />
                                </div>
                                <p className="text-gray-400">Camera is off</p>
                                <p className="text-gray-500 text-sm">Click Start Camera to begin</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Control Buttons */}
                <div className="flex flex-wrap justify-center gap-4 mb-6">
                    <button
                        onClick={toggleCamera}
                        className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                            isCameraActive
                                ? 'bg-red-600 hover:bg-red-700 text-white'
                                : 'bg-blue-600 hover:bg-blue-700 text-white'
                            }`}
                    >
                        <Camera size={20} />
                        <span>{isCameraActive ? 'Stop Camera' : 'Start Camera'}</span>
                    </button>

                    <button
                        onClick={startListening}
                        disabled={!isCameraActive || !hasSpeechRecognition}
                        className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                            !isCameraActive || !hasSpeechRecognition
                                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                : isListening
                                    ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse'
                                    : isProcessing
                                        ? 'bg-yellow-600 text-white'
                                        : 'bg-green-600 hover:bg-green-700 text-white'
                            }`}
                    >
                        {isListening ? (
                            <>
                                <MicOff size={20} />
                                <span>Stop Listening</span>
                            </>
                        ) : isProcessing ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                                <span>Processing...</span>
                            </>
                        ) : (
                            <>
                                <Mic size={20} />
                                <span>Ask Question</span>
                            </>
                        )}
                    </button>

                    <button
                        onClick={() => setSpeechEnabled(!speechEnabled)}
                        className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                            speechEnabled
                                ? 'bg-green-600 hover:bg-green-700 text-white'
                                : 'bg-gray-600 hover:bg-gray-700 text-white'
                            }`}
                    >
                        {speechEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
                        <span>{speechEnabled ? 'Audio On' : 'Audio Off'}</span>
                    </button>
                </div>

                {/* Current Question */}
                {currentQuestion && (
                    <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-4 mb-6">
                        <div className="flex items-center space-x-2 mb-2">
                            <Mic className="text-yellow-400" size={20} />
                            <h3 className="text-yellow-300 font-semibold">Your Question</h3>
                        </div>
                        <p className="text-white">"{currentQuestion}"</p>
                    </div>
                )}

                {/* AI Response */}
                {assistantResponse && (
                    <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                    <span className="text-sm">🤖</span>
                                </div>
                                <h3 className="font-semibold text-blue-300">AKSHI Response</h3>
                            </div>
                            <div className="flex space-x-2">
                                {isSpeaking ? (
                                    <button
                                        onClick={stopSpeaking}
                                        className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded transition-colors"
                                        title="Stop speaking"
                                    >
                                        <Pause size={16} />
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => speak(assistantResponse)}
                                        className="p-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded transition-colors"
                                        title="Repeat response"
                                    >
                                        <Play size={16} />
                                    </button>
                                )}
                            </div>
                        </div>
                        <p className="text-gray-100 leading-relaxed">{assistantResponse}</p>
                    </div>
                )}

                {/* Quick Commands */}
                <div className="mt-8 bg-white/5 rounded-lg p-6 border border-white/10">
                    <h3 className="text-gray-300 font-semibold mb-4 text-center">Try these voice commands:</h3>
                    <div className="flex flex-wrap justify-center gap-2">
                        {[
                            "What do you see?",
                            "Read the text",
                            "Describe the scene",
                            "Are there people?",
                            "What colors?",
                            "Count objects"
                        ].map((cmd, i) => (
                            <span key={i} className="bg-blue-900/30 px-3 py-1 rounded-full text-sm text-gray-300 border border-blue-500/20">
                                "{cmd}"
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default VisualAssistant;