import React, { useEffect, useState } from "react";

interface LogEntry {
  timestamp: string;
  action: string;
  details: any;
}

const Docs: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/docs")
      .then((res) => res.json())
      .then((data) => setLogs(data))
      .catch((err) => console.error("Failed to fetch logs", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-6 font-display">
          System Logs & Documentation
        </h1>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
              Recent Activity
            </h2>
          </div>

          {loading ? (
            <div className="p-8 text-center text-slate-500">
              Loading logs...
            </div>
          ) : logs.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              No logs available.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {logs
                .slice()
                .reverse()
                .map((log, index) => (
                  <div
                    key={index}
                    className="p-4 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-mono text-xs text-slate-400">
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-medium ${
                          log.action.includes("Success")
                            ? "bg-green-100 text-green-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {log.action}
                      </span>
                    </div>
                    <pre className="mt-2 bg-slate-900 text-slate-300 p-3 rounded-lg text-xs overflow-x-auto font-mono">
                      {JSON.stringify(log.details, null, 2)}
                    </pre>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Docs;
