import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
import {refreshAccessToken} from '../utils.js'

const ArrowRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const ArrowLeft = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

const UploadIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <polyline points="16 16 12 12 8 16" />
    <line x1="12" y1="12" x2="12" y2="21" />
    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
  </svg>
);

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);


function TextAnswer({ value, onChange }) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Type your answer here..."
      rows={4}
      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm
        text-green-950 outline-none focus:border-green-700 focus:bg-white transition-all
        placeholder:text-gray-300 resize-none"
    />
  );
}

function SingleSelect({ options, value, onChange }) {
  return (
    <div className="flex flex-col gap-3">
      {options.map((opt) => (
        <button
          key={opt.id}
          type="button"
          onClick={() => onChange([opt.id])}
          className={`flex items-center justify-between px-4 py-3.5 rounded-xl border-2 text-sm
            font-medium transition-all duration-150 text-left
            ${value.includes(opt.id)
              ? "border-green-900 bg-green-50 text-green-900"
              : "border-gray-200 bg-white text-gray-700 hover:border-green-300"
            }`}
        >
          <span>{opt.option_text}</span>
          {value.includes(opt.id) && (
            <div className="w-5 h-5 rounded-full bg-green-900 flex items-center justify-center shrink-0">
              <CheckIcon />
            </div>
          )}
        </button>
      ))}
    </div>
  );
}

function MultiSelect({ options, value, onChange }) {
  const toggle = (id) => {
    if (value.includes(id)) {
      onChange(value.filter((v) => v !== id));
    } else {
      onChange([...value, id]);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs text-gray-400">Select all that apply</p>
      {options.map((opt) => (
        <button
          key={opt.id}
          type="button"
          onClick={() => toggle(opt.id)}
          className={`flex items-center justify-between px-4 py-3.5 rounded-xl border-2 text-sm
            font-medium transition-all duration-150 text-left
            ${value.includes(opt.id)
              ? "border-green-900 bg-green-50 text-green-900"
              : "border-gray-200 bg-white text-gray-700 hover:border-green-300"
            }`}
        >
          <span>{opt.option_text}</span>
          <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all
            ${value.includes(opt.id) ? "bg-green-900 border-green-900" : "border-gray-300"}`}>
            {value.includes(opt.id) && <CheckIcon />}
          </div>
        </button>
      ))}
    </div>
  );
}

function FileUpload({ value, onChange }) {
  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) onChange(file);
  };

  return (
    <label className={`flex flex-col items-center justify-center gap-3 px-6 py-10 rounded-2xl
      border-2 border-dashed cursor-pointer transition-all
      ${value ? "border-green-700 bg-green-50" : "border-gray-200 bg-gray-50 hover:border-green-300"}`}>
      <input type="file" className="hidden" onChange={handleFile} />
      <div className={`${value ? "text-green-700" : "text-gray-400"}`}>
        <UploadIcon />
      </div>
      {value ? (
        <div className="flex flex-col items-center gap-1">
          <p className="text-sm font-medium text-green-800">{value.name}</p>
          <p className="text-xs text-green-600">Tap to change file</p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-1">
          <p className="text-sm font-medium text-gray-600">Upload a file</p>
          <p className="text-xs text-gray-400">Tap to browse</p>
        </div>
      )}
    </label>
  );
}

export default function Questionnaire() {
  const navigate = useNavigate();
  const location = useLocation();
  const { selected_product_id, selected_service_id } = location.state ?? {};

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("access_token");
  useEffect(() => {
    const fetchQuestions = async () => {
    try {
      let token = localStorage.getItem("access_token");

      let response = await fetch(
        `${VITE_API_BASE_URL}api/questions/?service_id=${selected_service_id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 401) {
        try {
          const newToken = await refreshAccessToken();

          response = await fetch(
            `${VITE_API_BASE_URL}api/questions/?service_id=${selected_service_id}`,
            {
              headers: { Authorization: `Bearer ${newToken}` },
            }
          );
        } catch (err) {
          navigate("/signup");
          return;
        }
      }

      if (!response.ok) throw new Error("Questions are not loaded");

      const data = await response.json();
      setQuestions(data);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

    if (selected_service_id) fetchQuestions();
    else setError("Service ID missing. Please go back and select a product.");
  }, [selected_service_id]);

  const currentQuestion = questions[currentIndex];
  const isLast = currentIndex === questions.length - 1;
  const progress = questions.length ? ((currentIndex + 1) / questions.length) * 100 : 0;

  const currentAnswer = answers[currentQuestion?.id];

  const isAnswered = () => {
    if (!currentQuestion) return false;
    const ans = answers[currentQuestion.id];
    if (currentQuestion.question_type === "text") return ans && ans.trim().length > 0;
    if (currentQuestion.question_type === "file_upload") return ans instanceof File;
    if (["single_select", "multi_select"].includes(currentQuestion.question_type))
      return Array.isArray(ans) && ans.length > 0;
    return false;
  };

  const setAnswer = (value) => {
    setAnswers({ ...answers, [currentQuestion.id]: value });
  };
  const submitAnswer = async () => {
    setSubmitting(true);
    setError("");

    try {
      const q = currentQuestion;
      let body;
      let headers = { Authorization: `Bearer ${token}` };

      if (q.question_type === "file_upload") {
        body = new FormData();
        body.append("question", q.id);
        body.append("file_answer", answers[q.id]);
      } else {
        headers["Content-Type"] = "application/json";
        const payload = { question: q.id };
        if (q.question_type === "text") payload.text_answer = answers[q.id];
        else payload.selected_options = answers[q.id];
        body = JSON.stringify(payload);
      }

      const response = await fetch(`${VITE_API_BASE_URL}api/answers/`, {
        method: "POST",
        headers,
        body,
      });

      if (!response.ok) throw new Error("Answer not saved. Try again.");

      if (isLast) {
        navigate("/checkout", {
          state: { selected_product_id, selected_service_id },
        });
      } else {
        setCurrentIndex(currentIndex + 1);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-green-900 font-medium">Loading questions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <p className="text-red-500 text-sm text-center">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-10 px-4 bg-white font-sans">
      <div className="w-full max-w-sm flex flex-col gap-6">

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-400">
              Question {currentIndex + 1} of {questions.length}
            </span>
            <span className="text-xs font-semibold text-green-700">
              {Math.round(progress)}% complete
            </span>
          </div>
          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-700 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <h2 className="text-xl font-bold text-green-950 leading-snug">
            {currentQuestion?.question_text}
          </h2>

          {currentQuestion?.question_type === "text" && (
            <TextAnswer
              value={currentAnswer || ""}
              onChange={setAnswer}
            />
          )}
          {currentQuestion?.question_type === "single_select" && (
            <SingleSelect
              options={currentQuestion.options}
              value={currentAnswer || []}
              onChange={setAnswer}
            />
          )}
          {currentQuestion?.question_type === "multi_select" && (
            <MultiSelect
              options={currentQuestion.options}
              value={currentAnswer || []}
              onChange={setAnswer}
            />
          )}
          {currentQuestion?.question_type === "file_upload" && (
            <FileUpload
              value={currentAnswer || null}
              onChange={setAnswer}
            />
          )}
        </div>
                                                                                                                                                                                               
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <div className="flex gap-3 mt-2">
          {currentIndex > 0 && (
            <button
              onClick={() => setCurrentIndex(currentIndex - 1)}
              className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl
                border-2 border-gray-200 text-gray-600 text-sm font-medium hover:border-green-300 transition-all"
            >
              <ArrowLeft />
              Back
            </button>
          )}
          <button
            onClick={submitAnswer}
            disabled={!isAnswered() || submitting}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl
              bg-green-900 text-white text-sm font-semibold transition-all
              hover:bg-green-800 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {submitting
              ? "Saving..."
              : isLast
              ? "Submit & Continue"
              : (
                <>
                  Next
                  <ArrowRight />
                </>
              )
            }
          </button>
        </div>

      </div>
    </div>
  );
}
