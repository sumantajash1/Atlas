import MindMap from "@/components/MindMap";
import { Button } from "@/components/ui/button";
import { useUser } from "@/context/UserContext";
import { api } from "@/lib/api";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function Goal() {
  const { id } = useParams();
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [btnLoading, setBtnLoading] = useState(false);
  console.log("asifs data", data);
  const { user } = useUser()
  const navigate = useNavigate()

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await api.get(`/task/${id}`);
        setData(res.data)
      } catch (err) {
        setError(err);
        console.log("Error at fetching mindmap", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  console.log("asifs mindmap", data);

  const handleImport = () => {
    async function imp() {
      setBtnLoading(true);
      try {
        const res = await api.post("/task/scheduleTasks", id, { headers: { "Content-Type": "text/plain" } })
        if (res.status === 200) navigate("/calendar")
      } catch (err) {
        console.log("Error at importing tasks to calendar", err);
      } finally {
        setBtnLoading(false);
      }
    }

    imp();
  }


  if (loading) return <div className="text-center">Loading...</div>;
  if (error || !data) return <div className="text-center">Failed to Fetch</div>;

  return (
    <div>
      <Button variant="custom" className="fixed top-5 right-5 w-[180px] hover:cursor-pointer z-[100]" onClick={handleImport}>{btnLoading ? `Importing` : `Import to Calendar`}</Button>
      <MindMap data={data} />
    </div>
  );
}

export default Goal;
