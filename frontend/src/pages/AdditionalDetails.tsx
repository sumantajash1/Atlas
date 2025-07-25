import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useUser } from "@/context/UserContext";
import { redirect, useNavigate } from "react-router-dom";

export default function AdditionalDetails() {
    const { user, login } = useUser();
    const [mobileNum, setMobileNum] = useState("");
    const [sleepCycle, setSleepCycle] = useState("");
    const [maxTimePerDay, setMaxTimePerDay] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const navigate = useNavigate();



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setLoading(true);

        try {
            const res = await api.post("/user/updateDetails", {
                userId: user?.userId,
                mobileNum,
                sleepCycle,
                maxTimePerDay: Number(maxTimePerDay),
            });
            setSuccess("Details updated successfully!");

            if (res.data) {
                login({ ...user, ...res.data });
                navigate("/");
            }
        } catch (err: any) {
            setError(
                err.response?.data?.message ||
                err.message ||
                "Failed to update details"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
    if (user?.mobileNum) {
      navigate("/");
    }
  }, [user, navigate]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950">
            <form
                onSubmit={handleSubmit}
                className="bg-slate-900 p-8 rounded-xl shadow-lg w-full max-w-md"
            >
                <h2 className="text-2xl font-bold text-white mb-6 text-center">
                    Additional Details
                </h2>
                {error && (
                    <div className="mb-4 text-red-400 bg-red-900/20 p-2 rounded">{error}</div>
                )}
                {success && (
                    <div className="mb-4 text-green-400 bg-green-900/20 p-2 rounded">{success}</div>
                )}
                <div className="mb-4">
                    <label className="block text-slate-200 mb-2" htmlFor="mobileNum">
                        Mobile Number
                    </label>
                    <input
                        id="mobileNum"
                        type="tel"
                        className="w-full p-2 rounded bg-slate-800 text-white"
                        value={mobileNum}
                        onChange={(e) => setMobileNum(e.target.value)}
                        placeholder="Enter your mobile number"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-slate-200 mb-2" htmlFor="sleepCycle">
                        Sleep Cycle
                    </label>
                    <input
                        id="sleepCycle"
                        type="text"
                        className="w-full p-2 rounded bg-slate-800 text-white"
                        value={sleepCycle}
                        onChange={(e) => setSleepCycle(e.target.value)}
                        placeholder="e.g. 11pm-7am"
                        required
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-slate-200 mb-2" htmlFor="maxTimePerDay">
                        Max Time to Invest Per Day (hours)
                    </label>
                    <input
                        id="maxTimePerDay"
                        type="number"
                        min="1"
                        max="24"
                        className="w-full p-2 rounded bg-slate-800 text-white"
                        value={maxTimePerDay}
                        onChange={(e) => setMaxTimePerDay(e.target.value)}
                        placeholder="e.g. 3"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 rounded transition"
                    disabled={loading}
                >
                    {loading ? "Saving..." : "Save"}
                </button>
            </form>
        </div>
    );
}