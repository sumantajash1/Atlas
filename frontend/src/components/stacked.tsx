import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CategorySelect } from "@/components/ui/category-select";
import * as React from "react";
import { api } from "@/lib/api";
import { useNavigate } from "react-router-dom";

const categoryOptions = [
  { label: "Leisure", value: "leisure" },
  { label: "AI Powered", value: "ai-powered" },
  { label: "Custom", value: "custom" },
];

const depthOptions = [
  { label: "Overview", value: "overview" },
  { label: "Concise", value: "concise" },
  { label: "Detailed", value: "detailed" },
];

export default function StackedForm() {
  const navigate = useNavigate();

  const [category, setCategory] = React.useState("");
  const [goal, setGoal] = React.useState("");
  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");
  const [depth, setDepth] = React.useState("");
  const [syllabus, setSyllabus] = React.useState("");
  const [additionalDetails, setAdditionalDetails] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<any>(null);
  const [maxHourPerDay, setMaxHourPerDay] = React.useState<number>();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!category) return setError("Please select a category!");
    if (!depth) return setError("Please select a depth!");

    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await api.post("/task/createTasks", {
        category,
        label: goal,
        startDate,
        endDate,
        depth,
        syllabus,
        extraInstruction: additionalDetails,
        maxTimePerDayTask: maxHourPerDay,
      });
      const { data } = response;
      if (data) navigate(`/goal/${data}`);
      else console.log("Failed to create mindmap!");
      setResult(data);
    } catch (err: any) {
      console.log("Error", err);
      setError(err.response?.data?.message || err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="pt-10">
      <h1 className="text-5xl text-center text-slate-100 font-bold">
        Plan your Goal
      </h1>
      <div className="container mx-auto px-4 md:px-6 2xl:max-w-[1400px] py-10 bg-slate-950 max-w-[50%]">
        <Card className="bg-slate-900 border-0 shadow-none">
          <CardHeader>
            <CardTitle className="text-slate-100">Goal Details</CardTitle>
            <div className="mt-4">
              <Label htmlFor="category" className="text-slate-100 mb-2 block">
                Category
              </Label>
              {error?.includes("category") && (
                <div className="text-red-600 mb-2">{error}</div>
              )}
              <CategorySelect
                value={category}
                onChange={setCategory}
                categoryOptions={categoryOptions}
              />
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="space-y-8">
                {/* Profile section */}
                <div>
                  <div className="space-y-2">
                    <Label htmlFor="goal" className="text-slate-100">
                      Goal
                    </Label>
                    <Input
                      id="goal"
                      className="text-white"
                      placeholder="e.g. Study System Design"
                      value={goal}
                      onChange={(e) => setGoal(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxHours" className="text-slate-100">
                    Maximum hours you want to spend on this goal per day
                  </Label>
                  <Input
                    id="maxHours"
                    type="number"
                    min="0"
                    max="24"
                    step="1"
                    className="text-white"
                    placeholder="e.g. 2"
                    value={maxHourPerDay}
                    onChange={(e) => setMaxHourPerDay(Number(e.target.value))}
                    required
                  />
                </div>

                {/* Additional Details */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="start-date" className="text-slate-100">
                      Start Date
                    </Label>
                    <Input
                      type="date"
                      id="start-date"
                      className="text-slate-400"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="end-date" className="text-slate-100">
                      End Date
                    </Label>
                    <Input
                      type="date"
                      id="end-date"
                      className="text-slate-400"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>

                  <div className="my-2">
                    <Label
                      htmlFor="depth"
                      className="text-slate-100 mb-2 block"
                    >
                      Depth
                    </Label>
                    {error?.includes("depth") && (
                      <div className="text-red-600 mb-2">{error}</div>
                    )}
                    <CategorySelect
                      value={depth}
                      onChange={setDepth}
                      categoryOptions={depthOptions}
                    />
                  </div>
                </div>

                {category === "ai-powered" && (
                  <div>
                    <div className="space-y-2">
                      <Label htmlFor="syllabus" className="text-slate-100">
                        Syllabus (Optional)
                      </Label>
                      <Textarea
                        id="syllabus"
                        className="text-white"
                        placeholder="Provide us your syllabus here"
                        value={syllabus}
                        onChange={(e) => setSyllabus(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                <div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="additional-details"
                      className="text-slate-100"
                    >
                      Additional Details (Optional)
                    </Label>
                    <Textarea
                      id="additional-details"
                      className="text-white"
                      placeholder="Please provide any additional details here"
                      value={additionalDetails}
                      onChange={(e) => setAdditionalDetails(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button
                    className={`hover:cursor-pointer bg-neutral-950 ${
                      loading && "animate-pulse"
                    }`}
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? "Generating..." : "Generate"}
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
