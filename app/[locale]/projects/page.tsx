import { getAllProjects } from "@/sanity/lib/client";

export default async function ProjectsPage() {
  const projects = await getAllProjects();

  return (
    <main>
      <h1>Projects</h1>

      {projects.map((project) => (
        <div key={project.slug?.current}>
          <h2>{project.title}</h2>
          <p>{project.city}</p>
          <p>{project.description}</p>
        </div>
      ))}
    </main>
  );
}