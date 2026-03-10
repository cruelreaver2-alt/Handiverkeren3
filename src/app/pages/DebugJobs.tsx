import { useState, useEffect } from "react";
import { Header } from "../components/Header";
import { projectId, publicAnonKey } from "/utils/supabase/info";

export function DebugJobs() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [testJobId, setTestJobId] = useState("req-demo-001");
  const [singleJob, setSingleJob] = useState<any>(null);
  const [singleJobError, setSingleJobError] = useState("");

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-8d200dba/requests`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${await response.text()}`);
      }

      const data = await response.json();
      console.log("Jobs loaded:", data);
      setJobs(data.requests || []);
    } catch (err: any) {
      console.error("Error loading jobs:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadSingleJob = async () => {
    setSingleJob(null);
    setSingleJobError("");
    
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-8d200dba/requests/${testJobId}`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(JSON.stringify(data, null, 2));
      }

      console.log("Single job loaded:", data);
      setSingleJob(data.request);
    } catch (err: any) {
      console.error("Error loading single job:", err);
      setSingleJobError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header variant="simple" title="Debug - Jobs API" />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* GET /requests */}
        <div className="bg-white rounded-lg border border-[#E5E7EB] p-6 mb-6">
          <h2 className="text-xl font-bold text-[#111827] mb-4">
            GET /requests - All Jobs
          </h2>

          {loading && <p className="text-[#6B7280]">Loading...</p>}
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-red-600 font-mono text-sm">{error}</p>
            </div>
          )}

          {!loading && !error && (
            <div>
              <p className="text-[#6B7280] mb-4">
                Found <strong>{jobs.length}</strong> jobs
              </p>
              <div className="space-y-2 max-h-96 overflow-auto">
                {jobs.map((job, idx) => (
                  <div
                    key={idx}
                    className="bg-[#F3F4F6] rounded p-3 font-mono text-sm"
                  >
                    <div className="text-[#E07B3E] font-semibold">
                      {job.id}
                    </div>
                    <div className="text-[#111827]">{job.title}</div>
                    <div className="text-[#6B7280] text-xs">
                      Category: {job.category} | Status: {job.status}
                    </div>
                  </div>
                ))}
              </div>
              <pre className="mt-4 bg-[#F3F4F6] rounded p-4 text-xs overflow-auto max-h-96">
                {JSON.stringify(jobs, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* GET /requests/:id */}
        <div className="bg-white rounded-lg border border-[#E5E7EB] p-6">
          <h2 className="text-xl font-bold text-[#111827] mb-4">
            GET /requests/:id - Single Job
          </h2>

          <div className="mb-4">
            <label className="block text-sm font-medium text-[#111827] mb-2">
              Job ID:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={testJobId}
                onChange={(e) => setTestJobId(e.target.value)}
                className="flex-1 h-10 px-3 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17384E]"
                placeholder="req-demo-001"
              />
              <button
                onClick={loadSingleJob}
                className="h-10 px-6 bg-[#17384E] text-white rounded-lg font-semibold hover:bg-[#1a4459] transition-colors"
              >
                Load
              </button>
            </div>
          </div>

          {singleJobError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-red-600 font-mono text-sm whitespace-pre-wrap">
                {singleJobError}
              </p>
            </div>
          )}

          {singleJob && (
            <div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <p className="text-green-600 font-semibold">✓ Job loaded successfully!</p>
              </div>
              <pre className="bg-[#F3F4F6] rounded p-4 text-xs overflow-auto max-h-96">
                {JSON.stringify(singleJob, null, 2)}
              </pre>
            </div>
          )}

          <div className="mt-4 text-xs text-[#6B7280]">
            <p className="font-semibold mb-2">Test these IDs:</p>
            <div className="flex flex-wrap gap-2">
              {[...Array(8)].map((_, i) => {
                const id = `req-demo-00${i + 1}`;
                return (
                  <button
                    key={id}
                    onClick={() => {
                      setTestJobId(id);
                      setTimeout(loadSingleJob, 100);
                    }}
                    className="px-2 py-1 bg-[#E5E7EB] rounded hover:bg-[#D1D5DB] transition-colors"
                  >
                    {id}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
