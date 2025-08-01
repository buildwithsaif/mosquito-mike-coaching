export interface Call {
  id: number;
  title: string;
  description?: string;
  audio_file_path?: string;
  transcript?: string;
  duration?: number; // Duration in minutes
  created_at: string;
  updated_at: string;
  analyses?: CallAnalysis[];
  objections?: Objection[];
}

export interface CallAnalysis {
  id: number;
  call_id: number;
  analysis_type: string; // e.g., "coaching_feedback", "objection_handling"
  content: string;
  confidence_score?: number; // AI confidence score 0-1
  created_at: string;
}

export interface Objection {
  id: number;
  call_id: number;
  objection_text: string;
  objection_type?: string; // e.g., "price", "timing", "authority"
  timestamp?: number; // Time in call when objection occurred (seconds)
  response_text?: string; // How the objection was handled
  effectiveness_score?: number; // AI assessment of response effectiveness 0-1
  suggested_improvement?: string;
  is_resolved: boolean;
  created_at: string;
}

export interface CreateCallRequest {
  title: string;
  description?: string;
  audio_file_path?: string;
  transcript?: string;
  duration?: number;
}

export interface CallSummary {
  total_calls: number;
  total_duration: number;
  average_objections_per_call: number;
  resolution_rate: number;
  most_common_objection_type: string;
}

export interface ObjectionStats {
  type: string;
  count: number;
  average_effectiveness: number;
  resolution_rate: number;
}