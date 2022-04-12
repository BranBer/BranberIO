export default interface project {
  id: string;
  name: string;
  description: string;
  repo: {
    link: string;
    repo: string;
    owner: string;
  };
  projectLink: string;
  images: string[];
  tags: string[];
}
