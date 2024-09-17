import ProjectCards from "@/components/ProjectCards";
import Layout from "../layouts/Layout";
import AddProject from "@/components/AddProject"; // Import the new component

function Taskboard() {
  return (
    <Layout>
      <div className="max-h-[calc(100vh-185px)] flex flex-col">
        <div className="flex-grow overflow-auto">
          <ProjectCards />
        </div>
        <AddProject />
      </div>
    </Layout>
  );
}

export default Taskboard;
