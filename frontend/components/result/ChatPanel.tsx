'use client';

import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { api } from '@/lib/api';
import { AskResponse } from '@/types';
import {
  MessageSquare,
  Send,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Bot,
  AlertCircle,
  BookOpen,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  refusal?: boolean;
  evidence?: AskResponse['evidence'];
}

interface ChatPanelProps {
  runId: string;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({ runId }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputVal, setInputVal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [openSourcesId, setOpenSourcesId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Suggested questions for waterway analysis
  const exampleQuestions = [
    'What was detected?',
    'What does this result mean?',
    'Could this indicate a pollution concern?',
    'What should I look at next?',
  ];

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (questionText?: string) => {
    const text = (questionText || inputVal).trim();

    if (!text || isLoading) return;

    setErrorMessage(null);

    const userMsgId = `usr-${Date.now()}`;

    setMessages((prev) => [
      ...prev,
      {
        id: userMsgId,
        sender: 'user',
        text,
      },
    ]);

    setInputVal('');
    setIsLoading(true);

    try {
      const response = await api.ask(runId, text);
      const botMsgId = `bot-${Date.now()}`;

      setMessages((prev) => [
        ...prev,
        {
          id: botMsgId,
          sender: 'assistant',
          text: response.answer,
          refusal: response.refusal,
          evidence: response.evidence,
        },
      ]);
    } catch (err) {
      setErrorMessage('Unable to generate an answer right now.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleRetry = () => {
    const lastUserMsg = [...messages]
      .reverse()
      .find((m) => m.sender === 'user');

    if (lastUserMsg) {
      handleSend(lastUserMsg.text);
    }
  };

  // Format verified facts into human-readable labels
  const formatFactKey = (key: string): string => {
    const map: Record<string, string> = {
      detectionCount: 'Visible Detections Count',
      visibleDetections: 'Visible Detections',
      activeThreshold: 'Confidence Threshold',
      threshold: 'Confidence Threshold',
      modelVersion: 'Detector Model',
      imageCheck: 'Benchmark Scene Match',
      evaluationPrecisionRange: 'Evaluated Precision Band',
      evaluationDatasets: 'Benchmark Datasets',
      targetClass: 'Detection Target Class',
      detectionType: 'Detection Scope',
      spatialScope: 'Spatial Boundary',
      waterQualityScope: 'Water Quality Evaluation',
      chemicalAssessment: 'Chemical Assessment',
      safetyStatus: 'Safety Scope',
      debrisType: 'Identified Debris Type',
      domainShiftRisk: 'Domain Shift Sensitivity',
      knownFalsePositives: 'Potential False Positives',
      classesCount: 'Trained Classes',
      materialClassificationStatus: 'Material Classification',
      queryStatus: 'Query Scope',
      availableData: 'Supported Evidence Data',
      suggestedAction: 'Recommended Next Step',
      step1: 'Step 1',
      step2: 'Step 2',
      step3: 'Step 3',
    };

    return (
      map[key] ||
      key
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, (str) => str.toUpperCase())
    );
  };

  // Filter out internal technical keys
  const getVisibleFacts = (
    facts?: Record<string, string | number>
  ) => {
    if (!facts) return [];

    return Object.entries(facts).filter(
      ([k]) => k !== 'runId' && k !== 'chunkId'
    );
  };

  return (
    <div className="border border-slate-200/80 rounded-xl bg-white p-5 sm:p-6 space-y-4 shadow-xs">

      {/* Card Header */}
      <div className="pb-3 border-b border-slate-100 flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0 mt-0.5">
          <MessageSquare className="w-4 h-4" />
        </div>

        <div>
          <h3 className="text-sm font-bold text-slate-900 leading-tight">
            Ask about this result
          </h3>

          <p className="text-xs text-slate-500 mt-0.5">
            Ask questions about the detected objects and this image.
          </p>
        </div>
      </div>

      {/* Messages Conversation Area */}
      <div className="space-y-3.5 max-h-[380px] overflow-y-auto pr-1">

        {messages.length === 0 ? (

          /* Empty State */
          <div className="py-6 px-4 text-center border border-dashed border-slate-200 rounded-xl bg-slate-50/50 space-y-3">

            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-800">
                Have a question about this result?
              </p>

              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                You can ask about the detected objects, what the result means,
                or how to interpret the model output.
              </p>
            </div>

            <div className="pt-1 flex flex-wrap gap-1.5 justify-center">
              {exampleQuestions.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => handleSend(q)}
                  disabled={isLoading}
                  className="text-xs px-3 py-1.5 rounded-full border border-slate-200 bg-white text-slate-700 hover:text-blue-700 hover:border-blue-300 hover:bg-blue-50/40 transition-colors shadow-2xs disabled:opacity-50 text-left"
                >
                  {q}
                </button>
              ))}
            </div>

          </div>

        ) : (

          /* Conversation Messages */
          messages.map((m) => {
            const isUser = m.sender === 'user';
            const visibleFacts = getVisibleFacts(m.evidence?.facts);
            const hasSources =
              m.evidence?.sources &&
              m.evidence.sources.length > 0;

            const hasEvidence =
              visibleFacts.length > 0 || hasSources;

            const isSourcesOpen =
              openSourcesId === m.id;

            return (
              <div
                key={m.id}
                className={`space-y-1.5 ${
                  isUser
                    ? 'ml-auto max-w-[85%]'
                    : 'mr-auto max-w-[95%]'
                }`}
              >

                <div
                  className={`flex items-start gap-2.5 ${
                    isUser
                      ? 'justify-end'
                      : 'justify-start'
                  }`}
                >

                  {!isUser && (
                    <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 text-slate-600 flex items-center justify-center shrink-0 mt-0.5">
                      <Bot className="w-3.5 h-3.5 text-slate-700" />
                    </div>
                  )}

                  <div
                    className={`p-3 sm:p-3.5 rounded-xl text-xs sm:text-sm leading-relaxed ${
                      isUser
                        ? 'bg-blue-600 text-white shadow-2xs font-normal'
                        : m.refusal
                        ? 'bg-slate-50 text-slate-700 border border-slate-200/80 shadow-2xs'
                        : 'bg-slate-50/80 text-slate-900 border border-slate-200/80 shadow-2xs'
                    }`}
                  >

                    {isUser ? (
                      <p className="whitespace-pre-wrap">
                        {m.text}
                      </p>
                    ) : (
                      <div
                        className="
                          max-w-none
                          [&>p]:mb-2
                          [&>p:last-child]:mb-0
                          [&>ul]:mb-2
                          [&>ol]:mb-2
                          [&>ul]:pl-5
                          [&>ol]:pl-5
                          [&>ul]:list-disc
                          [&>ol]:list-decimal
                          [&_li]:mb-1
                          [&_li:last-child]:mb-0
                          [&_strong]:font-semibold
                          [&_em]:italic
                        "
                      >
                        <ReactMarkdown>
                          {m.text}
                        </ReactMarkdown>
                      </div>
                    )}

                  </div>
                </div>

                {/* Secondary Sources / Evidence */}
                {!isUser && hasEvidence && (
                  <div className="ml-8 border border-slate-200/80 rounded-lg bg-white overflow-hidden text-xs">

                    <button
                      type="button"
                      onClick={() =>
                        setOpenSourcesId(
                          isSourcesOpen ? null : m.id
                        )
                      }
                      className="w-full px-3 py-1.5 flex items-center justify-between text-[11px] font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                      aria-expanded={isSourcesOpen}
                    >

                      <span className="flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                        <span>Sources</span>
                      </span>

                      {isSourcesOpen ? (
                        <span className="flex items-center gap-0.5 text-slate-500">
                          <span>Collapse</span>
                          <ChevronUp className="w-3 h-3" />
                        </span>
                      ) : (
                        <span className="flex items-center gap-0.5 text-slate-500">
                          <span>Expand</span>
                          <ChevronDown className="w-3 h-3" />
                        </span>
                      )}

                    </button>

                    {isSourcesOpen && (
                      <div className="p-3 pt-2 border-t border-slate-100 bg-slate-50/60 space-y-2.5 text-[11px]">

                        {/* Verified Grounding Facts */}
                        {visibleFacts.length > 0 && (
                          <div className="space-y-1">

                            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 block">
                              Verified Facts
                            </span>

                            <div className="bg-white p-2.5 rounded-md border border-slate-200/80 space-y-1">

                              {visibleFacts.map(([k, v]) => (
                                <div
                                  key={k}
                                  className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-0.5 sm:gap-2"
                                >
                                  <span className="text-slate-500 font-sans">
                                    {formatFactKey(k)}:
                                  </span>

                                  <span className="text-slate-900 font-mono font-semibold">
                                    {String(v)}
                                  </span>
                                </div>
                              ))}

                            </div>
                          </div>
                        )}

                        {/* Research Sources List */}
                        {hasSources && (
                          <div className="space-y-1">

                            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 block">
                              Document Citations
                            </span>

                            <ul className="space-y-1">

                              {m.evidence!.sources.map(
                                (s, idx) => (
                                  <li
                                    key={idx}
                                    className="bg-white p-2 rounded-md border border-slate-200/80 flex items-center justify-between text-slate-800"
                                  >
                                    <span className="font-medium">
                                      {s.name}
                                    </span>

                                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200">
                                      Reference
                                    </span>
                                  </li>
                                )
                              )}

                            </ul>
                          </div>
                        )}

                      </div>
                    )}

                  </div>
                )}

              </div>
            );
          })

        )}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-start gap-2.5 mr-auto max-w-[90%]">

            <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 text-slate-600 flex items-center justify-center shrink-0 mt-0.5">
              <Bot className="w-3.5 h-3.5 text-slate-700" />
            </div>

            <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 text-xs text-slate-600 flex items-center gap-2">

              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />

              <span>
                Preparing an evidence-grounded answer...
              </span>

            </div>
          </div>
        )}

        {/* Error State */}
        {errorMessage && (
          <div className="p-3 rounded-lg bg-red-50 text-red-800 border border-red-200 flex items-center justify-between text-xs">

            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorMessage}</span>
            </div>

            <button
              type="button"
              onClick={handleRetry}
              className="inline-flex items-center gap-1 font-semibold text-red-700 hover:text-red-900 underline"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Retry</span>
            </button>

          </div>
        )}

        <div ref={messagesEndRef} />

      </div>

      {/* Suggested Questions */}
      {messages.length > 0 && (
        <div className="space-y-1.5 pt-2 border-t border-slate-100">

          <span className="text-[11px] font-semibold text-slate-500 block">
            Suggested questions:
          </span>

          <div className="flex flex-wrap gap-1.5">

            {exampleQuestions.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => handleSend(q)}
                disabled={isLoading}
                className="text-xs px-2.5 py-1 rounded-full border border-slate-200 bg-white text-slate-700 hover:text-blue-700 hover:border-blue-300 hover:bg-blue-50/40 transition-colors disabled:opacity-50 text-left"
              >
                {q}
              </button>
            ))}

          </div>
        </div>
      )}

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="pt-1"
      >

        <div className="flex items-center gap-2 border border-slate-200 rounded-xl bg-white px-3.5 py-2 focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600 transition-all">

          <textarea
            ref={textareaRef}
            rows={1}
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about this result..."
            disabled={isLoading}
            aria-label="Ask about this result"
            className="flex-1 text-xs sm:text-sm bg-transparent text-slate-900 placeholder:text-slate-400 focus:outline-none resize-none max-h-24 py-1"
          />

          <button
            type="submit"
            disabled={!inputVal.trim() || isLoading}
            aria-label="Send message"
            className="p-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-30 disabled:hover:bg-blue-600 transition-colors shrink-0 shadow-2xs"
          >
            <Send className="w-3.5 h-3.5" />
          </button>

        </div>

        <p className="text-[10px] text-slate-400 mt-1 pl-1">
          Press{' '}
          <kbd className="font-mono bg-slate-100 px-1 py-0.2 rounded border border-slate-200 text-slate-600">
            Enter
          </kbd>{' '}
          to send,{' '}
          <kbd className="font-mono bg-slate-100 px-1 py-0.2 rounded border border-slate-200 text-slate-600">
            Shift + Enter
          </kbd>{' '}
          for newline
        </p>

      </form>
    </div>
  );
};